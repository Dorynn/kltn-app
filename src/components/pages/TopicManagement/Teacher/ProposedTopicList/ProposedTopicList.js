import React, { useState } from 'react';
import ReviewTopicModal from './ReviewTopicModal';
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import { Table, Button } from 'antd';

const ProposedTopicList = () => {
    const [isOpenReviewModal, setOpenReviewModal] = useState();
    const [isReviewed, setReviewed] = useState(true);
    const [reviewedTopic, setReviewedTopic] = useState({});
    const { data: suggestedList, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('suggested_topics')
            .select(`*, students(*, profiles(user_code, name))`)
    })

    const { data: topics, requestAction: refetchData2 } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('thesis_topics')
            .select(`*, teachers(*, profiles(name), majors(*)))`)
    })

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            width: '5%'
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            width: '25%'
        },
        {
            title: 'Tên đề tài',
            dataIndex: 'topic_name',
            key: 'topic_name',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_, record) => <>
                {
                    record.isReviewed ? <Button disabled>Đã duyệt </Button> : <Button onClick={() => {
                        setOpenReviewModal(!isOpenReviewModal)
                        setReviewedTopic(record)
                    }}>Duyệt</Button>
                }
            </>,
        },
    ];
    const data = [];

    suggestedList.map((item, index) => {
        data.push({
            key: item.id,
            id: item.id,
            no: index + 1,
            topic_name: item.topic_name,
            topic_description: item.topic_description,
            suggested_student_id: item.suggested_student_id,
            student_code: `${item.students.profiles.user_code} - ${item.students.profiles.name}`
        })
    })


    return (
        <>
            <h4 className='title'>Danh sách đề tài đề xuất của sinh viên</h4>
            <div className='p-5'>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p
                                style={{
                                    margin: 0,
                                }}
                            >
                                {record.topic_description}

                            </p>
                        ),
                    }}
                    dataSource={data}
                    bordered
                />
            </div>
            <ReviewTopicModal isOpen={isOpenReviewModal} setReviewedTopic={setReviewedTopic} reviewedTopic={reviewedTopic} setReviewed={setReviewed} />
        </>
    );
};

export default ProposedTopicList;