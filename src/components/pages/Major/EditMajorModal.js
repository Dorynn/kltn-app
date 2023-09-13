import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { useEffect } from 'react';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const EditMajorModal = ({ updateMajor, setUpdateMajor, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: departments } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`*`)
    })

    const editMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã ngành (trường)">
            <Input value={updateMajor.major_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên khoa">
            <Select
                onChange={(value) => setUpdateMajor(prev => ({ ...prev, department_code: value }))}
                options={departments.map(item => ({ value: item.department_code, label: item.department_name }))}
            />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Input value={updateMajor.major_chair_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_chair_code: e.target.value }))} />
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