import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { useEffect } from 'react';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const EditMajorModal = ({ updateMajor, setUpdateMajor, refetchData, isOpen }) => {
    const [ministryMajorData, setMinistryMajorData] = useState([]);
    const { openNotification } = useContext(NotificationContext);
    useEffect(() => {
        (async function () {
            const { data } = await supabase.functions.invoke('get-ministry-department-info', {
                method: 'GET',
                headers: { "content-type": "application/json" },
            })
            setMinistryMajorData(data.data)
        })()
    }, [])
    const { data: departments } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`*`)
    })

    const { data: profiles } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('profiles')
            .select(`*`)
            .eq('university_role', 'teacher')
    })

    const editMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >
        <Form.Item label="Mã ngành (bộ)">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={ministryMajorData.map(({ code, name }) => ({ label: `${code} - ${name}`, value: code }))}
                value={updateMajor.ministry_major_code}
                onChange={(value) => setUpdateMajor(prev => ({ ...prev, ministry_major_code: value, major_name: ministryMajorData.find(item => item.code === value).name }))}
            />
        </Form.Item>
        <Form.Item label="Mã khoa">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                onChange={(value) => setUpdateMajor(prev => ({ ...prev, department_id: value }))}
                options={departments.map(item => ({ value: item.id, label: `DPM${item.id} - ${item.department_name}` }))}
                value={updateMajor.department_id}
            />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? "").includes(input)}
                options={profiles.map(({ user_code, name, id }) => ({ label: `GV${id} - ${name}`, value: id }))}
                onChange={(value) => setUpdateMajor(prev => ({ ...prev, major_chair_id: value }))}
                value={updateMajor.major_chair_id}
            />
        </Form.Item>
    </Form>)

    const handleUpdateMajor = async () => {
        const { error } = await supabase
            .from('majors')
            .update(updateMajor)
            .eq('id', updateMajor.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Cập nhật ngành thành công'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Cập nhật ngành thất bại',
        })
    }

    const { modal: editMajor, toggleModal } = useModal({
        content: editMajorModalContent,
        title: 'Sửa thông tin ngành',
        handleConfirm: handleUpdateMajor
    })
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])

    return (
        <>
            {editMajor}
        </>
    );
};

export default EditMajorModal;