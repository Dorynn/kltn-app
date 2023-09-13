import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const AddSubjectModal = ({ refetchData, isOpen }) => {
    const [newSubject, setNewSubject] = useState({
        subject_code: '',
        subject_name: '',
        major_name: '',
        subject_credit: '',
        subject_coefficient: ''
    });
    const { openNotification } = useContext(NotificationContext);
    const { data: majors} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`
                *,
                profiles(name),
                departments(department_name, department_code)
            `)
    })
    
    const createDepartmentModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã học phần">
            <Input value={newSubject.subject_code} onChange={(e) => setNewSubject(prev => ({ ...prev, subject_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên học phần">
            <Input value={newSubject.subject_name} onChange={(e) => setNewSubject(prev => ({ ...prev, subject_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên ngành">
            <Select
                onChange={(value)=>setNewSubject(prev => ({...prev, major_name: value}))}
                options={majors.map(item=>({value: item.major_name, label: item.major_name}))}
            />
        </Form.Item>
        <Form.Item label="Số tín chỉ">
            <Input value={newSubject.subject_credit} onChange={(e) => setNewSubject(prev => ({ ...prev, subject_credit: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Hệ số">
            <Input value={newSubject.subject_coefficient} onChange={(e) => setNewSubject(prev => ({ ...prev, subject_coefficient: e.target.value }))} />
        </Form.Item>
    </Form>)
    const handleCreateDepartment = async () => {
        const { error } = await supabase
            .from('departments')
            .insert([
                newSubject
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create subject successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create subject failed',
            description: error.message
        })
    }

    const { modal: createNewDepartment, toggleModal } = useModal({
        content: createDepartmentModalContent,
        title: 'Thêm mới học phần',
        handleConfirm: handleCreateDepartment
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewSubject({
            subject_code: '',
            subject_name: '',
            major_name: '',
            subject_credit: '',
            subject_coefficient: ''
        })
    }, [isOpen])

    return (
        <>
            {createNewDepartment}
        </>
    );
};

export default AddSubjectModal;