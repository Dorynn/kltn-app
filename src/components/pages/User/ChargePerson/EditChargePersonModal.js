import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddChargePerson, options } from './ChargePersonconstants';

function EditChargePersonModal(props) {
    const { updateChargePerson, setUpdateChargePerson, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateChargePerson = async () => {
        const { error } = await supabase
            .from('chargePersons')
            .update(updateChargePerson)
            .eq('id', updateChargePerson.id)
            .select()
        if (!error) {
            await refetchData({});
            setIsOpen(false);
            return openNotification({
                message: 'Update chargePerson successfully'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Update chargePerson failed',
            description: error.message
        });
    };
    
    const handleUpdateDataChargePerson = (event, item) => {
        // event: giá trị , item: item config
        if (item.type === 'INPUT') {
            const newDataRequest = {
                ...updateChargePerson,
                [item.field]: event ? event.target.value : '',
            };
            return setUpdateChargePerson(newDataRequest);
        }
        const newDataRequest = {
            ...updateChargePerson,
            [item.field]: event ? event : '',
        };
        return setUpdateChargePerson(newDataRequest);
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
                    value={updateChargePerson[item.field]}
                    onChange={e => handleUpdateDataChargePerson(e, item)}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    value={updateChargePerson[item.field]}
                    onChange={e => handleUpdateDataChargePerson(e, item)}
                ></Select>
            );
        }
        return <></>;
    };

    const editChargePersonModalContent = (
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

    const { modal: editChargePerson, toggleModal } = useModal({
        content: editChargePersonModalContent,
        title: 'Sửa thông tin người phụ trách KLTN',
        handleConfirm: handleUpdateChargePerson,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {editChargePerson}
        </>
    );
};

export default EditChargePersonModal;