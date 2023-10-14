import React, { useContext } from 'react';
import { useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { Form, Input, Select } from "antd";
import useModal from '../../../hooks/modal/useModal';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';


const EditSubjectModal = ({ updateSubject, setUpdateSubject, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: majors } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`major_name, major_code, id`)
    })
    const editSubjectModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Tên học phần">
            <Input value={updateSubject.course_name} onChange={(e) => setUpdateSubject(prev => ({ ...prev, course_name: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã ngành">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                onChange={(value) => setUpdateSubject(prev => ({ ...prev, major_id: value }))}
                options={majors.map(item => ({ label: `${item.major_code} - ${item.major_name}`, value: item.id }))}
                value={updateSubject.major_id}
            />
        </Form.Item>
        <Form.Item label="Số tín chỉ">
            <Input value={updateSubject.course_credits} onChange={(e) => setUpdateSubject(prev => ({ ...prev, course_credits: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Hệ số">
            <Input value={updateSubject.credit_coefficient} onChange={(e) => setUpdateSubject(prev => ({ ...prev, credit_coefficient: e.target.value }))} />
        </Form.Item>
    </Form>)

    const handleUpdateSubject = async () => {
        const { error } = await supabase
            .from('graduation_thesis_course')
            .update(updateSubject)
            .eq('id', updateSubject.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Cập nhật học phần thành công'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Cập nhật học phần thất bại',
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