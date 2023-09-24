import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import AddTopic from './AddTopic';
import AuthContext from '../../../../../context/authContext';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../../const/table';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import flattenObj from '../../../../../helpers/flattenObj';
import TableCommon from '../../../../common/TableCommon/TableCommon';
import Loading from '../../../../common/Loading/Loading';
import { columnConfig, expandConfig } from './TopicRegistrationconstant';
import EditTopicModal from './EditTopicModal';

const { confirm } = Modal;

const TopicRegistration = () => {
    const { isAdmin, isTeacher } = useContext(AuthContext);
    const { openNotification } = useContext(NotificationContext);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [updateTopic, setUpdateTopic] = useState({});
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);


    const { data: topicRegistration, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => supabase
            .from('thesis_topics')
            .select(`
                *
            `, { count: 'exact' })
            // .join('teachers', { 'thesis_topics.teacher_id': 'teachers.id' })
            // .join('profiles', { 'teachers.user_id': 'profiles.id' })
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    });

    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('profiles')
            .select(`
                *
            `)
            .eq('university_role', 'teacher')
    });

    // tùy chọn hiển thị data
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'register_number') {
            return `${item[field] || 0} / ${item.limit_register_number || 0}`;
        }
        if (field === 'teacher_id') {
            const teacher = teachers.find(value => value.id === item[field]) || {};
            return teacher.name || '-';
        }
        if (field === 'action') {
            return (<>
                <i
                    role="button"
                    className="fa-solid fa-pen-to-square mx-2"
                    onClick={() => {
                        setOpenEditModal(true);
                        setUpdateTopic(item);
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
    }, [teachers]);

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

    const handleDeleteTopic = async ({ id }) => {
        setConfirmLoading(true);
        const { error } = await supabase
            .from('thesis_topics')
            .delete()
            .eq('id', id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Delete topicRegistration successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Delete topicRegistration failed',
            description: error.message
        })
    };

    const ConfirmModal = (id) => {
        confirm({
            title: 'Bạn có thực sự muốn xóa đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            confirmLoading: confirmLoading,
            onOk() {
                handleDeleteTopic({ id })
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

    const expandCondition = (record) => (topicRegistration.length > 0);

    return (
        <>
            <h4 className='title'>Đăng ký đề tài</h4>
            {(isAdmin || isTeacher) && <div className='d-flex justify-content-end mx-5'>
                <button
                    type="button"
                    className='btn-none text-btn-top me-3'
                    onClick={() => setOpenAddModal(true)}
                >
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </button>
            </div>}
            <div className='p-5'>
                <TableCommon
                    columns={columnConfig}
                    loading={tableLoading}
                    primaryKey='id'
                    data={topicRegistration?.map(item => flattenObj({ obj: item }))}
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page - 1)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={topicRegistration?.map(item => flattenObj({ obj: item })).length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            <Loading isLoading={tableLoading} />
            {openAddModal && <AddTopic
                isOpen={openAddModal}
                setIsOpen={setOpenAddModal}
                refetchData={refetchData}
            />}
            {openEditModal && <EditTopicModal
                isOpen={openEditModal}
                setIsOpen={setOpenEditModal}
                updateTopic={updateTopic}
                setUpdateTopic={setUpdateTopic}
                refetchData={refetchData}
            />}
        </>
    );
};

export default TopicRegistration;