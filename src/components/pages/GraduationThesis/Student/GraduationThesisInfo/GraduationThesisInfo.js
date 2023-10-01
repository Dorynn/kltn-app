import React, { useState, useEffect } from "react";
import { Input } from "antd";
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../../supabaseClient';

function GraduationThesisInfo() {
    const { TextArea } = Input;
    const [height, setHeight] = useState(0);
    const user_id = sessionStorage.getItem('user_login');

    useEffect(() => {
        setHeight(window.innerHeight);
    }, [])

    const { data: student } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('students')
            .select(`
                *,
                student_theses(*, thesis_topics(*))
            `)
            .eq('user_id', user_id)
    });
    const getDescription = () => {
        const result = Array.isArray(student) && student.map(item => {
            const recurse = (obj) => {
                if (obj.topic_description) {
                    return obj.topic_description;
                }
                if (obj.student_theses) {
                    return obj.student_theses.map(recurse);
                }
                if (obj.thesis_topics) {
                    return recurse(obj.thesis_topics);
                }
            }

            return recurse(item);
        })
        return result.length > 0 ? result[0] : '';
    }
    getDescription()
    return (
        <>
            <h4 className='title'>Khóa luận tốt nghiệp</h4>
            <div style={{ width: '80%', margin: 'auto' }}>
                <div className='d-flex justify-content-start mb-2'>Mô tả</div>
                <div>
                    <TextArea
                        style={{ height }}
                        value={getDescription() || ''}
                    ></TextArea>
                </div>
            </div>
        </>
    )
}

export default GraduationThesisInfo;