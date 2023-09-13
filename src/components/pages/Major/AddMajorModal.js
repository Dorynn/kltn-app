import React, { useContext, useState, useEffect } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';
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


const AddMajorModal = ({ refetchData, isOpen }) => {
    const [newMajor, setNewMajor] = useState({
        major_code: '',
        major_ministry_code: '',
        department_name: '',
        major_chair_code: ''
    });
    const { openNotification } = useContext(NotificationContext);
    const { data: departments} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('departments')
            .select(`
                *,
                profiles(name)
            `)
    })

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
                filterOption={(input, option) => (option?.label??"").includes(input)}
                options={codeList}
                onChange={(value)=>setNewMajor(prev=>({...prev, ministry_major_code:value}))}
            />
        </Form.Item>
        <Form.Item label="Tên khoa">
            <Select
                onChange={(value)=>setNewMajor(prev => ({...prev, department_name: value}))}
                options={departments.map(item=>({value: item.department_name, label: item.department_name}))}
            />
        </Form.Item>
        <Form.Item label="Mã trưởng ngành">
            <Input value={newMajor.major_chair_code} onChange={(e) => setNewMajor(prev => ({ ...prev, major_chair_code: e.target.value }))} />
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
        if (isOpen !== undefined)
            toggleModal(true)
            console.log(departments)
        setNewMajor({
            major_code: '',
            major_ministry_code: '',
            department_name: '',
            major_chair_code: ''
        })
    }, [isOpen])

    return (
        <>
            {createNewMajor}
        </>
    );
};

export default AddMajorModal;