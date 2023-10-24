import React, { useEffect, useState } from 'react';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';

const ReviewTopicModal = ({ isOpen, reviewedTopic, refetchData }) => {
    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`*, profiles( name)`)
    })
    const [reviewClone, setReviewClone] = useState(reviewedTopic)
    console.log(reviewClone)
    const createReviewTopicModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
        >
            <Form.Item
                label="Sinh viên"
            >
                <Input value={reviewedTopic.student_code} disabled />
            </Form.Item>
            <Form.Item
                label="Giáo viên hướng dẫn"
            >
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? "").includes(input)}
                    options={teachers.map(({ profiles, user_id }) => ({ label: `GV${user_id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => setReviewClone(prev => ({ ...prev, teacher_id: value }))}
                    value={reviewClone.teacher_id}
                />
            </Form.Item>
            <Form.Item
                label="Tên đề tài"
            >
                <Input value={reviewedTopic.topic_name} disabled />
            </Form.Item>
            <Form.Item
                label="Mô tả"
            >
                <TextArea rows={8} value={reviewedTopic.topic_description} disabled />
            </Form.Item>
        </Form>
    )

    const handleConfirmTopic = async () => {
        console.log(reviewedTopic);
        // add vào bảng thesis_topic
        if(reviewedTopic.teacher_id === null) 
            await supabase
            .from('suggested_topics')
            .update({
                teacher_id: reviewClone.teacher_id,
                status: 'pending'
            })
            .eq('id', reviewedTopic.id)
        else
            await supabase
            .from('thesis_topics')
            .insert({
                topic_name: reviewedTopic.topic_name,
                topic_description: reviewedTopic.topic_description,
                limit_register_number: 1,
                register_number: 1,
                teacher_id: reviewClone.teacher_id
            })
            .select()

        await refetchData({})
        
    }

    const { modal: createReviewTopicModal, toggleModal } = useModal({
        content: createReviewTopicModalContent,
        title: 'Duyệt đề tài đề xuất',
        handleConfirm: handleConfirmTopic,
        width: 1000
    })

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])
    return (
        <>
            {createReviewTopicModal}
        </>
    );
};

export default ReviewTopicModal;