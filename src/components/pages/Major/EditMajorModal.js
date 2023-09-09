import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { useEffect } from 'react';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input } from "antd";

const EditMajorModal = ({ updateMajor, setUpdateMajor, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);

    const editMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã ngành">
            <Input value={updateMajor.major_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên ngành">
            <Input value={updateMajor.major_name} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã khoa">
            <Input value={newMajor.department_code} onChange={(e) => setNewMajor(prev => ({ ...prev, department_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Input value={updateMajor.leader_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, leader_code: e.target.value }))} />
        </Form.Item>
    </Form>)

    const handleUpdateMajor = async () => {
        const { error } = await supabase
            .from('majors')
            .update(updateMajor)
            .eq('id', updateMajor.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Update major successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update major failed',
            description: error.message
        })
    }

    const { modal: editMajor, toggleModal } = useModal({
        content: editMajorModalContent,
        title: 'Sửa thông tin ngành',
        handleConfirm: handleUpdateMajor
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editMajor}
        </>
    );
};

export default EditMajorModal;