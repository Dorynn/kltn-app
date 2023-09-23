/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import AddLecturerModal from './AddLecturerModal';
import EditLecturerModal from './EditLecturerModal';
import AuthContext from '../../../../context/authContext';
import NotificationContext from '../../../../context/notificationContext';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import UploadFile from '../../../UploadFile/UploadFile';
import { columnConfig, data, expandConfig } from './Lecturerconstants';
import TableCommon from '../../../common/TableCommon/TableCommon';
import flattenObj from '../../../../helpers/flattenObj'
import { NUMBER_ITEM_PER_PAGE, DEFAULT_CURRENT_PAGE } from '../../../../const/table';

const { confirm } = Modal;

const Lecturer = () => {
    const baseRequest = {
        page: 0,
        size: 10
    };

    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const { isAdmin } = useContext(AuthContext);
    const [updateLecturer, setUpdateLecturer] = useState({});
    const { openNotification } = useContext(NotificationContext);
    const [fileList, setFileList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dataRequest, setDataRequest] = useState(baseRequest);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);


    const { data: lecturer, requestAction: refetchData, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async ({ page = 1 }) => supabase
            .from('teachers')
            .select(`
                id,
                user_id,
                major_id,
                profiles(name, user_code, phone, address, email, auth_id),
                majors(major_code, departments(department_name))
            `)
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    });

    const getColumnConfig = () => {
        if (isAdmin) {
            return columnConfig.concat({
                title: 'Thao tác',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
            });
        }
        return columnConfig;
    };

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
                        setUpdateLecturer(item);
                    }}
                ></i>
                <i
                    role="button"
                    className="fa-solid fa-trash mx-2"
                    onClick={() => { ConfirmModal(item.id) }}
                ></i>
            </>);
        }
        return item[field];
    }, []);

    // gọi lại api khi change page
    const onChangePage = useCallback(
        async page => {
            setCurrentPage(page)
            await refetchData({
                params: {
                    page
                }
            })
        },
        [refetchData],
    );

    const handleDeleteLecturer = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('teachers')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete lecturer successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete lecturer failed',
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
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=lecturer', {
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
                handleDeleteLecturer({ id })
            },
            onCancel() { },
        });
    };

    const renderExpandContent = (record) => (
        <div className='row mx-4'>
            {expandConfig.map(item => (
                <div className='d-flex col-6'>
                    <div className='col-4'>
                        <label>{item.label} :</label>
                    </div>
                    <div className='col-8'>
                        <span>{record[item.field]}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const expandCondition = (record) => (data.length > 0);
    

    return (
        <>
            <h4 className='title'>Quản lý giáo viên</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <button
                    type="button"
                    className='btn-none text-btn-top me-3'
                    onClick={() => setOpenAddModal(!openAddModal)}
                >
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </button>
                <UploadFile
                    validTypes={['text/csv']}
                    fileList={fileList}
                    setFileList={setFileList} title="Import from csv"
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
                    columns={getColumnConfig()}
                    data={lecturer?.map(item => flattenObj({ obj: item })) || []}
                    primaryKey='key'
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page - 1)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={lecturer?.map(item => flattenObj({ obj: item })).length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            {openAddModal && <AddLecturerModal
                isOpen={openAddModal}
                setIsOpen={setOpenAddModal}
                refetchData={refetchData}
            />}
            {openEditModal && <EditLecturerModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                updateLecturer={updateLecturer}
                setUpdateLecturer={setUpdateLecturer}
                refetchData={refetchData}
            />}
        </>
    );
};

export default Lecturer;