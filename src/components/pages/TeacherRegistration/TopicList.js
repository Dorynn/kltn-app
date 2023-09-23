import React from 'react';
import { Table } from 'antd'

const TopicList = () => {
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
            key: 'topic_name',
            width: '10%'
        },
        {
            title: 'Tên đề tài',
            dataIndex: 'topic_name',
            key: 'topic_name',
        },
        {
            title: 'Số lượng đăng ký',
            dataIndex: 'registration_num',
            key: 'registration_num',
            width: '15%'
        },
        {
            title: 'Giáo viên hướng dẫn',
            dataIndex: 'teacher',
            key: 'teacher',
            width: '20%'
        },
    ];
    const data = [
        {
            id: 1,
            no: 1,
            topic_code: 'DT01',
            topic_name: 'De tai 1',
            registration_num: `${1}/${4}`,
            topic_description: 'Mô tả đề tài 1',
            teacher: 'Nguyễn Thị Tuyết (PI01)'
        },
        {
            key: 2,
            no: 2,
            topic_code: 'DT02',
            topic_name: 'De tai 2',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 2',
            teacher: 'Nguyễn Thị Tuyết (PI01)'

        },
        {
            key: 3,
            no: 3,
            topic_code: 'DT03',
            topic_name: 'De tai 3',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 3',
            teacher: 'Bùi Minh Đức (PI02)'

        }
    ];
    return (
        <div>
            <h4 className='title'>Danh sách đề tài</h4>
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
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
                dataSource={data}
                bordered
            />
        </div>
    );
};

export default TopicList;