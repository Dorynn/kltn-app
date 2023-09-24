import React from 'react';
import { Table } from 'antd';

const TeacherRegistration = () => {
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
            title: 'Số lượng đăng ký',
            dataIndex: 'registration_num',
            key: 'registration_num',
            width: '15%'
        },
        {
            title: 'Thao tác',
            dataIndex: '',
            key: 'x',
            width: '10%',
            render: () => <>

                <>
                    <i role="button" className="fa-solid fa-pen-to-square ms-2 me-3"></i>
                    <i role="button" className="fa-solid fa-trash" ></i>
                </>
            </>,
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
        },
        {
            key: 2,
            no: 2,
            topic_code: 'DT02',
            topic_name: 'De tai 2',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 2',
        },
        {
            key: 3,
            no: 3,
            topic_code: 'DT03',
            topic_name: 'De tai 3',
            registration_num: `1/3`,
            topic_description: 'Mô tả đề tài 3',
        }
    ];
    console.log('')
    return (
        <div>
            <h4 className='title'>Đăng ký đề tài</h4>
            <div className='d-flex justify-content-end me-4 mb-4'>
                <div className='me-3' role="button">
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </div>
            </div>
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
    );
};

export default TeacherRegistration;