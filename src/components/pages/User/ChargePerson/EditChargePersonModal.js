import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddChargePerson } from './ChargePersonconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';


function EditChargePersonModal(props) {
    const { updateChargePerson, setUpdateChargePerson, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);
    console.log('updateChargePerson', updateChargePerson)
    const getUserEmail = async function () {
        let { data: email, error } = await supabase
            .rpc('get_email', {
                auth_id_param: updateChargePerson.auth_id
            })

        if (error) console.error(error)
        else setUpdateChargePerson(prev => ({ ...prev, email }))
    }
    useEffect(() => {
        getUserEmail()
    }, [])
    const { data: departments } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`department_code, id`)
    })
    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateChargePerson = async () => {
        console.log('updateChargePerson', updateChargePerson)
        const { error } = await supabase
        await supabase.functions.invoke('users?role=charge_person&isUpdate=true', {
            method: 'POST',
            body: { ...updateChargePerson }
        })
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

    const handleUpdateDataChargePerson = ({ field, value }) => {
        return setUpdateChargePerson(prev => ({ ...prev, [field]: value }));
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
                    value={updateChargePerson[item.field]}
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
                    value={updateChargePerson[item.field]}
                    onChange={value => handleUpdateDataChargePerson({
                        field: item.field,
                        value: value
                    })}
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