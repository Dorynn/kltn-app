import React, { useContext, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import { Form, Input, Select } from "antd";

const EditDepartmentModal = ({ updateDepartment, setUpdateDepartment, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`*, profiles(user_code, name)`)
    })
    const editDepartmentModalContent = (<Form
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        layout="horizontal"
    >
        <Form.Item label="Mã khoa">
            <Input value={updateDepartment.department_code} onChange={(e) => setUpdateDepartment(prev => ({ ...prev, department_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Tên Khoa">
            <Input value={updateDepartment.department_name} onChange={(e) => setUpdateDepartment(prev => ({ ...prev, department_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Trưởng khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={teachers.map(({ profiles, id }) => ({ label: `${profiles.user_code} - ${profiles.name}`, value: id }))}
                onChange={(value) => setUpdateDepartment(prev => ({ ...prev, dean_id: value }))}
                value={updateDepartment.dean_id}
            />
        </Form.Item>
        <Form.Item label="Người phụ trách KLTN">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={teachers.map(({ profiles, id }) => ({ label: `${profiles.user_code} - ${profiles.name}`, value: id }))}
                onChange={(value) => setUpdateDepartment(prev => ({ ...prev, charge_person_id: value }))}
                value={updateDepartment.charge_person_id}
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