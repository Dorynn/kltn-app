import React, { useCallback, useEffect, useState } from 'react';
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
            dataIndex: 'student_name',
            key: 'student_name',
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
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => await supabase
            .from('thesis_phases')
            .select(`
                id, phase_order, reviewer_id, status, student_thesis_id,
                student_theses(
                    student_id, 
                    students(profiles(name)), 
                    thesis_topics(topic_name),
                    defense_committees(
                        id,
                        student_thesis_id,
                        defense_day,
                        defense_location,
                        defense_shift,
                        report_url
                    )
                )
            `, { count: 'exact' })
            .in('phase_order', [3, 4])
            .eq('status', 'approved')
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    })
    const data = [];
    const result = [];
    reviewList.forEach(item => {
        const existing = result.find(i => i.id === item.id);
        if (!existing) {
            result.push(item);
        } else {
            if (existing.id < item.id) {
                result[result.indexOf(existing)] = item;
            }
        }
    });
    result && result.map((item, index) => {
            const defenseCommittees = item && item.student_theses && item.student_theses.defense_committees &&
                item.student_theses.defense_committees.length > 0 && item.student_theses.defense_committees[0]
            data.push({
                no: index + 1,
                key: item.id,
                id: item.id,
                student_thesis_id: item.student_thesis_id,
                phase_order: item.phase_order,
                status: item.status,
                reviewer_id: item.reviewer_id,
                student_id: item?.student_theses?.student_id,
                student_name: item?.student_theses?.students?.profiles?.name,
                topic_name: item?.student_theses?.thesis_topics?.topic_name,
                defense_committees_id: defenseCommittees?.id,
                defense_day: defenseCommittees?.defense_day,
                defense_location: defenseCommittees?.defense_location,
                defense_shift: defenseCommittees?.defense_shift,
                report_url: defenseCommittees?.report_url,
            })
        })

    const handleUpdateResult = (item) => {
        setOpenModal(true)
        setResultUpdate({
            ...item
        });
    };
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'student_id') {
            return `SV${item[field]}`;
        }
        if (field === 'action') {
            if (item?.report_url === null) {
                return (<Button onClick={() => handleUpdateResult(item)}>
                    Cập nhật
                </Button>);
            }
            if (item?.report_url && item?.phase_order === 4) {
                return (<Button onClick={() => handleUpdateResult(item)}>
                    Sửa
                </Button>);
            }
            return (<Button>Hoàn Thành</Button>);
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
                    data={data || []}
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