import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import GradeManagementModal from './GradeManagementModal';

const GradeManagement = () => {
    const [isOpenModal, setOpenModal] = useState();
    const [thesisInfo, setThesisInfo] = useState({});

    const { data: reviewList, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
            .from('thesis_phases')
            .select(`*, student_theses(*, students(profiles(name)), thesis_grades(*), thesis_topics(*))`)
            .eq('phase_order', 3)
            .eq('status', 'approved')
    })

    const data = []
    const column = [
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
            width: '20%'
        },
        {
            title: 'Tên đề tài',
            dataIndex: 'topic_name',
            key: 'topic_name'
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_, record) => <>
                {
                    (record.grade_id === null) ? <Button onClick={() => {
                        setOpenModal(!isOpenModal)
                        setThesisInfo({
                            student_code: record.student_code,
                            student_name: record.student_name,
                            topic_name: record.topic_name,
                            thesis_id: record.thesis_id
                        })
                    }}>Cập nhật</Button>
                        : <Button>Hoàn thành</Button>
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
            topic_name: item.student_theses.thesis_topics.topic_name,
            thesis_id: item.student_theses.id,
            grade_id: item.student_theses.thesis_grade_id,
            president_grade: item.student_theses.thesis_grades?.president_grade,
            secretary_grade: item.student_theses.thesis_grades?.secretary_grade,
            member_grade: item.student_theses.thesis_grades?.member_grade,
            review_teacher_grade: item.student_theses.thesis_grades?.review_teacher_grade

        })
    })
    return (
        <>
            <h4>Danh sách sinh viên chờ nhập điểm KLTN</h4>
            <div className='p-5'>
                <Table
                    columns={column}
                    dataSource={data}
                    bordered
                    expandable={{
                        expandedRowRender: (record) => (
                            <div style={{margin: '0 0 0 40px'}}>
                                <p>Điểm của CTHĐ: {record?.president_grade}</p>
                                <p>Điểm của UVHĐ: {record?.member_grade}</p>
                                <p>Điểm của TKHĐ: {record?.secretary_grade}</p>
                                <p>Điểm của GVPB: {record?.review_teacher_grade}</p>
                                <p>Trung bình: {(record?.review_teacher_grade + record?.secretary_grade + record?.member_grade + record?.president_grade)/4.0}</p>
                            </div>
                        )
                    }}      
                />
            </div>
            <GradeManagementModal isOpen={isOpenModal} thesisInfo={thesisInfo} refetchData={refetchData} />
        </>

    );
};

export default GradeManagement;