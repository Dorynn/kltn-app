import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddLecturer, options } from './Lecturerconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';

function EditLecturerModal(props) {
    const { updateLecturer, setUpdateLecturer, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])
    const getUserEmail = async function () {
        let { data: email, error } = await supabase
            .rpc('get_email', {
                auth_id_param: updateLecturer.auth_id
            })

        if (error) console.error(error)
        else setUpdateLecturer(prev => ({ ...prev, email }))
    }
    useEffect(() => {
        getUserEmail()
    }, [])

    const { data: majors } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`major_code, id, major_name`)
    })
    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const handleUpdateLecturer = async () => {
        const { error } = await supabase
        await supabase.functions.invoke('users?role=teacher&isUpdate=true', {
            method: 'POST',
            body: { ...updateLecturer }
        })
        if (!error) {
            await refetchData({});
            setIsOpen(false);
            return openNotification({
                message: 'Update teacher successfully'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Update teacher failed',
        });
    };

    const handleUpdateDataLecturer = ({ field, value }) => {
        return setUpdateLecturer(prev => ({ ...prev, [field]: value }));
    };

    // get data cho các select options
    const handleGetOptions = field => {
        if (field === 'major_id') {
            return prepareOptions({ data: majors, labelField: 'id', valueField: 'id', prefix: 'MJ', subfix: 'major_name' })
        }
        return [];
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={updateLecturer[item.field]}
                    onChange={e => handleUpdateDataLecturer({
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
                    value={updateLecturer[item.field]}
                    onChange={value => handleUpdateDataLecturer({
                        field: item.field,
                        value: value
                    })}
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