import React, { useContext, useEffect, useState } from 'react';
import supabase from '../../../../supabaseClient';
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, } from 'antd';
import NotificationContext from '../../../../context/notificationContext';

const GradeManagementModal = ({ isOpen, thesisInfo, refetchData }) => {
    const [gradeGroup, setGradeGroup] = useState({
        president_grade: '',
        secretary_grade: '',
        member_grade: '',
        review_teacher_grade: ''
    })
    const { openNotification } = useContext(NotificationContext);

    const gradeModalContent = (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
        >
            <Form.Item label="Mã sinh viên">
                <Input disabled value={`${thesisInfo.student_code}`} />
            </Form.Item>
            <Form.Item label="Tên sinh viên">
                <Input disabled value={`${thesisInfo.student_name}`} />
            </Form.Item>
            <Form.Item label="Đề tài">
                <Input disabled value={`${thesisInfo.topic_name}`} />
            </Form.Item>
            <Form.Item label="Điểm của CTHĐ">
                <Input value={gradeGroup.president_grade} onChange={(e) => setGradeGroup(prev => ({ ...prev, president_grade: e.target.value }))} />
            </Form.Item>
            <Form.Item label="Điểm của UVHĐ">
                <Input value={gradeGroup.member_grade} onChange={(e) => setGradeGroup(prev => ({ ...prev, member_grade: e.target.value }))} />
            </Form.Item>
            <Form.Item label="Điểm của TKHĐ">
                <Input value={gradeGroup.secretary_grade} onChange={(e) => setGradeGroup(prev => ({ ...prev, secretary_grade: e.target.value }))} />
            </Form.Item>
            <Form.Item label="Điểm của GVPB">
                <Input value={gradeGroup.review_teacher_grade} onChange={(e) => setGradeGroup(prev => ({ ...prev, review_teacher_grade: e.target.value }))} />
            </Form.Item>
        </Form>
    )
    const handleInputScore = async () => {
        const { data, error} = await supabase
        .from('thesis_grades')
        .insert([gradeGroup])
        .select()

        const grade_id = data?.[0]?.id;
        if(!grade_id){
            return openNotification({
                type: 'error',
                message: 'Không thành công'
            })
        }
        
        const {error: error2} = await supabase
        .from('student_theses')
        .update([{thesis_grade_id: grade_id}])
        .eq('id', thesisInfo.thesis_id)

        if (error) {
            return openNotification({
                type: 'error',
                message: 'Cập nhật điểm không thành công'
            })
        }else{
            await refetchData({})
            return openNotification({
                message: 'Cập nhật điểm thành công'
            })
        }
        
    }
    const { modal: createGradeManagementModal, toggleModal } = useModal({
        content: gradeModalContent,
        title: 'Cập nhật điểm bảo luận KLTN',
        handleConfirm: handleInputScore,
        okText: 'Cập nhật'
    })

    useEffect(() => {
        if (isOpen !== undefined)
            toggleModal(true)
    }, [isOpen])
    return (
        <>
            {createGradeManagementModal}
        </>
    );
};

export default GradeManagementModal;