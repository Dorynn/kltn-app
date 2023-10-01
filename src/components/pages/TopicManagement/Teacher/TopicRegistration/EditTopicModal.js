import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { fieldUpdateTopic, optionLimitStudent } from './TopicRegistrationconstant';

function EditTopicModal(props) {

    const { updateTopic, setUpdateTopic, refetchData, isOpen, setIsOpen } = props;
    const { confirm } = Modal;
    const { TextArea } = Input;
    const { openNotification } = useContext(NotificationContext);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateTopic = async () => {
        setConfirmLoading(true);
        delete updateTopic.key;
        const { error } = await supabase
            .from('thesis_topics')
            .update({...updateTopic})
            .eq('id', updateTopic.id)
        setConfirmLoading(false);
        if (!error) {
            await refetchData({});
            setIsOpen(false);
            return openNotification({
                message: 'Update topic successfully'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Update topic failed',
        });
    };

    const handleUpdateDataTopic = ({ field, value }) => {
        return setUpdateTopic(prev => ({ ...prev, [field]: value }));
    };

    const ConfirmModal = (id) => {
        confirm({
            title: 'Bạn có thực sự muốn thay đổi đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            confirmLoading: confirmLoading,
            onOk() {
                handleUpdateTopic({ id })
            },
            onCancel() { },
        });
    };

    // get data cho các select optionLimitStudent
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
                    value={updateTopic[item.field]}
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
                    option={handleGetOptions(item.field) || []}
                    value={updateTopic[item.field]}
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
                    value={updateTopic[item.field]}
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

    const editTopicModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldUpdateTopic.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: editTopic, toggleModal } = useModal({
        content: editTopicModalContent,
        title: 'Sửa thông tin đề tài',
        handleConfirm: ConfirmModal,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {editTopic}
        </>
    );
};

export default EditTopicModal;