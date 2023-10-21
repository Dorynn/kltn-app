import React from 'react'
import { graduationThesisGrades } from './ViewGradesconstant'
import supabase from '../../../../../supabaseClient';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import './style.scss'

function ViewGrades() {
    const user_id = sessionStorage.getItem('user_login');
    const baseStudentInfo = {
        user_id: '',
        profiles: {
            name: ''
        }
    };
    const baseGradesInfo = {
        president_grade: null,
        secretary_grade: null,
        member_grade: null,
        review_teacher_grade: null,
    };
    const baseThesisTopicInfo = {
        topic_name: '',
        topic_description: ''
    };
    const { data: grades } = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => supabase
            .from('student_theses')
            .select(`
                *,
                thesis_grades(*),
                students(user_id, profiles(name)),
                thesis_topics(topic_name, topic_description)
            `)
            .eq('student_id', user_id)
    })
    const studentInfo = (Array.isArray(grades) && grades[0] && grades[0].students) || baseStudentInfo;
    const gradesInfo = (Array.isArray(grades) && grades[0] && grades[0].thesis_grades) || baseGradesInfo;
    const thesisTopicInfo = (Array.isArray(grades) && grades[0] && grades[0].thesis_topics) || baseThesisTopicInfo;
    const getData = (field) => {
        const { 
            president_grade, 
            secretary_grade,
            member_grade,
            review_teacher_grade,
        } = gradesInfo && gradesInfo;
        const mediumGrades = (president_grade + secretary_grade + member_grade + review_teacher_grade) / 4 || null;
        if (field === 'student') {
            return `SV${studentInfo?.user_id || ''} - ${studentInfo?.profiles?.name || ''}`;
        }
        if (field === 'topic_name' || field === 'topic_description') {
            return thesisTopicInfo[field] || '';
        }
        if (field === 'medium_grades') {
            return mediumGrades ? mediumGrades : 'Bạn chưa có điểm'
        }
        if (field === 'result_evaluation') {
            console.log('mediumGrades', mediumGrades);
            if (0 < mediumGrades && mediumGrades <= 4) {
                return 'Yếu'
            }
            if (4 < mediumGrades && mediumGrades < 7) {
                return 'Trung bình'
            }
            if (7 <= mediumGrades && mediumGrades < 8) {
                return 'Khá'
            }
            if (8 <= mediumGrades && mediumGrades <9) {
                return 'Giỏi'
            }
            if (mediumGrades > 9) {
                return 'Xuất sắc'
            }
            return 'Chưa có đánh giá';
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
            {grades ? <div style={{ width: '80%', margin: 'auto', border: '1px solid #000', height: '100%' }}>
                <div className="row mt-3">
                    {graduationThesisGrades.map(item => renderData(item))}
                </div>
            </div> :
                <h4>Bạn chưa có điểm. Vui lòng liên hệ giáo viên hướng dẫn để cập nhật.</h4>}
        </div>
    )
}

export default ViewGrades;
