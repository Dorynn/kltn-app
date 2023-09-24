import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddChargePerson } from './ChargePersonconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';

function AddChargePersonModal(props) {
    const baseData = {
        user_code: '',
        name: '',
        department_id: '',
        phone: '',
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

    const { data: departments } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`department_code, id`)
    })

    const handleCreateChargePerson = async () => {
        const { error } = await supabase.functions.invoke('users?isCreate=true', {
            method: 'POST',
            body: { user: { ...newChargePerson, university_role: 'charge_person' } }
        })
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
        })
    };

    const handleUpdateDataChargePerson = ({ field, value }) => {
        return setNewChargePerson(prev => ({ ...prev, [field]: value }));
    };

    // get data cho các select options
    const handleGetOptions = field => {
        if (field === 'department_id') {
            return prepareOptions({ data: departments, labelField: 'department_code', valueField: 'id' });
        }
        return [];
    };
    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={newChargePerson[item.field]}
                    onChange={e => handleUpdateDataChargePerson({
                        field: item.field,
                        value: e.target.value
                    })}
                />
            );
        }
        if (item.type === 'SELECT') {
            return (
                <Select
                    options={handleGetOptions(item.field) || []}
                    onChange={value => handleUpdateDataChargePerson({
                        field: item.field,
                        value: value
                    })}
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