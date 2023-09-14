import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddStudent, options } from './Studentconstants';

function EditStudentModal(props) {
    const { updateStudent, setUpdateStudent, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateStudent = async () => {
        const { error } = await supabase
            .from('students')
            .update(updateStudent)
            .eq('id', updateStudent.id)
            .select()
        if (!error) {
            await refetchData({});
            setIsOpen(false);
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

    const handleUpdateDataStudent = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...updateStudent,
                [item.field]: event ? event.target.value : '',
            };
            return setUpdateStudent(newDataRequest);
        }
        const newDataRequest = {
            ...updateStudent,
            [item.field]: event ? event : '',
        };
        return setUpdateStudent(newDataRequest);
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
                    value={updateStudent[item.field]}
                    onChange={e => handleUpdateDataStudent(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            console.log(item);
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    value={updateStudent[item.field]}
                    onChange={e => handleUpdateDataStudent(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const editStudentModalContent = (
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

    const { modal: editStudent, toggleModal } = useModal({
        content: editStudentModalContent,
        title: 'Sửa thông tin sinh viên',
        handleConfirm: handleUpdateStudent,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {editStudent}
        </>
    );
};

export default EditStudentModal;