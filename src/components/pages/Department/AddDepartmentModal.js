import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const AddDepartmentModal = ({ refetchData, isOpen }) => {
    const [newDepartment, setNewDepartment] = useState({
        department_code: '',
        department_name: '',
        dean_id: ''
    });
    const { openNotification } = useContext(NotificationContext);
    const { data: profiles } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
    })
    const createDepartmentModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã khoa">
            <Input value={newDepartment.department_code} onChange={(e) => setNewDepartment(prev => ({ ...prev, department_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên Khoa">
            <Input value={newDepartment.department_name} onChange={(e) => setNewDepartment(prev => ({ ...prev, department_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã trưởng khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={profiles.map(({ user_code, name, id }) => ({ label: `${user_code} - ${name}`, value: id }))}
                onChange={(value) => setNewDepartment(prev => ({ ...prev, dean_id: value }))}
                value={newDepartment.dean_id}
            />
        </Form.Item>
    </Form>)
    const handleCreateDepartment = async () => {
        const { error } = await supabase
            .from('departments')
            .insert([
                newDepartment
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create department successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create department failed',
            description: error.message
        })
    }

    const { modal: createNewDepartment, toggleModal } = useModal({
        content: createDepartmentModalContent,
        title: 'Thêm mới khoa',
        handleConfirm: handleCreateDepartment
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewDepartment({
            department_code: '',
            department_name: '',
            dean_id: ''
        })
    }, [isOpen])

    return (
        <>
            {createNewDepartment}
        </>
    );
};

export default AddDepartmentModal;