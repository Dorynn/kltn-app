import React, { useContext, useState } from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import UploadFile from '../../UploadFile/UploadFile.jsx'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Table } from 'antd';
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
                profiles(name, user_code)
            `)
    })
    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`
                *,
                profiles(name, user_code)
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
        openNotification({ type: 'error', message: 'Import failed' })
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
    const dataSource = [];
    departments.map((item, index) => {
        const chargePerson = teachers?.find(value => value.user_id === item.charge_person_id) || {};
        dataSource.push({
            ...item,
            key: item.id,
            stt: index + 1,
            department_code: `DPM${item.id}` || '-',
            department_name: item.department_name || '-',
            user_code: item.profiles.user_code || '-',
            dean_name: item.profiles.name || '-',
            dean_id: item.dean_id || '-',
            charge_person_code: chargePerson?.profiles?.user_code || '-',
            charge_person_name: chargePerson?.profiles?.name || '-'
        })
    })
    const columns = [
        {
            title: "STT",
            dataIndex: 'stt',
            width: '5%'
        },
        {
            title: 'Mã khoa',
            dataIndex: 'department_code',
            width: '10%'

        },
        {
            title: "Tên khoa",
            dataIndex: 'department_name'
        },
        {
            title: "Mã trưởng khoa",
            dataIndex: 'user_code',
        },
        {
            title: "Tên trưởng khoa",
            dataIndex: "dean_name"
        },
        {
            title: "Mã người phụ trách",
            dataIndex: "charge_person_code"
        },
        {
            title: "Tên người phụ trách",
            dataIndex: "charge_person_name"
        },
    ]

    if (isAdmin) {
        columns.push({
            title: "Thao tác",
            dataIndex: 'action',
            width: '10%',
            render: (_, record) => (
                <>

                    {isAdmin &&
                        <>
                            <i role="button" className="fa-solid fa-pen-to-square ms-2 me-3" onClick={() => {
                                setUpdateDepartment({
                                    id: record.key,
                                    dean_id: record.dean_id,
                                    department_code: record.department_code,
                                    department_name: record.department_name,
                                    charge_person_id: record.charge_person_id
                                })
                                setOpenEditModal(!openEditModal)
                            }}></i>
                            <i role="button" className="fa-solid fa-trash" onClick={() => ConfirmModal({ id: record.key })}></i>
                        </>
                    }
                </>
            )
        })
    }
    return (
        <>
            <h4 className='title'>Quản lý khoa</h4>
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
            <div className='p-5'>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    bordered
                />
            </div>
            {openAddModal && <AddDepartmentModal isOpen={openAddModal} refetchData={refetchData} />}
            {openEditModal && <EditDepartmentModal isOpen={openEditModal} setUpdateDepartment={setUpdateDepartment} updateDepartment={updateDepartment} refetchData={refetchData} />}
        </>
    );
};

export default Department;