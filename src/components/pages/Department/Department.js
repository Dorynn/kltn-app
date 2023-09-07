import React, { useContext, useEffect, useState } from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';

const Department = () => {
    const { isAdmin } = useContext(AuthContext);
    const [updateDepartment, setUpdateDepartment] = useState({});
    const { openNotification } = useContext(NotificationContext);
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
        const { error } = await supabase
            .from('departments')
            .delete()
            .eq('id', id)
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
    return (
        <>
            <h4 className='title'>Quản lý khoa</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" data-bs-toggle="modal" data-bs-target="#addDepartment">
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
                        <th scrope="col">Mã khoa</th>
                        <th scrope="col">Tên khoa</th>
                        <th scrope="col">Mã trưởng khoa</th>
                        <th scrope="col">Tên trưởng khoa</th>
                        <th scrope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        departments?.map(({ department_code, department_name, dean_code, profiles, id }, index) => <tr key={department_code}>
                            <th scrope="row">{index}</th>
                            <td>{department_code}</td>
                            <td>{department_name}</td>
                            <td>{dean_code}</td>
                            <td>{profiles?.name}</td>
                            {isAdmin &&
                                <td>
                                    <i role="button" data-bs-toggle="modal" data-bs-target="#editDepartment" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                        setUpdateDepartment({
                                            id,
                                            department_code, department_name, dean_code
                                        })
                                    }}></i>
                                    <i role="button" className="fa-solid fa-trash mx-2" onClick={() => handleDeleteDepartment({ id })}></i>
                                </td>
                            }
                        </tr>)
                    }
                </tbody>
            </table>
            <AddDepartmentModal refetchData={refetchData} />
            <EditDepartmentModal updateDepartment={updateDepartment} setUpdateDepartment={setUpdateDepartment} refetchData={refetchData} />
        </>
    );
};

export default Department;