import React, { useContext, useState } from 'react';
import AddSubjectModal from './AddSubjectModal';
import EditSubjectModal from './EditSubjectModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import UploadFile from '../../UploadFile/UploadFile.jsx'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Table } from 'antd';
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            width: '5%'
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code'
        },
        {
            title: 'Tên học phần',
            dataIndex: 'course_name'
        },
        {
            title: 'Tên ngành',
            dataIndex: 'major_name'
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'course_credits'
        },
        {
            title: 'Hệ số',
            dataIndex: 'credit_coefficient'
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            width: '10%',
            render: (_, record) => (
                <>

                    {isAdmin &&
                        <>
                            <i role="button" className="fa-solid fa-pen-to-square ms-2 me-3" onClick={() => {
                                setUpdateSubject({
                                    id: record.key,
                                    course_code: record.course_code,
                                    course_name: record.course_name,
                                    course_credits: record.course_credits,
                                    credit_coefficient: record.credit_coefficient,
                                    major_id: record.major_id
                                })
                                setOpenEditModal(!openEditModal)
                            }}></i>
                            <i role="button" className="fa-solid fa-trash" onClick={() => ConfirmModal({ id: record.key })}></i>
                        </>
                    }
                </>
            )
        }
    ]
    const dataSource = [];
    subjects.forEach((item, index) => {
        dataSource.push({
            key: item.id,
            no: index + 1,
            course_code: item.course_code,
            course_name: item.course_name,
            course_credits: item.course_credits,
            credit_coefficient: item.credit_coefficient,
            major_code: item.majors.major_code,
            major_name: item.majors.major_name,
            major_id: item.major_id
        })

    })

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
            <Table
                columns={columns}
                dataSource={dataSource}
                bordered
                pagination={false}
                rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}

            />
            <AddSubjectModal isOpen={openAddModal} refetchData={refetchData} />
            <EditSubjectModal isOpen={openEditModal} setUpdateSubject={setUpdateSubject} updateSubject={updateSubject} refetchData={refetchData} />

        </>
    );
};

export default Subject;