import React, { useState, useContext } from 'react';
import { Table, Button, Modal } from 'antd';
import { CheckOutlined, PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import ProposeTopic from './ProposeTopic';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../supabaseClient';
import AuthContext from '../../../context/authContext';

const { confirm } = Modal
const StudentRegistration = () => {
    const [isOpenProposedModal, setOpenProposedModal] = useState()
    const { user} = useContext(AuthContext);

    const {data: topics, requestAction: refetchData} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
        .from('topics')
        .select(`*, profiles(*),`)
        .eq('major_code', 'N2')
    })

    const handleRegister = async ({record}) => {
        const {error} = await supabase
        .from ('registrationlist')
        .insert([...record, user.user_code])
    }

    const ConfirmRegisterModal = ({record}) => {
        confirm({
            title: "Bạn có thực sự muốn đăng ký đề tài này?",
            icon: <ExclamationCircleFilled />,
            content: 'Bạn sẽ không thể thay đổi đề tài sau khi đồng ý',
            okText: 'Đồng ý',
            cancleText: 'Hủy',
            centered: true,
            // confirmLoading: confirmLoading,
            onOk() {
                
            },
            onCancel() {

            }
        })
    }
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
            title: 'Giáo viên hướng dẫn',
            dataIndex: 'teacher',
            width: '20%'
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_, record) => <>
                {
                    true ? <Button onClick={()=>ConfirmRegisterModal({record})}>Đăng ký</Button> : <Button icon={<CheckOutlined />}>Duyệt </Button>
                }
            </>,
        },
    ];
    const data = [
        {
            key: 1,
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
        <>
            <h4 className='title'>Đăng ký đề tài</h4>
            <div className='d-flex justify-content-end me-4'>
                <Button className='mb-4' icon={<PlusCircleOutlined />} onClick={() => setOpenProposedModal(!isOpenProposedModal)} >Đề xuất đề tài</Button>
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
            <ProposeTopic isOpen={isOpenProposedModal} />
        </>

    );
};

export default StudentRegistration;