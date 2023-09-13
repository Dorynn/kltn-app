import React, { useContext, useEffect } from 'react';
import { Form, Input } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddChargePerson } from './ChargePersonconstants';

function EditChargePersonModal(props) {
    const { updateChargePerson, setUpdateChargePerson, refetchData, isOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    const handleUpdateChargePerson = async () => {
        const { error } = await supabase
            .from('chargePersons')
            .update(updateChargePerson)
            .eq('id', updateChargePerson.id)
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

    const editChargePersonModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddChargePerson.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    <Input value={updateChargePerson[item.field]}
                        onChange={(e) => setUpdateChargePerson(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))}
                    />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: editChargePerson, toggleModal } = useModal({
        content: editChargePersonModalContent,
        title: 'Sửa thông tin người phụ trách KLTN',
        handleConfirm: handleUpdateChargePerson
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editChargePerson}
        </>
    );
};

export default EditChargePersonModal;