import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import DefenseEstablishModal from './DefenseEstablishModal';
import EditDefenseEstablishModal from './EditDefenseEstablishModal';

const DefenseEstablish = () => {
    const [isOpenModal, setOpenModal] = useState();
    const [isOpenEditModal, setOpenEditModal] = useState();
    const [thesisInfo, setThesisInfo] = useState({});
    const { data: reviewList, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
            .from('thesis_phases')
            .select(`
                *, 
                student_theses(
                    *, 
                    defense_committees(*),  
                    teachers(*, profiles(name)), 
                    students(*, profiles(name)), 
                    thesis_topics(
                        *, 
                        teachers(*, profiles(name)))
                    )
            `)
            .eq('phase_order', 3)
            .eq('status', 'approved')
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
            dataIndex: 'instructor_name',
            key: 'instructor_name',
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
                    (record.defense_committee === undefined) ?
                        <Button onClick={() => {
                            setOpenModal(!isOpenModal)
                            setThesisInfo({
                                id: record.id,
                                student_code: record.student_code,
                                student_name: record.student_name,
                                instructor_id: record.instructor_id,
                                instructor_name: record.instructor_name,
                                reviewer_teacher_id: record.reviewer_teacher_id,
                                reviewer_teacher_name: record.reviewer_teacher_name,
                                topic_name: record.topic_name,
                                student_thesis_id: record.student_thesis_id
                            })
                        }
                        }>
                            Thành lập
                        </Button>
                        : <Button onClick={() => {
                            setOpenEditModal(!isOpenEditModal)
                            setThesisInfo({
                                id: record.id,
                                student_code: record.student_code,
                                student_name: record.student_name,
                                instructor_id: record.instructor_id,
                                instructor_name: record.instructor_name,
                                reviewer_teacher_id: record.reviewer_teacher_id,
                                reviewer_teacher_name: record.reviewer_teacher_name,
                                topic_name: record.topic_name,
                                student_thesis_id: record.student_thesis_id
                            })
                        }}>Sửa</Button>
                }
            </>
        }
    ]
    reviewList.map((item, index) => {
        data.push({
            no: index + 1,
            key: item.id,
            id: item.id,
            student_code: `SV${item.student_theses.student_id}`,
            student_name: item.student_theses.students.profiles.name,
            instructor_id: item.student_theses.thesis_topics.teacher_id,
            instructor_name: item.student_theses.thesis_topics.teachers.profiles.name,
            reviewer_teacher_id: item.student_theses.reviewer_teacher_id,
            reviewer_teacher_name: item.student_theses.teachers?.profiles.name,
            topic_name: item.student_theses.thesis_topics.topic_name,
            topic_description: item.student_theses.thesis_topics.topic_description,
            student_thesis_id: item.student_thesis_id,
            defense_committee: item.student_theses.defense_committees?.[0]?.student_thesis_id,
        })
    })
    return (
        <>
            <h4>Thành lập hội đồng bảo vệ KLTN</h4>
            <div className='p-5'>
                <Table
                    columns={columns}
                    dataSource={data}
                    expandable={{
                        expandedRowRender: (record) => (

                            <p style={{
                                margin: '0 0 0 40px',
                            }}>{record.topic_description}</p>
                        )
                    }}
                    bordered
                />
            </div>
            <DefenseEstablishModal thesisInfo={thesisInfo} isOpen={isOpenModal} refetchData={refetchData} />
            <EditDefenseEstablishModal isOpen={isOpenEditModal} thesisInfo={thesisInfo} refetchData={refetchData} />
        </>
    );
};

export default DefenseEstablish;