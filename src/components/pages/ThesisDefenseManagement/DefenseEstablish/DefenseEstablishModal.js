import React, { useContext, useEffect } from 'react';
import supabase from '../../../../supabaseClient';
import NotificationContext from '../../../../context/notificationContext';
import useModal from '../../../../hooks/modal/useModal';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import {Form, Input, Select} from 'antd'

const DefenseEstablishModal = ({isOpen}) => {
    const {openNotification} = useContext(NotificationContext);
    const {data: teachers} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
        .from('teachers')
        .select(`*, profiles(name)`)
    })
    const {data: defenseCommittee} = useSupbaseAction({
        initialData: [], defaultAction: async () => supabase
        .from('defense_committees')
        .select(`*`)
    }) 
    console.log(teachers)
    const defenseModalContent = (
        <Form
            labelCol = {{ span: 8}}
            wrapperCol= {{ span: 16}}
        >
            <Form.Item label="Sinh viên">
                <Input disabled value={'Linh'}/>
            </Form.Item>
            <Form.Item label="Giáo viên hướng dẫn">
                <Input disabled value={'Lan'} />
            </Form.Item>
            <Form.Item label="Giáo viên phản biện">
                <Input disabled value={'Liên'} />
            </Form.Item>
            <Form.Item label="Đề tài">
                <Input disabled value={'Quản lý thư viện'}/>
            </Form.Item>
            <Form.Item label="Chủ tịch hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({user_id, profiles})=> ({label: `MGV${profiles.id} - ${profiles.name}`, value: user_id}))}
                    value={'1'}
                />
            </Form.Item>
            <Form.Item label="Ủy viên hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({user_id, profiles})=> ({label: `MGV${profiles.id} - ${profiles.name}`, value: user_id}))}
                    value={'1'}
                />
            </Form.Item>
            <Form.Item label="Thư ký hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({user_id, profiles})=> ({label: `MGV${profiles.id} - ${profiles.name}`, value: user_id}))}
                    value={'1'}
                />
            </Form.Item>
            <Form.Item label="Thời gian">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={defenseCommittee.map(({defense_day, defense_shift, id})=> ({label: `${defense_day} - ${defense_shift}`, value: id}))}
                    value={'1'}
                />
            </Form.Item>
            <Form.Item label="Địa điểm">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({user_id, profiles})=> ({label: `MGV${profiles.id} - ${profiles.name}`, value: user_id}))}
                    value={'1'}
                />
            </Form.Item>
        </Form>
    )
    const {modal: createDefenseModal, toggleModal} = useModal({
        content: defenseModalContent,
        title: 'Thành lập hội đồng bảo vệ KLTN'
    })

    useEffect(()=>{
        if(isOpen != undefined)
            toggleModal(true)
    },[isOpen])
    return (
        <>  
            {createDefenseModal}
        </>
    );
};

export default DefenseEstablishModal;