import React, { useContext, useEffect } from 'react';
import { Form, Input } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddLecturer } from './Lecturerconstants';

function EditLecturerModal(props) {
    const { updateLecturer, setUpdateLecturer, refetchData, isOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    const handleUpdateLecturer = async () => {
        const { error } = await supabase
            .from('chargePersons')
            .update(updateLecturer)
            .eq('id', updateLecturer.id)
            .select()
        if (!error) {
            await refetchData({})
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

    const editLecturerModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddLecturer.map(item => (
                <Form.Item label={item.label}>
                    <Input value={updateLecturer[item.field]}
                        onChange={(e) => setUpdateLecturer(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))} />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: editLecturer, toggleModal } = useModal({
        content: editLecturerModalContent,
        title: 'Sửa thông tin giáo viên',
        handleConfirm: handleUpdateLecturer
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