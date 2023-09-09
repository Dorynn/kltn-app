import React, { useContext, useState } from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import UploadFile from '../../UploadFile/UploadFile.jsx'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

const Department = () => {
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateDepartment, setUpdateDepartment] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [fileList, setFileList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { data: departments, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`
                *,
                profiles(name)
            `)
    })

    const handleDeleteDepartment = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('departments')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete department successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete department failed',
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
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=departments', {
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
                handleDeleteDepartment({ id })
            },
            onCancel() { },
        });

    };

    return (
        <>
            <h4 className='title' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="top">Quản lý khoa</h4>
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
                        <th scrope="col">Mã khoa</th>
                        <th scrope="col">Tên khoa</th>
                        <th scrope="col">Mã trưởng khoa</th>
                        <th scrope="col">Tên trưởng khoa</th>
                        <th scrope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody className='position-relative'>
                    {
                        departments.length ?
                            departments?.map(({ department_code, department_name, dean_code, profiles, id }, index) => <tr key={department_code}>
                                <th scrope="row">{index + 1}</th>
                                <td>{department_code}</td>
                                <td>{department_name}</td>
                                <td>{dean_code}</td>
                                <td>{profiles?.name}</td>
                                {isAdmin &&
                                    <td>
                                        <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                            setUpdateDepartment({
                                                id,
                                                department_code, department_name, dean_code
                                            })
                                            setOpenEditModal(!openEditModal)
                                        }}></i>
                                        <i role="button" className="fa-solid fa-trash mx-2" onClick={() => ConfirmModal({ id })}></i>
                                    </td>
                                }
                            </tr>)
                            :
                            <tr>
                                <td colSpan={6} className="py-3"><i className="fa-solid fa-box-archive me-4 fa-xl"></i>No data</td>
                            </tr>


                    }

                </tbody>
            </table>
            <AddDepartmentModal isOpen={openAddModal} refetchData={refetchData} />
            <EditDepartmentModal isOpen={openEditModal} setUpdateDepartment={setUpdateDepartment} updateDepartment={updateDepartment} refetchData={refetchData} />
        </>
    );
};

export default Department;