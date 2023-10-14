import React, { useCallback, useContext, useState } from 'react';
import { Modal } from 'antd';
import supabase from '../../../../../supabaseClient';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../../const/table';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import flattenObj from '../../../../../helpers/flattenObj';
import TableCommon from '../../../../common/TableCommon/TableCommon';
import Loading from '../../../../common/Loading/Loading';
import { columnConfigAdmin, columnConfigTeacher, expandConfig } from './TopicListconstants';
import AuthContext from '../../../../../context/authContext';

const TopicList = () => {
    const { isAdmin, isTeacher } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);

    const { data: topicList, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => supabase
            .from('thesis_topics')
            .select(`
                *
            `, { count: 'exact' })
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
        if (field === 'topic_code') {
            return `DT${item.id}`;
        }
        if (field === 'register_number') {
            return `${item[field] || 0} / ${item.limit_register_number || 0}`;
        }
        if (field === 'teacher_id') {
            const teacher = teachers && teachers.find(value => value.id === item[field]) || {};
            return teacher.name || '-';
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

    const getColumnConfig = () => {
        if (isAdmin) {
            return columnConfigAdmin;
        }
        if (isTeacher) {
            return columnConfigTeacher;
        }
        return [];
    }

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

    const expandCondition = (record) => (topicList.length > 0);

    return (
        <>
            <h4 className='title'>Danh sách đề tài</h4>
            <div className='p-5'>
                <TableCommon
                    loading={tableLoading}
                    columns={getColumnConfig()}
                    primaryKey='id'
                    data={topicList?.map(item => flattenObj({ obj: item }))}
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={topicList?.map(item => flattenObj({ obj: item })).length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            <Loading isLoading={tableLoading} />
        </>
    );
};

export default TopicList;