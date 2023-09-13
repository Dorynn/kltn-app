import React, { useContext, useEffect, useState } from 'react';
import AddMajorModal from './AddMajorModal';
import EditMajorModal from './EditMajorModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import UploadFile from '../../UploadFile/UploadFile.jsx';


const { confirm } = Modal;


const Major = () => {
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateMajor, setUpdateMajor] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileList, setFileList] = useState([]);


    const { data: majors, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`
                *,
                profiles(name),
                departments(department_name, department_code)
            `)
    })



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
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=majors', {
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

    const handleDeleteMajor = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('majors')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete major successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete major failed',
            description: error.message
        })

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
                handleDeleteMajor({ id })
            },
            onCancel() { },
        });

    };

    const getData = async () => {
        console.log('calll')
        // try {          
        //         const { dataList, error } = await supabase
        //         .from('majors')
        //         .select("*")
        //         console.log(dataList)
        // }catch(error){
        //     console.log(error)
        // }
        console.log(majors.map(item => ({ department_name: item.departments.department_name })))
    }

    return (
        <>
            <h4 className='title' onClick={getData}>Quản lý ngành</h4>
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
                        <th scrope="col">Mã ngành</th>
                        <th scrope="col">Tên ngành</th>
                        <th scrope="col">Tên khoa</th>
                        <th scrope="col">Mã trưởng ngành</th>
                        <th scrope="col">Tên trưởng ngành</th>
                        <th scrope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody className='position-relative'>
                    {
                        majors.length ?
                            majors?.map(({ major_code, major_name, major_chair_code, profiles, departments, id }, index) => <tr key={major_code}>
                                <th scrope="row">{index + 1}</th>
                                <td>{major_code}</td>
                                <td>{major_name}</td>
                                <td>{departments.department_name}</td>
                                <td>{major_chair_code}</td>
                                <td>{profiles.name}</td>
                                {isAdmin &&
                                    <td>
                                        <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                            setUpdateMajor({
                                                id,
                                                major_code, major_name, major_chair_code
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
            <AddMajorModal
                isOpen={openAddModal}
                refetchData={refetchData}

            />
            <EditMajorModal isOpen={openEditModal} setUpdateMajor={setUpdateMajor} updateMajor={updateMajor} refetchData={refetchData} />
        </>
    );
};

export default Major;