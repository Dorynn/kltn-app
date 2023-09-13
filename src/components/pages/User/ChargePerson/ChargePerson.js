import React, { useContext, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import AddChargePersonModal from './AddChargePersonModal';
import EditChargePersonModal from './EditChargePersonModal';
import AuthContext from '../../../../context/authContext';
import NotificationContext from '../../../../context/notificationContext';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import { tableTitle } from './ChargePersonconstants';
const { confirm } = Modal;

const ChargePerson = () => {
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateChargePerson, setUpdateChargePerson] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [fileList, setFileList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);


    const { data: chargePerson, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('chargePerson')
            .select(`
                *,
                profiles(name)
            `)
    });

    const handleDeleteChargePerson = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('chargePerson')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete chargePerson successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete chargePerson failed',
            description: error.message
        })
    };

    const getDataFromFile = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", err => reject(err));

            reader.readAsText(file);
        });
    };

    const uploadFile = async file => {
        const data = await getDataFromFile(file);
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=chargePerson', {
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
    };

    const handleOnChangeImportFile = async (info) => {
        setFileList([...info.fileList]);
    };

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
                handleDeleteChargePerson({ id })
            },
            onCancel() { },
        });
    };

    return (
        <>
            <h4 className='title'>Quản lý người phụ trách khóa luận tốt nghiệp</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" onClick={() => setOpenAddModal(!openAddModal)}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </div>
                <uploadFile
                    validTypes={['text/csv']}
                    fileList={fileList}
                    setFileList={setFileList}
                    title="Import from csv"
                    onChange={handleOnChangeImportFile}
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
                        {tableTitle.map(title => (<th scrope="col">{title}</th>))}
                    </tr>
                </thead>
                <tbody className='position-relative'>
                    {chargePerson.length ?
                        chargePerson?.map(
                            ({ chargePerson_code, chargePerson_name, department_code, phoneNumber, email, address, id }, index) =>
                                <tr key={chargePerson_code}>
                                    <th scrope="row">{index + 1}</th>
                                    <td>{chargePerson_code}</td>
                                    <td>{chargePerson_name}</td>
                                    <td>{department_code}</td>
                                    <td>{phoneNumber}</td>
                                    <td>{email}</td>
                                    <td>{address}</td>
                                    {isAdmin &&
                                        <td>
                                            <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                                                setUpdateChargePerson({
                                                    id,
                                                    chargePerson_code,
                                                    chargePerson_name,
                                                    department_code,
                                                    phoneNumber,
                                                    email,
                                                    address,
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
            <AddChargePersonModal
                isOpen={openAddModal}
                refetchData={refetchData}
            />
            <EditChargePersonModal
                isOpen={openEditModal}
                setUpdateChargePerson={setUpdateChargePerson}
                updateChargePerson={updateChargePerson}
                refetchData={refetchData}
            />
        </>
    );
};

export default ChargePerson;