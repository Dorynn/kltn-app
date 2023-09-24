import React, { useCallback, useContext, useState } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../../const/table';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import flattenObj from '../../../../../helpers/flattenObj';
import TableCommon from '../../../../common/TableCommon/TableCommon';
import { getStatus } from '../../../../common/common';
import Loading from '../../../../common/Loading/Loading';
import { columnConfig, expandConfig } from './Approvedtopicconstants';

const { confirm } = Modal;

const ApprovedTopicList = () => {
    const { openNotification } = useContext(NotificationContext);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);


    const { data: registeredTopic, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => supabase
            .from('student_theses')
            .select(`
                *
            `, { count: 'exact' })
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    });
    const { data: thesisTopics } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('thesis_topics')
            .select(`*`)
    });
    const { data: students } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
            .eq('university_role', 'student')
    });

    // tùy chọn hiển thị data
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'register_number') {
            return `${item[field] || 0} / ${item.limit_register_number || 0}`;
        }
        if (field === 'student_id') {
            const student = students && students.find(value => value.id === item[field]) || {};
            return `${student?.user_code} - ${student?.name}` || '-';
        }
        if (field === 'topic_id') {
            const thesisTopic = thesisTopics && thesisTopics.find(topic => topic.id === item[field]) || {};
            return thesisTopic.topic_name || '-';
        }
        if (field === 'action') {
            return (<>
                {item.status === 'pending' ? <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => { ConfirmModal(item) }}
                >Duyệt</button> : <></>}
            </>);
        }
        if (field === 'status') {
            return getStatus(item[field]);
        }
        return item[field];
    }, [thesisTopics, students]);

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

    const handleApproveTopic = async (item) => {
        setConfirmLoading(true);
        delete item.key;
        const { error } = await supabase
            .from('student_theses')
            .update({ ...item, status: 'approved' })
            .eq('id', item.id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Approve registeredTopic successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Approve suggestedTopic failed',
        })
    };

    const ConfirmModal = (item) => {
        confirm({
            title: 'Bạn có thực sự muốn duyệt đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ được công khai sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            confirmLoading: confirmLoading,
            onOk() {
                handleApproveTopic(item)
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

    const expandCondition = (record) => (registeredTopic.length > 0);

    return (
        <>
            <h4 className='title'>Duyệt danh sách đăng ký đề tài của sinh viên</h4>
            <div className='p-5'>
                <TableCommon
                    loading={tableLoading}
                    columns={columnConfig}
                    primaryKey='id'
                    data={registeredTopic?.map(item => flattenObj({ obj: item }))}
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page - 1)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={registeredTopic?.map(item => flattenObj({ obj: item })).length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            <Loading isLoading={tableLoading} />
        </>
    );
};

export default ApprovedTopicList;