import React, { useEffect } from 'react';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';

const ReviewTopicModal = ({ isOpen, setReviewedTopic, reviewedTopic, setReviewed }) => {
    const {data: teachers} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
        .from('teachers')
        .select(`*, profiles(user_code, name)`)
    })
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
                    filterOption={(input, option) => (option?.label??"").includes(input)}
                    options={teachers.map(({profiles, id}) => ({label: `${profiles.user_code} - ${profiles.name}`, value: id}))}
                    onChange={(value) => setReviewedTopic(prev => ({...prev, teacher_id: value}))}
                    value={reviewedTopic.teacher_id}
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
                <TextArea rows = {8} value={reviewedTopic.topic_description} disabled />
            </Form.Item>
        </Form>
    )

    const handleConfirmTopic = () => {
        setReviewedTopic({...reviewedTopic, isReviewed: true})
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