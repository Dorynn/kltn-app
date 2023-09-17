import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const AddSubjectModal = ({ refetchData, isOpen }) => {
    const [newSubject, setNewSubject] = useState({
        course_code: '',
        course_name: '',
        major_id: '',
        course_credits: '',
        credit_coefficient: ''
    });
    const { openNotification } = useContext(NotificationContext);
    const { data: majors } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`major_name, major_code, id`)
    })

    const createSubjectModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã học phần">
            <Input value={newSubject.course_code} onChange={(e) => setNewSubject(prev => ({ ...prev, course_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên học phần">
            <Input value={newSubject.course_name} onChange={(e) => setNewSubject(prev => ({ ...prev, course_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên ngành">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                onChange={(value) => setNewSubject(prev => ({ ...prev, major_id: value }))}
                options={majors.map(item => ({ label: `${item.major_code} - ${item.major_name}`, value: item.id }))}
                value={newSubject.major_id}
            />
        </Form.Item>
        <Form.Item label="Số tín chỉ">
            <Input value={newSubject.course_credits} onChange={(e) => setNewSubject(prev => ({ ...prev, course_credits: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Hệ số">
            <Input value={newSubject.credit_coefficient} onChange={(e) => setNewSubject(prev => ({ ...prev, credit_coefficient: e.target.value }))} />
        </Form.Item>
    </Form>)
    const handleCreateSubject = async () => {
        const { error } = await supabase
            .from('graduation_thesis_course')
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

    const { modal: createNewSubject, toggleModal } = useModal({
        content: createSubjectModalContent,
        title: 'Thêm mới học phần',
        handleConfirm: handleCreateSubject
    })
    useEffect(() => {
        if (isOpen !== undefined) {
            toggleModal(true)
        }
        setNewSubject({
            course_code: '',
            course_name: '',
            major_id: '',
            course_credits: '',
            credit_coefficient: ''
        })
    }, [isOpen])

    return (
        <>
            {createNewSubject}
        </>
    );
};

export default AddSubjectModal;