import React, { useContext, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import { Form, Input, Select } from "antd";

const EditDepartmentModal = ({ updateDepartment, setUpdateDepartment, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: profiles } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
    })
    const editDepartmentModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã khoa">
            <Input value={updateDepartment.department_code} onChange={(e) => setUpdateDepartment(prev => ({ ...prev, department_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên Khoa">
            <Input value={updateDepartment.department_name} onChange={(e) => setUpdateDepartment(prev => ({ ...prev, department_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã trưởng khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={profiles.map(({ user_code, name}) => ({ label: `${user_code}-${name}`, value: user_code }))}
                onChange={(value) => setUpdateDepartment(prev => ({ ...prev, dean_code: value }))}
                value={updateDepartment.dean_code}
            />
        </Form.Item>
    </Form>)

    const handleUpdateDepartment = async () => {
        const { error } = await supabase
            .from('departments')
            .update(updateDepartment)
            .eq('id', updateDepartment.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Update department successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update department failed',
            description: error.message
        })
    }

    const { modal: editDepartment, toggleModal } = useModal({
        content: editDepartmentModalContent,
        title: 'Sửa thông tin khoa',
        handleConfirm: handleUpdateDepartment
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editDepartment}
        </>
    );
};

export default EditDepartmentModal;