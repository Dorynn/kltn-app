import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input } from "antd";
import { fieldAddStudent } from './Studentconstants';

function AddStudentModal(props) {
    const { refetchData, isOpen } = props;
    const [newStudent, setNewStudent] = useState({
        student_code: '',
        student_name: '',
        department_code: '',
        course: '',
        classroom: '',
        phoneNumber: '',
        email: '',
        address: ''
    });
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewStudent({
            student_code: '',
            student_name: '',
            department_code: '',
            course: '',
            classroom: '',
            phoneNumber: '',
            email: '',
            address: ''
        })
    }, [isOpen])


    const handleCreateStudent = async () => {
        const { error } = await supabase
            .from('students')
            .insert([
                newStudent
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create student failed',
            description: error.message
        })
    };

    const createStudentModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddStudent.map(item => (
                <Form.Item label={item.label}>
                    <Input
                        value={newStudent[item.field]}
                        onChange={(e) => setNewStudent(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))} />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewStudent, toggleModal } = useModal({
        content: createStudentModalContent,
        title: 'Thêm mới sinh viên',
        handleConfirm: handleCreateStudent
    });

    return (
        <>
            {createNewStudent}
        </>
    );
};

export default AddStudentModal;