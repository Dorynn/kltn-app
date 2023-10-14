import React, { useEffect, useState, useContext } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import useModal from '../../../../hooks/modal/useModal';
import supabase from '../../../../supabaseClient';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import NotificationContext from '../../../../context/notificationContext';
import AuthContext from '../../../../context/authContext';

const TeacherAssignmentModal = ({ isOpen, updateTeacherAssignment, refetchData }) => {
    const [reviewerTeacher, setReviewerTeacher] = useState('')
    const { openNotification } = useContext(NotificationContext)
    const [currentThesis, setCurrentThesis] = useState()
    const { user } = useContext(AuthContext)

    const { data: teachers } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('teachers')
            .select(`*, profiles(id, name)`)
    })

    const teacherAssignmentModalContent = (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="Sinh viên">
                <Input disabled value={`${updateTeacherAssignment.student_code} - ${updateTeacherAssignment.student_name}`} />
            </Form.Item>
            <Form.Item label="Giáo viên hướng dẫn">
                <Input disabled value={`MGV${updateTeacherAssignment.instructor_id} - ${updateTeacherAssignment.instructor}`} />
            </Form.Item>
            <Form.Item label="Tên đề tài">
                <Input value={updateTeacherAssignment.topic_name} disabled />
            </Form.Item>
            <Form.Item label="Giáo viên phản biện">
                <Select
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={teachers.filter(item => item.user_id != updateTeacherAssignment.instructor_id && item.user_id != user.user_id).map(({ profiles, user_id }) => ({ label: `MGV${profiles.id} - ${profiles.name}`, value: user_id }))}
                    onChange={(value) => setReviewerTeacher(value)}
                    value={reviewerTeacher}
                />
            </Form.Item>
        </Form>
    )

    const confirmTeacherAssignment = async () => {
        const { error} = await supabase
            .from('student_theses')
            .update({ reviewer_teacher_id: reviewerTeacher })
            .eq('id', updateTeacherAssignment.student_thesis_id)

        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Assign reviewer teacher successfully!'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Assign reviewer teacher failed!'
        })
    }
    const { modal: createTeacherAssignmentModal, toggleModal } = useModal({
        content: teacherAssignmentModalContent,
        title: 'Phân công giáo viên phản biện',
        handleConfirm: confirmTeacherAssignment
    })
    const getRegisteredTopic = async () => {
        const { data, error } = await supabase
            .from('thesis_phases')
            .select(`*`)
            .eq('phase_order', 3)
            .eq('student_thesis_id', updateTeacherAssignment.student_thesis_id)
        setCurrentThesis(data)
    }
    // console.log(...currentThesis)
    // useEffect(() => {
    //     getRegisteredTopic()
    // }, [])
    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true);
        getRegisteredTopic()
    }, [isOpen])
    return (
        <>
            {createTeacherAssignmentModal}
        </>
    );
};

export default TeacherAssignmentModal;