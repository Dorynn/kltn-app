import React, {useEffect, useState, useContext} from 'react';
import useModal from '../../../../../hooks/modal/useModal';
import {Form, Input} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import supabase from '../../../../../supabaseClient';
import NotificationContext from '../../../../../context/notificationContext';
import AuthContext from '../../../../../context/authContext';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
const ProposeTopicModal = ({isOpen, refetchData, setHideProposedButton}) => {
    const { openNotification } = useContext(NotificationContext);
    
    const [proposedTopic, setProposedTopic] = useState({
        topic_name: '',
        topic_description: '',
        suggested_student_id: '',
    })
    const { data: students, requestAction: refetchData1 } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
    })
    const createProposedTopicModalContent = (
        <Form
            labelCol={{span: 6}}
            wrapperCol={{ span: 18}}
        >
            <Form.Item label="Tên đề tài">
                <Input value={proposedTopic.topic_name} onChange={e => setProposedTopic(prev => ({...prev, topic_name: e.target.value}))}/>
            </Form.Item>
            <Form.Item label="Mô tả">
                <TextArea value={proposedTopic.topic_description} onChange={e => setProposedTopic(prev => ({...prev, topic_description: e.target.value}))} rows = {15}/>
            </Form.Item>
        </Form>
    )

    const handleProposedTopic = async () => {
        const {error} = await supabase
        .from('suggested_topics')
        .insert([{
            suggested_student_id: students[0].id,
            topic_name: proposedTopic.topic_name,
            topic_description: proposedTopic.topic_description,
        }])
        
        if (!error) {
            return openNotification({
                message: 'Propose topic successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Propose topic failed',
            description: error.message
        })
    }

    const {modal: createProposedTopic, toggleModal} = useModal({
        content: createProposedTopicModalContent,
        title: 'Đề xuất đề tài',
        handleConfirm: handleProposedTopic,
        width: 1000
    })

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setProposedTopic({
            topic_name: '',
            topic_description: '',
            suggested_student_id: '',
        })
        
    },[isOpen])

    return (
        <>
         {createProposedTopic}   
        </>
    );
};

export default ProposeTopicModal;