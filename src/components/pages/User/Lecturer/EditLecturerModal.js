import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddLecturer, options } from './Lecturerconstants';

function EditLecturerModal(props) {
    const { updateLecturer, setUpdateLecturer, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateLecturer = async () => {
        const { error } = await supabase
            .from('chargePersons')
            .update(updateLecturer)
            .eq('id', updateLecturer.id)
            .select()
        if (!error) {
            await refetchData({})
            setIsOpen(false);
            return openNotification({
                message: 'Update chargePerson successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update chargePerson failed',
            description: error.message
        })
    };

    const handleUpdateDataLecturer = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...updateLecturer,
                [item.field]: event ? event.target.value : '',
            };
            return setUpdateLecturer(newDataRequest);
        }
        const newDataRequest = {
            ...updateLecturer,
            [item.field]: event ? event : '',
        };
        return setUpdateLecturer(newDataRequest);
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
                    value={updateLecturer[item.field]}
                    onChange={e => handleUpdateDataLecturer(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            console.log(item);
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    value={updateLecturer[item.field]}
                    onChange={e => handleUpdateDataLecturer(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const editLecturerModalContent = (
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

    const { modal: editLecturer, toggleModal } = useModal({
        content: editLecturerModalContent,
        title: 'Sửa thông tin giáo viên',
        handleConfirm: handleUpdateLecturer,
        setIsOpen: setIsOpen
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editLecturer}
        </>
    );
};

export default EditLecturerModal;