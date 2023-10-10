import React from 'react'
import { graduationThesisGrades } from './ViewGradesconstant'
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import './style.scss'

function ViewGrades() {
    const user_id = sessionStorage.getItem('user_login');
    const { data: grades } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('student_theses')
            .select(`
                *,
                thesis_grades(*),
                students(user_id, profiles(name, user_code)),
                thesis_topics(topic_name, topic_description)
            `)
            .eq('student_id', user_id)
    })
    const studentInfo = (Array.isArray(grades) && grades[0] && grades[0].students);
    const gradesInfo = (Array.isArray(grades) && grades[0] && grades[0].thesis_grades);
    const thesisTopicInfo = (Array.isArray(grades) && grades[0] && grades[0].thesis_topics);
    const getData = (field) => {
        if (field === 'student') {
            return `${studentInfo?.profiles?.user_code || ''} - ${studentInfo?.profiles?.name || ''}`;
        }
        if (field === 'topic_name' || field === 'topic_description') {
            return thesisTopicInfo[field] || '';
        }
    }
    const renderData = (item) => {
        if (item.type === 'TEXT') {
            return (
                <div className={item.class} key={item.field}>
                    <label className="d-flex col-3">{item.label} :</label>
                    <span className='col-9 text-start'>{getData(item.field)}</span>
                </div>
            );
        }
        if (item.type === 'TABLE') {
            return (
                <div className={item.class} key={item.field}>
                    <table className='table-grades'>
                        <thead>
                            <tr>
                                <td>Tiêu chí</td>
                                <td>Điểm tài liệu</td>
                                <td>Điểm trình bày</td>
                                <td>Điểm sản phẩm</td>
                            </tr>
                        </thead>
                        <tbody className='position-relative'>
                            <tr>
                                <td>Điểm</td>
                                <td>{gradesInfo?.document_grade || ''}</td>
                                <td>{gradesInfo?.product_grade || ''}</td>
                                <td>{gradesInfo?.presentation_grade || ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
        return (<></>);
    };
    return (
        <div>
            <h4 className='title'>Thông tin bảo vệ khóa luận tốt nghiệp</h4>
            {gradesInfo ? <div style={{ width: '80%', margin: 'auto', border: '1px solid #000', height: '100%' }}>
                <div className="row mt-3">
                    {graduationThesisGrades.map(item => renderData(item))}
                </div>
            </div> :
            <h4>Bạn chưa có điểm. Vui lòng liên hệ giáo viên hướng dẫn để cập nhật.</h4>}
        </div>
    )
}

export default ViewGrades;
