import React, { useCallback, useContext, useState } from 'react';
import { Modal } from 'antd';
import supabase from '../../../../../supabaseClient';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../../const/table';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import flattenObj from '../../../../../helpers/flattenObj';
import TableCommon from '../../../../common/TableCommon/TableCommon';
import Loading from '../../../../common/Loading/Loading';
import AuthContext from '../../../../../context/authContext';
import { columnConfig, expandConfig } from './ReviewReportGraduationconstant';
import ModalViewDetail from './ModalViewDetail';

function ReviewReportGraduation() {
    const { isAdmin, isTeacher } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [openModal, setOpenModal] = useState(false);
    const [phasesId, setPhasesId] = useState('');

    const { data: reportList, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => supabase
            .from('thesis_phases')
            .select(`
                *,
                student_theses(
                    topic_id, status, student_id, reviewer_teacher_id, thesis_grade_id,
                    thesis_topics(topic_name, topic_description),
                    students(user_id, profiles(name))
                )
            `, { count: 'exact' })
            .eq('status', 'pending')
            .eq('reviewer_id', user.user_id)
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    });

    // tùy chọn hiển thị data
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'student_id') {
            return `SV${item[field]} - ${item.name}`
        }
        if (field === 'action') {
            return (
                <button
                    type='button'
                    className='btn btn-outline-secondary'
                    onClick={() => {setOpenModal(true); setPhasesId(item.id)}}
                >Xem</button>
            );
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

    const expandCondition = (record) => (reportList.length > 0);

    return (
        <>
            <h4 className='title'>Danh sách sinh viên nộp báo cáo khóa luận tốt nghiệp</h4>
            <div className='p-5'>
                <TableCommon
                    loading={tableLoading}
                    columns={columnConfig}
                    primaryKey='id'
                    data={reportList?.map(item => flattenObj({ obj: item }))}
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    expandCondition={(record) => expandCondition(record)}
                    renderExpandContent={reportList?.map(item => flattenObj({ obj: item })).length > 0 ?
                        (record) => renderExpandContent(record) : null}
                    bordered
                />
            </div>
            <Loading isLoading={tableLoading} />
            {openModal &&
                <ModalViewDetail
                    isOpen={openModal}
                    setIsOpen={setOpenModal}
                    phasesId={phasesId}
                    refetchData={refetchData}
                />}
        </>
    );
}

export default ReviewReportGraduation;