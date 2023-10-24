import React, { useCallback, useState } from 'react';
import supabase from '../../../../supabaseClient';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import TableCommon from '../../../common/TableCommon/TableCommon';
import { DEFAULT_CURRENT_PAGE, NUMBER_ITEM_PER_PAGE } from '../../../../const/table';
import flattenObj from '../../../../helpers/flattenObj';
import { FileAddOutlined } from '@ant-design/icons';
import downloadFile from '../../../../helpers/storage/downloadFile';

const AchievedRecord = () => {
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
            title: 'Tài liệu',
            dataIndex: 'report_url',
            key: 'report_url',
            align: 'center',
        },
    ];
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const { data: recordList, requestAction: refetchData, loading: tableLoading, count: totalCountData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async ({ page = 1 }) => await supabase
            .from('student_theses')
            .select(`
                student_id, status, 
                students(profiles(name)), 
                thesis_topics(topic_name), defense_committees(report_url)
            `, { count: 'exact' })
            .eq('status', 'approved')
            .range((page - 1) * NUMBER_ITEM_PER_PAGE, NUMBER_ITEM_PER_PAGE * page - 1)
    })
    const handleDownloadFile = async (urlFile) => {
        const { data, error } = await downloadFile({ pathname: urlFile, folder: 'defense_report' });
        if (!error) {
            window.open(data.signedUrl);
        }
    };
    const parseData = useCallback((item, field, index) => {
        if (field === 'index') {
            return index + 1;
        }
        if (field === 'student_id') {
            return `SV${item[field]}`;
        }
        if (field === 'report_url') {
            const parts = item[field] && item[field].split('/');
            const result = parts?.length === 2 && parts[1];
            return (result ?
                <button className='btn-none' onClick={() => handleDownloadFile(item[field])}>
                    <FileAddOutlined />
                    <span style={{marginLeft: '12px'}}>{result}</span>
                </button> : <></>);
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
            <h4 className='title'>Lưu trữ hồ sơ</h4>
            <div className='p-5'>
                <TableCommon
                    columns={columnConfig}
                    loading={tableLoading}
                    primaryKey='id'
                    data={recordList?.map(item => flattenObj({ obj: item }))}
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
        </div>
    );
};

export default AchievedRecord;