import React, {useState} from 'react';
import { Table, Button } from 'antd';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';
import DefenseEstablishModal from './DefenseEstablishModal';

const DefenseEstablish = () => {
    const [isOpenModal, setOpenModal] = useState()
    const {data: reviewList, requestAction: refetchData} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
        .from ('thesis_phases')
        .select(`*, student_theses(*, students(*, profiles(name)), thesis_topics(*, teachers(*, profiles(name))))`)
        // .eq('phase_order', 3)
    })
    const data=[]
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
                <Button onClick={()=>{
                    setOpenModal(!isOpenModal)
                }}>
                    Thành lập
                </Button>
            </>
        }
    ]
    reviewList.map((item, index)=> {
        data.push({
            no: index + 1,
            key: item.id,
            id: item.id,
            student_code: `MSV${item.student_theses.student_id}`,
            student_name: item.student_theses.students.profiles.name,
            instructor: item.student_theses.thesis_topics.teachers.profiles.name,
            instructor_id: item.student_theses.thesis_topics.teacher_id,
            topic_name: item.student_theses.thesis_topics.topic_name,
            topic_description: item.student_theses.thesis_topics.topic_description,     
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
                            }}>hihi</p>
                        )
                    }}
                />
            </div>
            <DefenseEstablishModal isOpen={isOpenModal}/>
        </>
    );
};

export default DefenseEstablish;