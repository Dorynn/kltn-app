import React, { useEffect, useState } from "react";
import useSupbaseAction from "../../../../hooks/useSupabase/useSupabaseAction";
import supabase from "../../../../supabaseClient";
import flattenObj from "../../../../helpers/flattenObj";
import { Select } from "antd";

function GraduationThesesStudentInfo() {
    const graduationThesisInfo = [
        {
            label: 'Sinh viên',
            field: 'student',
            class: 'd-flex mb-2 px-4 pb-3 col-6',
        },
        {
            label: 'Đề tài',
            field: 'topic_name',
            class: 'd-flex mb-2 px-4 pb-3 col-6',
        },
        {
            label: 'Mô tả đề tài',
            field: 'topic_description',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Giáo viên hướng dẫn',
            field: 'teacher_id',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Giáo viên phản biện',
            field: 'reviewer_teacher_id',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Chủ tịch hội đồng',
            field: 'president',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Ủy viên hội đồng',
            field: 'commissioner',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Thư ký hội đồng',
            field: 'secretary',
            class: 'd-flex mb-2 px-4 pb-3 col-12',
        },
        {
            label: 'Thời gian',
            field: 'defense_day',
            class: 'd-flex mb-2 px-4 pb-3 col-6',
        },
        {
            label: 'Địa điểm',
            field: 'defense_location',
            class: 'd-flex mb-2 px-4 pb-3 col-6',
        },
    ];
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
    const [studentId, setStudentId] = useState(null);
    const [defenseCommitte, setDefenseCommitte] = useState([]);

    const { data: students } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('students')
            .select(`
                *,
                profiles(name, id)
            `)
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
    const getDefenseCommitteesByStudent = async (id) => {
        const { data, error } = await supabase
            .from('defense_committees')
            .select(`
                *,
                student_theses(*, 
                    students(*, profiles(*)),
                    thesis_topics(*, teachers(user_id, profiles(*)))
                ),
                defense_committee_members(*)
            `)
            .eq('student_theses.student_id', studentId)
        if (!error) {
            setDefenseCommitte(data)
        }
    }
    useEffect(() => {
        if (studentId) {
            getDefenseCommitteesByStudent(studentId);
        }
    }, [studentId])

    const studentInfo = (Array.isArray(defenseCommitte) &&
        defenseCommitte[0] &&
        defenseCommitte[0].student_theses &&
        flattenObj({ obj: defenseCommitte[0].student_theses })) || baseStudentInfo;
    const getData = (field) => {
        if (Array.isArray(defenseCommitte) && defenseCommitte[0]) {
            const fullData = { ...defenseCommitte[0], ...studentInfo };
            const { defense_committee_members } = defenseCommitte[0];
            if (field === 'student') {
                return `SV${fullData?.student_theses?.student_id} - ${fullData?.student_theses?.students?.profiles?.name}`;
            }
            if (field === 'teacher_id' || field === 'reviewer_teacher_id') {
                const teacher = teacherInfo.find(i => studentInfo[field] === i.user_id);
                return teacher ? `GV${teacher?.profiles?.id} - ${teacher?.profiles?.name}` : '-';
            }
            if (field === 'president' || field === 'commissioner' || field === 'secretary') {
                const teacher = teacherInfo.find(i => defense_committee_members.some(v => i.user_id === v.teacher_id && v.commitee_role === field));
                return teacher ? `GV${teacher?.profiles?.id} - ${teacher?.profiles?.name}` : '-';
            }
            if (field === 'defense_location') {
                return `Phòng ${fullData?.defense_location}`
            }
            if (field === 'defense_day') {
                return `${fullData?.defense_day} / Ca ${fullData?.defense_shift}`
            }

            return fullData?.[field];
        }
    }
    const handleSelectStudent = e => {
        return setStudentId(e);
    }
    return (
        <>
            <h4 className='title'>Thông tin bảo vệ khóa luận tốt nghiệp</h4>
            <div>
                <div className="d-flex justify-content-center align-items-center w-25 m-auto mb-4">
                    <Select
                        className="w-100"
                        placeholder="Chọn sinh viên"
                        options={students.map(({ user_id, profiles }) => ({ label: `SV${profiles.id} - ${profiles.name}`, value: user_id }))}
                        onChange={(e) => handleSelectStudent(e)}
                    ></Select>
                </div>
                {(defenseCommitte.length > 0 && defenseCommitte[0].student_theses !== null) ?
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
                    studentId ?
                        <h4>Sinh viên bạn chọn chưa có thông tin</h4> :
                        <h4>Vui lòng chọn sinh viên để xem thông tin</h4>
                }
            </div>
        </>
    )
};

export default GraduationThesesStudentInfo;