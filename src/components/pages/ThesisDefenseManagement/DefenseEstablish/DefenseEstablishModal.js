import React, { useContext, useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';
import NotificationContext from '../../../../context/notificationContext';
import useModal from '../../../../hooks/modal/useModal';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import { Form, Input, Select } from 'antd'

const DefenseEstablishModal = ({ isOpen, thesisInfo }) => {
    const { openNotification } = useContext(NotificationContext);
    const [timeList, setTimeList] = useState();
    const [schedule, setSchedule] = useState();
    const [locationList, setLocationList] = useState();
    const [memberList, setMemberList] = useState();
    const [defenseInfo, setDefenseInfo] = useState({
        commissioner_id: '',
        secretary_id: '',
        president_id: '',
        defense_day: '',
        defense_location: '',
        defense_shift: '',
        defense_day: '',
    })
    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`*, profiles(id, name)`)
    })
    console.log(teachers)
    const getTimeList = async () => {
        const thesis_id = thesisInfo.student_thesis_id;
        const { data, error } = await supabase
            .rpc('get_available_defense_schedules', { thesis_id })
        if (error) {
            console.error(error)
            return;
        }

        const dataSource = data?.filter(item => item.is_available)
        setSchedule(dataSource)
        const time = Array.from(new Set(dataSource?.map(item => JSON.stringify({ schedule_date: item.schedule_date, shift: item.shift })))
        ).map(str => JSON.parse(str))

        console.log(time)

        setTimeList(time)

    }
    // useEffect(() => {
    //     (async () => {
    //         const { data, error } = await supabase.rpc('is_charge_person')
    //         if (error) {
    //             return console.log('=== is_charge_person error ===', error);
    //         }
    //         console.log('=== is_charge_person data ===', data)
    //     })()
    // }, [])
    const getInvolveMember = async () => {
        const thesis_id = thesisInfo.student_thesis_id
        let { data, error } = await supabase
            .rpc('get_thesis_involved_members', {
                thesis_id
            })
        setMemberList(data)
        if (error) console.error(error)
        else console.log(data)

    }
    const handleSelectTime = (value) => {

        console.log('dtasor', schedule)
        const locations = schedule.filter(item => item.schedule_date === timeList[value].schedule_date && item.shift === timeList[value].shift)
        console.log(locations)
        setLocationList(schedule.filter(item => item.schedule_date === timeList[value].schedule_date && item.shift === timeList[value].shift))
        console.log(locationList, locations)
    }
    const defenseModalContent = (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Form.Item label="Sinh viên">
                <Input disabled value={thesisInfo.student_name} />
            </Form.Item>
            <Form.Item label="Giáo viên hướng dẫn">
                <Input disabled value={thesisInfo.instructor_name} />
            </Form.Item>
            <Form.Item label="Giáo viên phản biện">
                <Input disabled value={thesisInfo.reviewer_teacher_name} />
            </Form.Item>
            <Form.Item label="Đề tài">
                <Input disabled value={thesisInfo.topic_name} />
            </Form.Item>
            <Form.Item label="Chủ tịch hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({ user_id, profiles }) => ({ label: `MGV${profiles.id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => setDefenseInfo(prev => ({ ...prev, president_id: value }))}
                    value={defenseInfo.president_id}
                />
            </Form.Item>
            <Form.Item label="Ủy viên hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({ user_id, profiles }) => ({ label: `MGV${user_id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => setDefenseInfo(prev => ({ ...prev, commissioner_id: value }))}
                    value={defenseInfo.commissioner_id}
                />
            </Form.Item>
            <Form.Item label="Thư ký hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({ user_id, profiles }) => ({ label: `MGV${user_id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => setDefenseInfo(prev => ({ ...prev, secretary_id: value }))}
                    value={defenseInfo.secretary_id}
                />
            </Form.Item>
            <Form.Item label="Thời gian">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={timeList?.map((item, index) => ({ label: `${item.schedule_date} / Ca ${item.shift}`, value: index }))}
                    onChange={(value) => {
                        setDefenseInfo(prev => ({
                            ...prev, defense_day: timeList[value].schedule_date,
                            defense_shift: timeList[value].shift
                        }))
                        setLocationList(schedule.filter(item => item.schedule_date === timeList[value].schedule_date && item.shift === timeList[value].shift))

                    }

                    }
                    value={defenseInfo.defense_day || defenseInfo.defense_shift? `${defenseInfo.defense_day} / Ca ${defenseInfo.defense_shift}`:''}
                />
            </Form.Item>
            <Form.Item label="Địa điểm">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={locationList?.map((item, index) => ({ label: `Phong ${item.location}`, value: index }))}
                    onChange={(value) => setDefenseInfo(prev => ({
                        ...prev, defense_location: locationList[value].location,
                    }))}
                    value={defenseInfo.defense_location?`Phong ${defenseInfo.defense_location}`:''}
                />
            </Form.Item>
        </Form>
    )

    const handleEstablishDefense = async () => {
        const { data: data1, error: error1 } = await supabase
            .from('defense_committees')
            .insert([{
                student_thesis_id: thesisInfo.student_thesis_id, defense_day: defenseInfo.defense_day,
                defense_location: defenseInfo.defense_location,
                defense_shift: defenseInfo.defense_shift
            }])
            .select()
        console.log('hehee', data1?.[0]?.id)
        const committeeId = data1?.[0]?.id;
        console.log(committeeId)
        if (!committeeId) {
            return openNotification({
                type: 'error',
                message: 'Không thành công'
            })
        }

        const { data: data2, error: error2 } = await supabase
            .from('defense_committee_members')
            .insert([
                {
                    commitee_id: committeeId,
                    commitee_role: 'president',
                    teacher_id: defenseInfo.president_id
                },
                {
                    commitee_id: committeeId,
                    commitee_role: 'commissioner',
                    teacher_id: defenseInfo.commissioner_id
                },
                {
                    commitee_id: committeeId,
                    commitee_role: 'secretary',
                    teacher_id: defenseInfo.secretary_id
                },
            ])
            .select()
        console.log('hihii', data2)
        getInvolveMember();
        const thesisLog = [];
        memberList.map(item => {
            thesisLog.push({
                defense_shift: defenseInfo.defense_shift,
                defense_day: defenseInfo.defense_day,
                user_id: item,
                thesis_id: thesisInfo.student_thesis_id,
                defense_location: defenseInfo.defense_location
            })
        })

        console.log(thesisLog)
        const { data: data3, error: error3 } = await supabase
            .from('thesis_schedule_log')
            .insert([
                ...thesisLog
            ])

        if (error1 || error2) {
            return openNotification({
                type: 'error',
                message: 'Thành lập hội đồng thất bại'
            })
        }
        if (!error1 && !error2) {
            return openNotification({
                message: 'Thành lập hội đồng thành công'
            })
        }

    }
    const { modal: createDefenseModal, toggleModal } = useModal({
        content: defenseModalContent,
        title: 'Thành lập hội đồng bảo vệ KLTN',
        handleConfirm: handleEstablishDefense

    })


    useEffect(() => {
        if (isOpen != undefined)
            toggleModal(true)
        getTimeList()

        setDefenseInfo({
            commissioner_id: '',
            secretary_id: '',
            president_id: '',
            defense_day: '',
            defense_location: '',
            defense_shift: '',
            defense_day: '',
        })
    }, [isOpen])
    return (
        <>
            {createDefenseModal}
        </>
    );
};

export default DefenseEstablishModal;