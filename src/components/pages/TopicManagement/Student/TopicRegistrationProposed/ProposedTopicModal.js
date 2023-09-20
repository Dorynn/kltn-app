import React, {useEffect, useState, useContext} from 'react';
import useModal from '../../../../../hooks/modal/useModal';
import {Form, Input} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import supabase from '../../../../../supabaseClient';
import NotificationContext from '../../../../../context/notificationContext';
import AuthContext from '../../../../../context/authContext';

const ProposeTopicModal = ({isOpen, refetchData, setHideProposedButton}) => {
    const { openNotification } = useContext(NotificationContext);
    const { user} = useContext(AuthContext);
    
    const [proposedTopic, setProposedTopic] = useState({
        topic_name: '',
        topic_description: '',
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
        .from('proposedlist')
        .insert([...proposedTopic, user.user_code])
        .select()
        setHideProposedButton(false);
        if (!error) {
            await refetchData({})
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
        })
        
    },[isOpen])

    return (
        <>
         {createProposedTopic}   
        </>
    );
};

export default ProposeTopicModal;