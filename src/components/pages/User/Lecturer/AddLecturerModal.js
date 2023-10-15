import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddLecturer, options } from './Lecturerconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';

function AddLecturerModal(props) {

    const baseData = {
        user_code: '',
        name: '',
        major_id: '',
        phone: '',
        email: '',
    };

    const { refetchData, isOpen, setIsOpen } = props;
    const [newLecturer, setNewLecturer] = useState(baseData);
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])

    const { data: majors } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('majors')
            .select(`major_code, id, major_name`)
    })


    const handleCreateLecturer = async () => {
        const { error } = await supabase.functions.invoke('users?isCreate=true', {
            method: 'POST',
            body: { user: { ...newLecturer, university_role: 'teacher' } }
        })
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Tạo mới giáo viên thành công'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Tạo mới giáo viên thất bại',
        })
    };

    const handleUpdateDataLecturer = ({ field, value }) => {
        // event: giá trị , item: item config
        return setNewLecturer(prev => ({ ...prev, [field]: value }));
    };

    // get data cho các select options
    const handleGetOptions = field => {
        console.log('majors', majors);
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
                    value={newLecturer[item.field]}
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
                    onChange={value => handleUpdateDataLecturer({
                        field: item.field,
                        value: value
                    })}
                ></Select>
            );
        }
        return <></>;
    };

    const createLecturerModalContent = (
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

    const { modal: createNewLecturer, toggleModal } = useModal({
        content: createLecturerModalContent,
        title: 'Thêm mới giáo viên',
        handleConfirm: handleCreateLecturer,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewLecturer}
        </>
    );
};

export default AddLecturerModal;