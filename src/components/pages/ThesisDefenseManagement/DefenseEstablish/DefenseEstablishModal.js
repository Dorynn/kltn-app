import React, { useContext, useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';
import NotificationContext from '../../../../context/notificationContext';
import useModal from '../../../../hooks/modal/useModal';
import AuthContext from '../../../../context/authContext';
import { Form, Input, Select } from 'antd'

const DefenseEstablishModal = ({ isOpen, thesisInfo, refetchData }) => {
    const { openNotification } = useContext(NotificationContext);
    const { user } = useContext(AuthContext)
    const [timeList, setTimeList] = useState();
    const [schedule, setSchedule] = useState();
    const [locationList, setLocationList] = useState();
    const [teachers, setTeachers] = useState([]);
    const [defenseInfo, setDefenseInfo] = useState({
        commissioner_id: '',
        secretary_id: '',
        president_id: '',
        defense_day: '',
        defense_location: '',
        defense_shift: '',
        defense_day: '',
    })
    const [ignore, setIgnoreMember] = useState({
        member1: '',
        member2: '',
        member3: ''
    })

    const getTimeList = async () => {
        const thesis_id = thesisInfo.student_thesis_id;
        const { data, error } = await supabase
            .rpc('get_available_defense_schedules', { thesis_id })
        if (error) {
            return;
        }

        const dataSource = data?.filter(item => item.is_available)
        setSchedule(dataSource)
        const time = Array.from(new Set(dataSource?.map(item => JSON.stringify({ schedule_date: item.schedule_date, shift: item.shift })))
        ).map(str => JSON.parse(str))
        setTimeList(time)
    }
    const getTeachers = async () => {
        const { data, error } = await supabase
            .from('teachers')
            .select('user_id, profiles(id, name)')
        setTeachers(data?.filter(item => 
            item?.user_id !== thesisInfo.reviewer_teacher_id &&
            item?.user_id !== thesisInfo.instructor_id
        ))
        return data?.filter(item => item?.user_id !== user?.user_id &&
            item?.user_id !== thesisInfo.reviewer_teacher_id &&
            item?.user_id !== thesisInfo.instructor_id
        )
    }
    const filterTeachers = async () => {
        await getTeachers().then((data) => {
            setTeachers(data.filter(item => item?.user_id !== ignore.member1 &&
                item?.user_id !== ignore.member2 &&
                item?.user_id !== ignore.member3
                ))
        })
    }
    useEffect(() => {
        filterTeachers()
    }, [ignore.member1, ignore.member2, ignore.member3])

    const getInvolveMember = async () => {
        const thesis_id = thesisInfo.student_thesis_id
        let { data, error } = await supabase
            .rpc('get_thesis_involved_members', {
                thesis_id
            })
        return data;
    }
    const defenseModalContent = (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Form.Item label="Sinh viên">
                <Input disabled value={`GV${thesisInfo.student_code} - ${thesisInfo.student_name}`} />
            </Form.Item>
            <Form.Item label="Giáo viên hướng dẫn">
                <Input disabled value={`GV${thesisInfo.instructor_id} - ${thesisInfo.instructor_name}`} />
            </Form.Item>
            <Form.Item label="Giáo viên phản biện">
                <Input disabled value={`GV${thesisInfo.reviewer_teacher_id} - ${thesisInfo.reviewer_teacher_name}`} />
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
                    onChange={(value) => {
                        setDefenseInfo(prev => ({ ...prev, president_id: value }))
                        setIgnoreMember(prev => ({ ...prev, member1: value }))
                    }}
                    value={defenseInfo.president_id}
                />
            </Form.Item>
            <Form.Item label="Ủy viên hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({ user_id, profiles }) => ({ label: `MGV${user_id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => {
                        setDefenseInfo(prev => ({ ...prev, commissioner_id: value }))
                        setIgnoreMember(prev => ({ ...prev, member2: value }))
                    }}
                    value={defenseInfo.commissioner_id}
                />
            </Form.Item>
            <Form.Item label="Thư ký hội đồng">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.map(({ user_id, profiles }) => ({ label: `MGV${user_id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => {
                        setDefenseInfo(prev => ({ ...prev, secretary_id: value }))
                        setIgnoreMember(prev => ({ ...prev, member3: value }))
                    }}
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
                    value={defenseInfo.defense_day || defenseInfo.defense_shift ? `${defenseInfo.defense_day} / Ca ${defenseInfo.defense_shift}` : ''}
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
                    value={defenseInfo.defense_location ? `Phong ${defenseInfo.defense_location}` : ''}
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
        const committeeId = data1?.[0]?.id;
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
        let thesisLog = [];
        await getInvolveMember()
            .then(async (data) => {
                data?.map(item => {
                    thesisLog.push({
                        defense_shift: defenseInfo.defense_shift,
                        defense_day: defenseInfo.defense_day,
                        user_id: item,
                        thesis_id: thesisInfo.student_thesis_id,
                        defense_location: defenseInfo.defense_location
                    })
                })
                const { data: data3, error: error3 } = await supabase
                    .from('thesis_schedule_log')
                    .insert([
                        ...thesisLog
                    ])
                    .select()
            })
        if (error1 || error2) {
            return openNotification({
                type: 'error',
                message: 'Thành lập hội đồng thất bại'
            })
        }
        else {
            await refetchData({})
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
        if (isOpen !== undefined)
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