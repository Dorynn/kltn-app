import React, { useContext, useState, useEffect } from 'react';
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import { fieldAddStudent, options } from './Studentconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';

function AddStudentModal(props) {
    const baseData = {
        user_code: '',
        name: '',
        major_id: '',
        school_year: '',
        student_class: '',
        phone: '',
        email: '',
        address: ''
    };
    const { refetchData, isOpen, setIsOpen } = props;
    const [newStudent, setNewStudent] = useState(baseData);
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
            .select(`major_code, id`)
    })

    const handleCreateStudent = async () => {
        console.log('*** data ***', newStudent)
        const { error } = await supabase.functions.invoke('users', {
            method: 'POST',
            body: { user: { ...newStudent, university_role: 'student' } }
        })
        if (!error) {
            await refetchData({})
            setIsOpen(false);
            return openNotification({
                message: 'Create student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create student failed',
        })
    };

    const handleUpdateDataStudent = ({ field, value }) => {
        // event: giá trị , item: item config
        return setNewStudent(prev => ({ ...prev, [field]: value }));
    };
    // get data cho các select options
    const handleGetOptions = field => {
        if (field === 'major_id') {
            return prepareOptions({ data: majors, labelField: 'major_code', valueField: 'id' })
        }
        return [];
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={newStudent[item.field]}
                    onChange={e => handleUpdateDataStudent({
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
                    onChange={value => handleUpdateDataStudent({
                        field: item.field,
                        value: value
                    })}
                ></Select>
            );
        }
        return <></>;
    };

    const createStudentModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldAddStudent.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewStudent, toggleModal } = useModal({
        content: createStudentModalContent,
        title: 'Thêm mới sinh viên',
        handleConfirm: handleCreateStudent,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewStudent}
        </>
    );
};

export default AddStudentModal;