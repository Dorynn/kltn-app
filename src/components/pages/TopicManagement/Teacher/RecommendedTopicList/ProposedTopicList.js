import React, { useState } from 'react';
import ReviewTopicModal from './ReviewTopicModal';
import { Table, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const ProposedTopicList = () => {
    const [isOpenReviewModal, setOpenReviewModal] = useState();
    const [isReviewed, setReviewed] = useState(true);
    const [reviewedTopic, setReviewedTopic] = useState({});
    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            width: '5%'
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Mã đề tài',
            dataIndex: 'topic_code',
            key: 'topic_code',
            width: '10%'
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
                        console.log(record)
                    }}>Duyệt</Button>
                }
            </>,
        },
    ];
    const data = [
        {
            id: 1,
            no: 1,
            topic_code: '',
            topic_name: 'De tai 1',
            registration_num: `${1}/${4}`,
            topic_description: '',
            teacher: 'Nguyễn Thị Tuyết (PI01)',
            user_code: 'A3',
            teacher_id: null,
            isReviewed: true,
        },
        {
            key: 2,
            no: 2,
            topic_code: '',
            topic_name: 'De tai 2',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 2',
            teacher: 'Nguyễn Thị Tuyết (PI01)',
            user_code: 'A2',
            teacher_id: null,
            isReviewed: false,
        },
        {
            key: 3,
            no: 3,
            topic_code: '',
            topic_name: 'De tai 3',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 3',
            teacher: 'Bùi Minh Đức (PI02)',
            user_code: 'A1',
            teacher_id: null,
            isReviewed: true
        }
    ];
    return (
        <>
            <h4 className='title'>Danh sách đề tài đề xuất của sinh viên</h4>

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
            <ReviewTopicModal isOpen={isOpenReviewModal} setReviewedTopic={setReviewedTopic} reviewedTopic={reviewedTopic} setReviewed={setReviewed} />
        </>
    );
};

export default ProposedTopicList;