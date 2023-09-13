import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input } from "antd";
import { fieldAddChargePerson } from './ChargePersonconstants';

function AddChargePersonModal(props) {
    const { refetchData, isOpen } = props;
    const [newChargePerson, setNewChargePerson] = useState({
        chargePerson_code: '',
        chargePerson_name: '',
        department_code: '',
        phoneNumber: '',
        email: '',
        address: ''
    });
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
        setNewChargePerson({
            chargePerson_code: '',
            chargePerson_name: '',
            department_code: '',
            phoneNumber: '',
            email: '',
            address: ''
        })
    }, [isOpen])


    const handleCreateChargePerson = async () => {
        const { error } = await supabase
            .from('chargePersons')
            .insert([
                newChargePerson
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create chargePerson successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create chargePerson failed',
            description: error.message
        })
    };

    const createChargePersonModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddChargePerson.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    <Input
                        value={newChargePerson[item.field]}
                        onChange={(e) => setNewChargePerson(prev => (
                            { ...prev, [item.field]: e.target.value }
                        ))}
                    />
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewChargePerson, toggleModal } = useModal({
        content: createChargePersonModalContent,
        title: 'Thêm mới người phụ trách KLTN',
        handleConfirm: handleCreateChargePerson
    });

    return (
        <>
            {createNewChargePerson}
        </>
    );
};

export default AddChargePersonModal;