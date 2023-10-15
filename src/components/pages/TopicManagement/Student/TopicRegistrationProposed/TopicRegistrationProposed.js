import React, { useState, useContext, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import { CheckOutlined, PlusCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import ProposeTopicModal from './ProposedTopicModal';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../../supabaseClient';
import AuthContext from '../../../../../context/authContext';
import NotificationContext from '../../../../../context/notificationContext';

const { confirm } = Modal

const TopicRegistrationProposed = () => {
    const [isOpenProposedModal, setOpenProposedModal] = useState();
    const { openNotification } = useContext(NotificationContext);
    const [registeredTopic, setRegisteredTopic] = useState([])
    const { user } = useContext(AuthContext)

    const getRegisteredTopic = async () => {
        const { data } = await supabase
            .from('student_theses')
            .select(`topic_id`)
        setRegisteredTopic(data)
    }
    useEffect(() => {
        getRegisteredTopic()
    }, [])

    const { data: topics, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
            .from('thesis_topics')
            .select(`*, teachers(*, profiles(name, user_code)))`)
    })

    const handleRegister = async ({ topic_id }) => {
        const { error } = await supabase
            .from('student_theses')
            .insert([{ topic_id: topic_id, student_id: user.user_id, status: 'pending' }])
            
            if (!error) {
            getRegisteredTopic()
            return openNotification({
                message: 'Register the topic successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Register the topic failed',
        })
    }

    const ConfirmRegisterModal = ({ topic_id }) => {
        confirm({
            title: "Bạn có thực sự muốn đăng ký đề tài này?",
            icon: <ExclamationCircleFilled />,
            content: 'Bạn sẽ không thể thay đổi đề tài sau khi đồng ý',
            okText: 'Đồng ý',
            cancleText: 'Hủy',
            centered: true,
            // confirmLoading: confirmLoading,
            onOk() {
                handleRegister({ topic_id })
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

                    registeredTopic.length > 0 ? ((record.id === registeredTopic[0].topic_id) ? <Button>Đã đăng ký</Button> :
                        <Button onClick={() => {
                            ConfirmRegisterModal({ topic_id: record.id });

                        }
                        }> Đăng ký</Button>) : <Button onClick={() => {
                            ConfirmRegisterModal({ topic_id: record.id });

                        }
                        }> Đăng ký</Button>
                }
            </>,
        },
    ];
    const data = [];

    topics.map((item, index) => {
        data.push({
            no: index + 1,
            key: item.id,
            id: item.id,
            topic_code: item.topic_code,
            topic_name: item.topic_name,
            topic_description: item.topic_description,
            registration_num: `${item.register_number}/${item.limit_register_number}`,
            teacher: `${item?.teachers?.profiles?.name} (${item?.teachers?.profiles?.user_code})`
        })
    })



    return (
        <>
            <h4 className='title'>Đăng ký và Đề xuất đề tài</h4>
            <div className='d-flex justify-content-end me-4'>
                <Button className='mb-4' icon={<PlusCircleOutlined />} onClick={() => setOpenProposedModal(!isOpenProposedModal)} >Đề xuất đề tài</Button>
            </div>
            <div className='p-5'>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p
                                style={{
                                    margin: '0 0 0 40px',
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
            <ProposeTopicModal isOpen={isOpenProposedModal} />
        </>

    );
};

export default TopicRegistrationProposed;