import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from "antd";
import NotificationContext from '../../../../context/notificationContext';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { fieldAddStudent } from './Studentconstants';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import prepareOptions from '../../../../helpers/prepareOptions';

function EditStudentModal(props) {
    const { updateStudent, setUpdateStudent, refetchData, isOpen, setIsOpen } = props;
    const { openNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])

    const getUserEmail = async function () {
        let { data: email, error } = await supabase
            .rpc('get_email', {
                auth_id_param: updateStudent.auth_id
            })

        if (error) console.error(error)
        else setUpdateStudent(prev => ({ ...prev, email }))
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

    const handleUpdateStudent = async () => {
        const { error } = await supabase
        await supabase.functions.invoke('users?role=student&isUpdate=true', {
            method: 'POST',
            body: { ...updateStudent }
        })
        if (!error) {
            await refetchData({});
            setIsOpen(false);
            return openNotification({
                message: 'Cập nhật sinh viên thành công'
            });
        }
        return openNotification({
            type: 'error',
            message: 'Cập nhật sinh viên thất bại',
        });
    };

    const handleUpdateDataStudent = ({ field, value }) => {
        return setUpdateStudent(prev => ({ ...prev, [field]: value }));
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
                    value={updateStudent[item.field]}
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
                    value={updateStudent[item.field]}
                    onChange={value => handleUpdateDataStudent({
                        field: item.field,
                        value: value
                    })}
                ></Select>
            );
        }
        return <></>;
    };

    const editStudentModalContent = (
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

    const { modal: editStudent, toggleModal } = useModal({
        content: editStudentModalContent,
        title: 'Sửa thông tin sinh viên',
        handleConfirm: handleUpdateStudent,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {editStudent}
        </>
    );
};

export default EditStudentModal;