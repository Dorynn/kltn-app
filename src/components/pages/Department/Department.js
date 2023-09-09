import React, { useContext, useState } from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import UploadFile from '../../UploadFile/UploadFile.jsx'

const Department = () => {
    const { isAdmin, user } = useContext(AuthContext);
    const [updateDepartment, setUpdateDepartment] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [fileList, setFileList] = useState([])
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
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     console.log(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //     console.error(`${info.file.name} file upload failed.`);
        // }
    }
    return (
        <>
            <h4 className='title' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="top">Quản lý khoa</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" data-bs-toggle="modal" data-bs-target="#addDepartment">
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