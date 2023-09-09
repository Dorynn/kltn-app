import React, { useContext, useState } from 'react';
import AddMajorModal from './AddMajorModal';
import EditMajorModal from './EditMajorModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
const { confirm } = Modal;

const Major = () => {
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateMajor, setUpdateMajor] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { data: majors, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`
                *,
                profiles(name)
            `)
    })

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

    return (
        <>
            <h4 className='title' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="top">Quản lý ngành</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" onClick={() => setOpenAddModal(!openAddModal)}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </div>
                <div role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
                    </svg>
                    <span className='ms-2'>Import file</span>
                </div>
            </div>}
            <table className="table table-bordered table-sm table-responsive table-striped table-hover">
                <thead className='table-head'>
                    <tr>
                        <th scrope="col">STT</th>
                        <th scrope="col">Mã ngành</th>
                        <th scrope="col">Tên ngành</th>
                        <th scrope="col">Mã trưởng ngành</th>
                        <th scrope="col">Tên trưởng ngành</th>
                        <th scrope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody className='position-relative'>
                    {
                        majors.length ?
                            Majors?.map(({ major_code, major_name, leader_code, profiles, id }, index) => <tr key={major_code}>
                                <th scrope="row">{index + 1}</th>
                                <td>{major_code}</td>
                                <td>{major_name}</td>
                                <td>{leader_code}</td>
                                <td>{profiles?.name}</td>
                                {isAdmin &&
                                    <td>
                                        <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                            setUpdateMajor({
                                                id,
                                                major_code, major_name, leader_code
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
            <AddMajorModal isOpen={openAddModal} refetchData={refetchData} />
            <EditMajorModal isOpen={openEditModal} setUpdateMajor={setUpdateMajor} updateMajor={updateMajor} refetchData={refetchData} />
        </>
    );
};

export default Major;