import React, {useState, useContext} from 'react';
import { Table, Button } from 'antd';
import TeacherAssignmentModal from './TeacherAssignmentModal';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import AuthContext from '../../../../context/authContext';


const ReviewerTeacherAssignment = () => {
    const [isOpenModal, setOpenModal] = useState();
    const [updateTeacherAssignment, setUpdateTeacherAssignment] = useState({})

    const {data: reviewList, requestAction: refetchData} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
        .from ('thesis_phases')
        .select(`*, student_theses(*, students(*, profiles(name)), thesis_topics(*, teachers(*, profiles(name))))`)
        .eq('phase_order', 2)
        .eq('status', 'done')
    })

    const {data: assignedList} = useSupbaseAction({
        initialData: [],  
        firstLoad: true, defaultAction: async () => await supabase
        .from ('student_theses')
        .select('*')
        .is('reviewer_teacher_id', null)
    })
    const data = []
    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            width: '5%'
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
            width: '10%'
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'student_name',
            key: 'student_name',
            width: '15%'
        },
        {
            title: 'Giáo viên hướng dẫn',
            dataIndex: 'instructor',
            key: 'instructor',
            width: '15%',
        },
        {
            title: 'Tên đề tài',
            dataIndex: 'topic_name',
            key: 'topic_name',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            width: '10%',
            render: (_, record) => <>
            {
                assignedList.includes(record.reviewList) ? <Button>Hoàn thành</Button> :
                <Button onClick={
                    ()=> {
                        setOpenModal(!isOpenModal)
                        setUpdateTeacherAssignment({
                            id: record.id,
                            student_code: record.student_code,
                            student_name: record.student_name,
                            topic_name: record.topic_name,
                            instructor: record.instructor,
                            instructor_id: record.instructor_id,
                            student_thesis_id: record.student_thesis_id
                        })
                    }
                }>
                    Phân công
                </Button>
            }
            </>
        }
    ]
    reviewList.map((item, index) => {
        data.push({
            no: index + 1,
            key: item.id,
            id: item.id,
            student_code: `MSV${item.student_theses.student_id}`,
            student_name: item.student_theses.students.profiles.name,
            instructor: item.student_theses.thesis_topics.teachers.profiles.name,
            instructor_id:item.student_theses.thesis_topics.teacher_id,
            topic_name: item.student_theses.thesis_topics.topic_name,
            topic_description: item.student_theses.thesis_topics.topic_description,
            reviewer_id: item.reviewer_id,
            student_thesis_id: item.student_thesis_id
            
        })
    })
    return (
        <>
            <h4 className='title'>Phân công giáo viên phản biện</h4>
            <div className='p-5'>
                <Table
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <p style={{
                                margin: '0 0 0 40px',
                            }}>
                                { record.topic_description}
                            </p>
                        )
                    }}
                    dataSource={data}
                    bordered
                />
            </div>
            <TeacherAssignmentModal isOpen={isOpenModal} updateTeacherAssignment={updateTeacherAssignment} refetchData={refetchData} />
        </>
    );
};

export default ReviewerTeacherAssignment;