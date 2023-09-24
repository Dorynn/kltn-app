import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddTopic, optionLimitStudent } from './TopicRegistrationconstant';


function AddTopicModal(props) {
    const { TextArea } = Input;
    const baseData = {
        topic_name: '',
        topic_description: '',
    };
    const { refetchData, isOpen, setIsOpen } = props;
    const [newTopic, setNewTopic] = useState(baseData);
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])

    const handleCreateTopic = async () => {
        const { error } = await supabase
            .from('thesis_topics')
            .insert({...newTopic})
        if (!error) {
            await refetchData({})
            setIsOpen(false);
            return openNotification({
                message: 'Create student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create student failed',
        })
    };

    const handleUpdateDataTopic = ({ field, value }) => {
        // event: giá trị , item: item config
        return setNewTopic(prev => ({ ...prev, [field]: value }));
    };
    const handleGetOptions = field => {
        if (field === 'limit_register_number') {
            return optionLimitStudent;
        }
        return [];
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={newTopic[item.field]}
                    onChange={e => handleUpdateDataTopic({
                        field: item.field,
                        value: e.target.value
                    })}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    onChange={value => handleUpdateDataTopic({
                        field: item.field,
                        value: value
                    })}
                ></Select>
            );
        }
        if (item.type === 'TEXT_AREA') {
            return (
                <TextArea
                    value={newTopic[item.field]}
                    onChange={e => handleUpdateDataTopic({
                        field: item.field,
                        value: e.target.value
                    })}
                    rows={5}
                ></TextArea>
            );
        }
        return <></>;
    };

    const createTopicModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddTopic.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewTopic, toggleModal } = useModal({
        content: createTopicModalContent,
        title: 'Thêm mới đề tài',
        handleConfirm: handleCreateTopic,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewTopic}
        </>
    );
};

export default AddTopicModal;