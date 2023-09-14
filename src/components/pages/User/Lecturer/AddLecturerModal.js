import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddLecturer, options } from './Lecturerconstants';

function AddLecturerModal(props) {

    const baseData = {
        lecturer_code: '',
        lecturer_name: '',
        major_code: '',
        phoneNumber: '',
        email: '',
    };

    const { refetchData, isOpen, setIsOpen } = props;
    const [newLecturer, setNewLecturer] = useState(baseData);
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])


    const handleCreateLecturer = async () => {
        const { error } = await supabase
            .from('lecturers')
            .insert([
                newLecturer
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create lecturer successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create lecturer failed',
            description: error.message
        })
    };

    const handleUpdateDataLecturer = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...newLecturer,
                [item.field]: event ? event.target.value : '',
            };
            return setNewLecturer(newDataRequest);
        }
        const newDataRequest = {
            ...newLecturer,
            [item.field]: event ? event : '',
        };
        return setNewLecturer(newDataRequest);
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
                    value={newLecturer[item.field]}
                    onChange={e => handleUpdateDataLecturer(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    onChange={e => handleUpdateDataLecturer(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const createLecturerModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddLecturer.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewLecturer, toggleModal } = useModal({
        content: createLecturerModalContent,
        title: 'Thêm mới giáo viên',
        handleConfirm: handleCreateLecturer,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewLecturer}
        </>
    );
};

export default AddLecturerModal;