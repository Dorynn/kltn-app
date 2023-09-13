import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
import { useEffect } from 'react';
import useModal from '../../../hooks/modal/useModal';
import { Form, Input, Select } from "antd";
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';

const codeList = [
    {
        value: '1',
        label: "01",
    },
    {
        value: '2',
        label: "02",
    },
    {
        value: '3',
        label: "03",
    },
    {
        value: '4',
        label: "04",
    },
    {
        value: '5',
        label: "05",
    },
    {
        value: '6',
        label: "06",
    },
    {
        value: '7',
        label: "07",
    },
    {
        value: '8',
        label: "08",
    },
    {
        value: '9',
        label: "09",
    },
    {
        value: '10',
        label: "10",
    },
    {
        value: '11',
        label: "11",
    },
    {
        value: '12',
        label: "12",
    },
    {
        value: '13',
        label: "13",
    },
    {
        value: '14',
        label: "14",
    },
    {
        value: '15',
        label: "15",
    },
    
    
]

const EditMajorModal = ({ updateMajor, setUpdateMajor, refetchData, isOpen }) => {
    const { openNotification } = useContext(NotificationContext);
    const { data: departments} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`*`)
    })

    const editMajorModalContent = (<Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
    >        
        <Form.Item label="Mã ngành (trường)">
            <Input value={updateMajor.major_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_code: e.target.value }))} />
        </Form.Item>
        <Form.Item label="Mã ngành (bộ)">
            <Select
                showSearch
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label??"").includes(input)}
                options={codeList}
                onChange={(value)=>setUpdateMajor(prev=>({...prev, ministry_major_code:value})) }
            />
        </Form.Item>
        <Form.Item label="Tên khoa">
            <Select
                onChange={(value)=>setUpdateMajor(prev => ({...prev, department_name: value}))}
                options={departments.map(item=>({value: item.department_name, label: item.department_name}))}
            />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Input value={updateMajor.major_chair_code} onChange={(e) => setUpdateMajor(prev => ({ ...prev, major_chair_code: e.target.value }))} />
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
                message: 'Update major successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update major failed',
            description: error.message
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