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
            .eq('university_role', 'teacher')
    })
    const { data: chargePersons } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`
                *,
                profiles(name, user_code)
            `)
    })
    const editDepartmentModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Tên Khoa">
            <Input value={updateDepartment.department_name} onChange={(e) => setUpdateDepartment(prev => ({ ...prev, department_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã trưởng khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={profiles.map(({ user_code, name, id }) => ({ label: `${user_code}-${name}`, value: id }))}
                onChange={(value) => setUpdateDepartment(prev => ({ ...prev, dean_id: value }))}
                value={updateDepartment.dean_id}
            />
        </Form.Item>
        <Form.Item label="Người phụ trách">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={chargePersons?.map(({ profiles, user_id }) => ({ label: `${profiles?.user_code} - ${profiles?.name}`, value: user_id }))}
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