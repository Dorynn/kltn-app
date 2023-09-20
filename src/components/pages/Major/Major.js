import React, { useContext, useState } from 'react';
import AddMajorModal from './AddMajorModal';
import EditMajorModal from './EditMajorModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';
import NotificationContext from '../../../context/notificationContext';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Table } from 'antd';
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
        profiles(name, user_code),
        departments(department_name, department_code)
        `)
    })
    console.log('majors', majors)




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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            width: '5%'
        },
        {
            title: 'Mã ngành',
            dataIndex: 'major_code'
        },
        {
            title: 'Tên ngành',
            dataIndex: 'major_name'
        },
        {
            title: 'Tên khoa',
            dataIndex: 'department_name'
        },
        {
            title: 'Mã trưởng ngành',
            dataIndex: 'major_chair_code'
        },
        {
            title: 'Tên trưởng ngành',
            dataIndex: 'major_chair_name'
        },

    ]

    if (isAdmin) {
        columns.push({
            title: 'Thao tác',
            width: '10%',
            render: (_, record) => (
                <>

                    {isAdmin &&
                        <>
                            <i role="button" className="fa-solid fa-pen-to-square ms-2 me-3" onClick={() => {
                                setUpdateMajor({
                                    id: record.key,
                                    major_code: record.major_code,
                                    major_name: record.major_name,
                                    major_chair_id: record.major_chair_id,
                                    department_id: record.department_id,
                                    ministry_major_code: record.ministry_major_code
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

    const dataSource = [];
    majors.forEach((item, index) => {
        dataSource.push({
            key: item.id,
            no: index + 1,
            major_code: item.major_code,
            major_name: item.major_name,
            major_chair_code: item.profiles.user_code,
            major_chair_name: item.profiles.name,
            department_name: item.departments.department_name,
            department_code: item.departments.department_code,
            ministry_major_code: item.ministry_major_code,
            major_chair_id: item.major_chair_id,
            department_id: item.department_id
        })
    })

    return (
        <>
            <h4 className='title'>Quản lý ngành</h4>
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
                rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                pagination={false}
            />
            <AddMajorModal
                isOpen={openAddModal}
                refetchData={refetchData}
            />
            <EditMajorModal isOpen={openEditModal} setUpdateMajor={setUpdateMajor} updateMajor={updateMajor} refetchData={refetchData} />
        </>
    );
};

export default Major;