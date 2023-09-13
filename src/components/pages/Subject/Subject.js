import React, { useContext, useState } from 'react';
import AddSubjectModal from './AddSubjectModal';
import EditSubjectModal from './EditSubjectModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import UploadFile from '../../UploadFile/UploadFile.jsx'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

const Subject = () => {
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateSubject, setUpdateSubject] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [fileList, setFileList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { data: subjects, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('graduation_thesis_course')
            .select(`
                *,
                majors(major_name, major_code)
            `)
    })

    const handleDeleteSubject = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('graduation_thesis_course')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete subject successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete subject failed',
            description: error.message
        })

    }
    function getDataFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", err => reject(err));

            reader.readAsText(file);
        });
    }
    const uploadFile = async file => {
        const data = await getDataFromFile(file);
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=graduation_thesis_course', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: {
                data
            }
        })
        if (!error) {
            openNotification({ message: 'Imported successfully' })
            await refetchData({});
            return;
        }
        openNotification({ type: 'error', message: 'Import failed', description: error.message })
    }
    const handleOnChangeImportFile = async (info) => {
        setFileList([...info.fileList]);
    }

    const ConfirmModal = ({ id }) => {
        confirm({
            title: 'Bạn có thực sự muốn xóa?',
            icon: <ExclamationCircleFilled />,
            content: 'Dữ liệu sẽ không thể khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            confirmLoading: confirmLoading,
            onOk() {
                handleDeleteSubject({ id })
            },
            onCancel() { },
        });

    };

    return (
        <>
            <h4 className='title'>Quản lý học phần</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" onClick={() => setOpenAddModal(!openAddModal)}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </div>
                <UploadFile validTypes={['text/csv']} fileList={fileList} setFileList={setFileList} title="Import from csv" onChange={handleOnChangeImportFile}
                    customRequest={async ({ file, onSuccess }) => {
                        await uploadFile(file)
                        onSuccess("ok")
                    }}
                    maxCount={1}
                />
            </div>}
            <table className="table table-bordered table-sm table-responsive table-striped table-hover">
                <thead className='table-head'>
                    <tr>
                        <th scrope="col">STT</th>
                        <th scrope="col">Mã học phần</th>
                        <th scrope="col">Tên học phần</th>
                        <th scrope="col">Tên ngành</th>
                        <th scrope="col">Số tín chỉ</th>
                        <th scrope="col">Hệ số</th>
                        {
                            isAdmin && <th scrope="col">Thao tác</th>
                        }

                    </tr>
                </thead>
                <tbody className='position-relative'>
                    {
                        subjects.length ?
                            subjects?.map(({ course_code, course_name, course_credits, credit_coefficient, id, majors }, index) => <tr key={course_code}>
                                <th scrope="row">{index + 1}</th>
                                <td>{course_code}</td>
                                <td>{course_name}</td>
                                <td>{majors.major_name}</td>
                                <td>{course_credits}</td>
                                <td>{credit_coefficient}</td>
                                {isAdmin &&
                                    <td>
                                        <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                            setUpdateSubject({
                                                id,
                                                course_code, course_name, course_credits, credit_coefficient,
                                                major_code: majors.major_code,
                                            })
                                            setOpenEditModal(!openEditModal)
                                        }}></i>
                                        <i role="button" className="fa-solid fa-trash mx-2" onClick={() => ConfirmModal({ id })}></i>
                                    </td>
                                }
                            </tr>)
                            :
                            <tr>
                                <td colSpan={7} className="py-3"><i className="fa-solid fa-box-archive me-4 fa-xl"></i>No data</td>
                            </tr>


                    }

                </tbody>
            </table>
            <AddSubjectModal isOpen={openAddModal} refetchData={refetchData} />
            <EditSubjectModal isOpen={openEditModal} setUpdateSubject={setUpdateSubject} updateSubject={updateSubject} refetchData={refetchData} />

        </>
    );
};

export default Subject;