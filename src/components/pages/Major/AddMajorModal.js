import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const AddMajorModal = ({ refetchData, isOpen }) => {
    const [newMajor, setNewMajor] = useState({
        major_code: '',
        ministry_major_code: '',
        major_chair_id: ''
    });
    const [ministryMajorData, setMinistryMajorData] = useState([]);
    const { openNotification } = useContext(NotificationContext);
    const { data: departments } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`
                *,
                profiles(name)
            `)
    })

    const { data: profiles } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
    })

    useEffect(() => {
        (async function () {
            const { data } = await supabase.functions.invoke('get-ministry-department-info', {
                method: 'GET',
                headers: { "content-type": "application/json" },
            })
            setMinistryMajorData(data.data)
        })()
    }, [])
    console.log('*** new major ***', newMajor);
    const createMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã ngành (trường)">
            <Input value={newMajor.major_code} onChange={(e) => setNewMajor(prev => ({ ...prev, major_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã ngành (bộ)">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={ministryMajorData.map(({ code, name }) => ({ label: `${code} - ${name}`, value: code }))}
                value={newMajor.ministry_major_code}
                onChange={(value) => setNewMajor(prev => ({ ...prev, ministry_major_code: value, major_name: ministryMajorData.find(item => item.code === value).name }))}
            />
        </Form.Item>
        <Form.Item label="Tên khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                onChange={(value) => setNewMajor(prev => ({ ...prev, department_id: value }))}
                options={departments.map(item => ({ value: item.id, label: `${item.department_code} - ${item.department_name}` }))}
                value={newMajor.department_id}
            />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={profiles.map(({ user_code, name, id }) => ({ label: `${user_code}-${name}`, value: id }))}
                onChange={(value) => setNewMajor(prev => ({ ...prev, major_chair_id: value }))}
                value={newMajor.major_chair_id}
            />
        </Form.Item>
    </Form>)

    const handleCreateMajor = async () => {
        const { error } = await supabase
            .from('majors')
            .insert([
                newMajor
            ])
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Create major successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create major failed',
            description: error.message
        })
    }

    const { modal: createNewMajor, toggleModal } = useModal({
        content: createMajorModalContent,
        title: 'Thêm mới ngành',
        handleConfirm: handleCreateMajor
    })
    useEffect(() => {
        if (isOpen !== undefined) {
            toggleModal(true)
        }
        setNewMajor({
            major_code: '',
            ministry_major_code: '',
            major_chair_id: '',
            department_id: '',
        })
    }, [isOpen])

    return (
        <>
            {createNewMajor}
        </>
    );
};

export default AddMajorModal;