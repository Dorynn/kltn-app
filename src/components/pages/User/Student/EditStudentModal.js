import React, { useContext, useEffect } from 'react';
import { Form, Input } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddStudent } from './Studentconstants';

function EditStudentModal(props) {
    const { updateStudent, setUpdateStudent, refetchData, isOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    const handleUpdateStudent = async () => {
        const { error } = await supabase
            .from('students')
            .update(updateStudent)
            .eq('id', updateStudent.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Update student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update student failed',
            description: error.message
        })
    };

    const editStudentModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddStudent.map(item => (
                <Form.Item label={item.label}>
                    <Input value={updateStudent[item.field]}
                        onChange={(e) => setUpdateStudent(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))} />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: editStudent, toggleModal } = useModal({
        content: editStudentModalContent,
        title: 'Sửa thông tin sinh viên',
        handleConfirm: handleUpdateStudent
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editStudent}
        </>
    );
};

export default EditStudentModal;