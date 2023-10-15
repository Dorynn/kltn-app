import React, { useEffect, useState } from 'react';
import ReviewTopicModal from './ReviewTopicModal';
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import { Table, Button, Modal } from 'antd';
import { useContext } from 'react';
import AuthContext from '../../../../../context/authContext';
import NotificationContext from '../../../../../context/notificationContext';
import { ExclamationCircleFilled } from '@ant-design/icons';

const ProposedTopicList = () => {
    const { user } = useContext(AuthContext);
    const { openNotification } = useContext(NotificationContext);
    const { confirm } = Modal;
    const [isOpenReviewModal, setOpenReviewModal] = useState(false);
    const [isChargePerson, setIsChargePerson] = useState(false)
    const [reviewedTopic, setReviewedTopic] = useState({});
    const { data: suggestedList, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('suggested_topics')
            .select(`*, students(*, profiles(user_code, name, id))`)
            .eq('teacher_id', user.user_id)
    })
    const checkIsChargePerson = async () => {
        const { data } = await supabase.rpc('is_charge_person');
        setIsChargePerson(data);
    };
    useEffect(() => {
        checkIsChargePerson();
    }, []);
    const handleRejectTopic = async (record) => {
        const { error } = await supabase
            .from('suggested_topics')
            .delete()
            .eq('id', record.id)
        if (!error) {
            await refetchData({});
            return openNotification({
                message: 'Từ chối đề xuất đề tài thành công'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Từ chối đề xuất đề tài thất bại',
        });
    }
    const handleApproveTopic = async (record) => {
        const { error } = await supabase
            .from('suggested_topics')
            .update({
                status: 'approved'
            })
            .eq('id', record.id)
        if (!error) {
            await refetchData({});
            const { data } = await supabase
                .from('thesis_topics')
                .insert({
                    topic_name: record.topic_name,
                    topic_description: record.topic_description,
                    limit_register_number: 1,
                    register_number: 1,
                    teacher_id: user.user_id
                })
                .select()
            if (data && data.length > 0 && data[0].id) {
                await supabase
                .from('student_theses')
                .insert({
                    topic_id: data[0].id,
                    status: 'doing',
                    student_id: record.suggested_student_id,
                })
            }
            return openNotification({
                message: 'Duyệt đề xuất đề tài thành công'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Duyệt đề xuất đề tài thất bại',
        });
    }
    const selectTeacherApproved = (record) => {
        if (isChargePerson) {
            setOpenReviewModal(true);
            return setReviewedTopic(record);
        }
        return ConfirmModalApproved(record);
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
                    record.status === 'approved' ? <Button disabled>Đã duyệt </Button> :
                        record.status === 'reject' ? <Button disabled>Đã từ chối</Button> :
                            <div className='d-flex justify-content-center align-items-center'>
                                <Button style={{ marginRight: '12px' }} onClick={() => ConfirmModalReject(record)}>Không duyệt</Button>
                                <Button onClick={() => selectTeacherApproved(record)}>Duyệt</Button>
                            </div>
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
            status: item.status,
            student_code: `SV${item?.students?.user_id || ''} - ${item?.students?.profiles?.name || ''}`
        })
    })
    const ConfirmModalReject = (record) => {
        confirm({
            title: 'Bạn có thực sự muốn từ chối đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleRejectTopic(record)
            },
            onCancel() { },
        });
    };
    const ConfirmModalApproved = (record) => {
        confirm({
            title: 'Bạn có thực sự muốn duyệt đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ được sinh viên đăng ký sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleApproveTopic(record)
            },
            onCancel() { },
        });
    };

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
            {isOpenReviewModal && <ReviewTopicModal isOpen={isOpenReviewModal} setReviewedTopic={setReviewedTopic} reviewedTopic={reviewedTopic} />}
        </>
    );
};

export default ProposedTopicList;