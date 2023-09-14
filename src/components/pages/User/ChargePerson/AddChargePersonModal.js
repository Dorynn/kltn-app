import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddChargePerson, options } from './ChargePersonconstants';

function AddChargePersonModal(props) {
    const baseData = {
        chargePerson_code: '',
        chargePerson_name: '',
        department_code: '',
        phoneNumber: '',
        email: '',
        address: ''
    };
    const { refetchData, isOpen, setIsOpen } = props;
    const [newChargePerson, setNewChargePerson] = useState(baseData);
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
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
            setIsOpen(false);
            return openNotification({
                message: 'Create chargePerson successfully'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Create chargePerson failed',
            description: error.message
        })
    };

    const handleUpdateDataChargePerson = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...newChargePerson,
                [item.field]: event ? event.target.value : '',
            };
            return setNewChargePerson(newDataRequest);
        }
        const newDataRequest = {
            ...newChargePerson,
            [item.field]: event ? event : '',
        };
        return setNewChargePerson(newDataRequest);
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
                    value={newChargePerson[item.field]}
                    onChange={e => handleUpdateDataChargePerson(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    onChange={e => handleUpdateDataChargePerson(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const createChargePersonModalContent = (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
        >
            {fieldAddChargePerson.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewChargePerson, toggleModal } = useModal({
        content: createChargePersonModalContent,
        title: 'Thêm mới người phụ trách KLTN',
        handleConfirm: handleCreateChargePerson,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewChargePerson}
        </>
    );
};

export default AddChargePersonModal;