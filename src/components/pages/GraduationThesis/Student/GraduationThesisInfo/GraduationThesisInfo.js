import React, { useState, useEffect } from "react";
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../../supabaseClient';
import { graduationThesisInfo } from "./GraduationThesisInfoconstant";
import flattenObj from "../../../../../helpers/flattenObj";

function GraduationThesisInfo() {
    const user_id = sessionStorage.getItem('user_login');
    const baseStudentInfo = {
        topic_id: 0,
        status: "",
        student_id: 0,
        reviewer_teacher_id: 0,
        thesis_grade_id: null,
        school_year: 0,
        student_class: "",
        user_id: 0,
        major_id: 0,
        name: "",
        university_role: "",
        auth_id: "",
        user_code: "",
        phone: null,
        address: null,
        email: null
    };
    const { data: defenseCommittees } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('defense_committees')
            .select(`
                *,
                student_theses(*, 
                    students(*, profiles(*)),
                    thesis_topics(*, teachers(user_id, profiles(*)))
                ),
                defense_committee_members(*)
            `)
            .eq('student_theses.student_id', user_id)
    });
    
    const { data: teacherInfo } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('teachers')
            .select(`
                *,
                profiles(*)
            `)
    });
    const studentInfo = (Array.isArray(defenseCommittees) &&
        defenseCommittees[0] &&
        defenseCommittees[0].student_theses &&
        flattenObj({ obj: defenseCommittees[0].student_theses })) || baseStudentInfo;
    const getData = (field) => {
        if (Array.isArray(defenseCommittees) && defenseCommittees[0]) {
            const fullData = { ...defenseCommittees[0], ...studentInfo };
            const { defense_committee_members } = defenseCommittees[0];
            if (field === 'student') {
                return `SV${fullData?.student_id} - ${fullData?.student_theses?.students?.profiles?.name}`;
            }
            if (field === 'teacher_id' || field === 'reviewer_teacher_id') {
                const teacher = teacherInfo.find(i => studentInfo[field] === i.user_id);
                return teacher ? `GV${teacher?.profiles?.id} - ${teacher?.profiles?.name}` : '-';
            }
            if (field === 'president' || field === 'commissioner' || field === 'secretary') {
                const teacher = teacherInfo.find(i => defense_committee_members.some(v => i.user_id === v.teacher_id && v.commitee_role === field));
                return teacher ? `GV${teacher?.profiles?.id} - ${teacher?.profiles?.name}` : '-';
            }
            if (field === 'defense_location')
                return `Phòng ${fullData?.defense_location}`
            if (field === 'defense_day')
                return `${fullData?.defense_day} / Ca ${fullData?.defense_shift}`
            return fullData?.[field];
        }
    }
    return (
        <>
            <h4 className='title'>Thông tin bảo vệ khóa luận tốt nghiệp</h4>
            {!defenseCommittees.length > 0 ?
                <div style={{ width: '80%', margin: 'auto', border: '1px solid #000', height: '100%' }}>
                    <div className="row mt-3">
                        {graduationThesisInfo.map(item => (
                            <div className={item.class} key={item.field}>
                                <label className="d-flex col-3">{item.label} :</label>
                                <span className='col-9 text-start'>{getData(item.field)}</span>
                            </div>
                        ))}
                    </div>
                </div> :
                <h4>Bạn chưa có thông tin bảo vệ khóa luận. Vui lòng liên hệ giáo viên hướng dẫn.</h4>
            }
        </>
    );
}

export default GraduationThesisInfo;