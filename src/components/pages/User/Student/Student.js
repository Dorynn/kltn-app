import React, { useCallback, useContext, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import AuthContext from '../../../../context/authContext';
import NotificationContext from '../../../../context/notificationContext';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import { columnConfig, data, expandConfig } from './Studentconstants';
import TableCommon from '../../../common/TableCommon/TableCommon';
const { confirm } = Modal;

const Student = () => {

    const baseRequest = {
        page: 0,
        size: 10
    };

    const { isAdmin } = useContext(AuthContext);
    const { openNotification } = useContext(NotificationContext);
    const [openEditModal, setOpenEditModal] = useState();
    const [openAddModal, setOpenAddModal] = useState();
    const [updateStudent, setUpdateStudent] = useState({});
    const [fileList, setFileList] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dataRequest, setDataRequest] = useState(baseRequest);


    const { data: student, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('student')
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
                        setUpdateStudent(item);
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

    const handleDeleteStudent = async (id) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('student')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete student failed',
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
        const { error } = await supabase.functions.invoke('import-data-from-csv?table=student', {
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
                handleDeleteStudent({ id })
            },
            onCancel() { },
        });
    };

    const renderExpandContent = (record) => (
        <div className='row mx-5'>
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
            <h4 className='title'>Quản lý sinh viên</h4>
            {isAdmin && <div className='d-flex justify-content-end me-4'>
                <button
                    type="button"
                    className='border border-secondary rounded me-3 p-2'
                    onClick={() => setOpenAddModal(!openAddModal)}
                >
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </button>
                <uploadFile
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
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={data.length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            {openAddModal && <AddStudentModal
                isOpen={openAddModal}
                setIsOpen={setOpenAddModal}
                refetchData={refetchData}
            />}
            {openEditModal && <EditStudentModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                updateStudent={updateStudent}
                setUpdateStudent={setUpdateStudent}
                refetchData={refetchData}
            />}
        </>
    );
};

export default Student;