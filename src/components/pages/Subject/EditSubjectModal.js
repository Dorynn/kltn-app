import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { Form, Input, Select } from "antd";
import useModal from '../../../hooks/modal/useModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';


const EditSubjectModal = ({ updateSubject, setUpdateSubject, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: majors} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`*`)
    })
    const editSubjectModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã học phần">
            <Input value={updateSubject.subject_code} onChange={(e) => setUpdateSubject(prev => ({ ...prev, subject_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên học phần">
            <Input value={updateSubject.subject_name} onChange={(e) => setUpdateSubject(prev => ({ ...prev, subject_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Ngành">
            <Select
                onChange={(value)=>setUpdateSubject(prev => ({...prev, major_name: value}))}
                options={majors.map(item=>({value: item.major_name, label: item.major_name}))}
            />
        </Form.Item>
        <Form.Item label="Số tín chỉ">
            <Input value={updateSubject.dean_code} onChange={(e) => setUpdateSubject(prev => ({ ...prev, dean_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Hệ số">
            <Input value={updateSubject.dean_code} onChange={(e) => setUpdateSubject(prev => ({ ...prev, dean_code: e.target.value }))} />
        </Form.Item>
    </Form>)

    const handleUpdateSubject = async () => {
        const { error } = await supabase
            .from('subjects')
            .update(updateSubject)
            .eq('id', updateSubject.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Update subject successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update subject failed',
            description: error.message
        })
    }

    const { modal: editSubject, toggleModal } = useModal({
        content: editSubjectModalContent,
        title: 'Sửa thông tin học phần',
        handleConfirm: handleUpdateSubject
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editSubject}
        </>
    );
};

export default EditSubjectModal;