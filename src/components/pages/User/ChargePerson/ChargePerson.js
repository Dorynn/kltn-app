import React, { useCallback, useContext, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import AddChargePersonModal from './AddChargePersonModal';
import EditChargePersonModal from './EditChargePersonModal';
import AuthContext from '../../../../context/authContext';
import NotificationContext from '../../../../context/notificationContext';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import { columnConfig, data } from './ChargePersonconstants';
import TableCommon from '../../../common/TableCommon/TableCommon';
import Loading from '../../../common/Loading/Loading';
import UploadFile from '../../../UploadFile/UploadFile';
const { confirm } = Modal;

const ChargePerson = () => {

    const baseRequest = {
        name: '',
        age: 0,
        address: '',
        description: '',
        page: 0,
        size: 10
    };

    const { isAdmin } = useContext(AuthContext);
    const { openNotification } = useContext(NotificationContext);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [updateChargePerson, setUpdateChargePerson] = useState({});
    const [fileList, setFileList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataRequest, setDataRequest] = useState(baseRequest);


    const { data: chargePerson, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, 
        defaultAction: async () => supabase
            .from('chargePerson')
            .select(`
                *,
                profiles(name)
            `)
    });

    // tùy chọn hiển thị data
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'action') {
            return (<>
                    <i
                        role="button"
                        className="fa-solid fa-pen-to-square mx-2"
                        onClick={() => {
                            setOpenEditModal(true);
                            setUpdateChargePerson(item);
                        }}
                    ></i>
                    <i
                        role="button"
                        className="fa-solid fa-trash mx-2"
                        onClick={() => ConfirmModal(item.id)}
                    ></i>
                </>);
        }
        return item[field];
    }, []);

    // gọi lại api khi change page
    const onChangePage = useCallback(
        page => {
            const newDataRequest = {
                ...dataRequest,
                page,
            };
            setDataRequest(newDataRequest);
        },
        [dataRequest, setDataRequest],
    );

    const handleDeleteChargePerson = async (id) => {
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

    const ConfirmModal = (id) => {
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
                <button
                    type="button"
                    className='btn-none text-btn-top me-3'
                    onClick={() => setOpenAddModal(true)}
                >
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </button>
                <UploadFile
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
            <div className='p-5'>
                <TableCommon
                    columns={columnConfig}
                    data={data || []}
                    primaryKey='key'
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page - 1)}
                    totalCountData={data.length || 0}
                    defaultPage={(dataRequest.page + 1) || 1}
                    currentPage={dataRequest.page + 1}
                    totalDisplay={dataRequest.size || 10}
                    bordered
                />
            </div>
            <Loading isLoading={isLoading} />
            {openAddModal && <AddChargePersonModal
                isOpen={openAddModal}
                setIsOpen={setOpenAddModal}
                refetchData={refetchData}
            />}
            {openEditModal && <EditChargePersonModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                updateChargePerson={updateChargePerson}
                setUpdateChargePerson={setUpdateChargePerson}
                refetchData={refetchData}
            />}
        </>
    );
};

export default ChargePerson;