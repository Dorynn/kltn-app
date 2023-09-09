import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input } from "antd";

const AddMajorModal = ({ refetchData, isOpen }) => {
    const [newMajor, setNewMajor] = useState({
        major_code: '',
        major_name: '',
        department_code: '',
        major_chair_code: ''
    });
    const { openNotification } = useContext(NotificationContext);

    const createMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã ngành">
            <Input value={newMajor.major_code} onChange={(e) => setNewMajor(prev => ({ ...prev, major_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên ngành">
            <Input value={newMajor.major_name} onChange={(e) => setNewMajor(prev => ({ ...prev, major_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã khoa">
            <Input value={newMajor.department_code} onChange={(e) => setNewMajor(prev => ({ ...prev, department_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Input value={newMajor.major_chair_code} onChange={(e) => setNewMajor(prev => ({ ...prev, major_chair_code: e.target.value }))} />
        </Form.Item>
    </Form>)

    const handleCreateMajor = async () => {
        const { error } = await supabase
            .from('majors')
            .insert([
                newMajor
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create major successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create major failed',
            description: error.message
        })
    }

    const { modal: createNewMajor, toggleModal } = useModal({
        content: createMajorModalContent,
        title: 'Thêm mới ngành',
        handleConfirm: handleCreateMajor
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewMajor({
            major_code: '',
            major_name: '',
            department_code: '',
            major_chair_code: ''
        })
    }, [isOpen])

    return (
        <>
            {createNewMajor}
        </>
    );
};

export default AddMajorModal;