import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddStudent, options } from './Studentconstants';

function AddStudentModal(props) {
    const baseData = {
        student_code: '',
        student_name: '',
        department_code: '',
        course: '',
        classroom: '',
        phoneNumber: '',
        email: '',
        address: ''
    };
    const { refetchData, isOpen, setIsOpen } = props;
    const [newStudent, setNewStudent] = useState(baseData);
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
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
            setIsOpen(false);
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

    const handleUpdateDataStudent = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...newStudent,
                [item.field]: event ? event.target.value : '',
            };
            return setNewStudent(newDataRequest);
        }
        const newDataRequest = {
            ...newStudent,
            [item.field]: event ? event : '',
        };
        return setNewStudent(newDataRequest);
    };

    // get data cho các select options
    const handleGetOptions = field => {
        if (field === 'department_code') {
            return options || [];
        }
        return [];
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={newStudent[item.field]}
                    onChange={e => handleUpdateDataStudent(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    onChange={e => handleUpdateDataStudent(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const createStudentModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddStudent.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewStudent, toggleModal } = useModal({
        content: createStudentModalContent,
        title: 'Thêm mới sinh viên',
        handleConfirm: handleCreateStudent,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewStudent}
        </>
    );
};

export default AddStudentModal;