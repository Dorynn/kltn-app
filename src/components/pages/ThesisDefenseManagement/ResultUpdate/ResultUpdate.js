import React, { useCallback, useState } from 'react';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../const/table';
import TableCommon from '../../../common/TableCommon/TableCommon';
import flattenObj from '../../../../helpers/flattenObj';
import { Button } from 'antd';
import DocumentUpdateModal from './DocumentUpdateModal';


const ResultUpdate = () => {
    const columnConfig = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_id',
            key: 'student_id',
            align: 'center',
            expand: true,
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Tên đề tài',
            dataIndex: 'topic_name',
            key: 'topic_name',
            align: 'center',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
        },
    ];
    const baseData = {
        id: null,
        title: "",
        description: "",
        student_thesis_id: null,
        comment: "",
        phase_order: null,
        status: "",
        reviewer_id: null,
        student_id: null,
        name: "",
        topic_name: "",
        key: null
    }
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [openModal, setOpenModal] = useState(false);
    const [resultUpdate, setResultUpdate] = useState(baseData);
    const { data: reviewList, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async ({ page = 1 }) => await supabase
            .from('thesis_phases')
            .select(`
                *, 
                student_theses(
                    student_id, 
                    students(profiles(name)), 
                    thesis_topics(topic_name),
                    defense_committees(*)
                )
            `, { count: 'exact' })
            .eq('phase_order', 5)
            // .eq('status', 'pending')
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    })
    console.log(reviewList)
    const handleUpdateResult = (item) => {
        console.log(item);
        setOpenModal(true)
        setResultUpdate({
            ...item
        })
    };
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'student_id') {
            return `SV${item[field]}`;
        }
        if (field === 'action') {
            return (item?.status === 'normal' ?
                <Button onClick={() => handleUpdateResult(item)}>
                    Cập nhật
                </Button>
                : <Button>Hoàn Thành</Button>);
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

    return (
        <div>
            <h4 className='title'>Danh sách sinh viên hoàn thành bảo vệ khóa luận tốt nghiệp</h4>
            <div className='p-5'>
                <TableCommon
                    columns={columnConfig}
                    loading={tableLoading}
                    primaryKey='id'
                    data={reviewList?.map(item => flattenObj({ obj: item }))}
                    parseFunction={parseData}
                    isShowPaging
                    onChangePage={page => onChangePage(page)}
                    totalCountData={totalCountData}
                    defaultPage={DEFAULT_CURRENT_PAGE}
                    currentPage={currentPage}
                    totalDisplay={NUMBER_ITEM_PER_PAGE}
                    bordered
                />
            </div>
            {openModal &&
                <DocumentUpdateModal
                    isOpen={openModal}
                    setIsOpen={setOpenModal}
                    refetchData={refetchData}
                    resultUpdate={resultUpdate}
                />}
        </div>
    );
};

export default ResultUpdate;