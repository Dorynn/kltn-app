import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input } from "antd";
import { fieldAddLecturer } from './Lecturerconstants';

function AddLecturerModal(props) {
    const { refetchData, isOpen } = props;
    const [newLecturer, setNewLecturer] = useState({
        lecturer_code: '',
        lecturer_name: '',
        major_code: '',
        phoneNumber: '',
        email: '',
    });
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewLecturer({
            lecturer_code: '',
            lecturer_name: '',
            major_code: '',
            phoneNumber: '',
            email: '',
        })
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

    const createLecturerModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddLecturer.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    <Input
                        value={newLecturer[item.field]}
                        onChange={(e) => setNewLecturer(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))} />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewLecturer, toggleModal } = useModal({
        content: createLecturerModalContent,
        title: 'Thêm mới giáo viên',
        handleConfirm: handleCreateLecturer
    });

    return (
        <>
            {createNewLecturer}
        </>
    );
};

export default AddLecturerModal;