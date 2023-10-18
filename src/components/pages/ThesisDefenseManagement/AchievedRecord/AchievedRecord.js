import React from 'react';
import supabase from '../../../../supabaseClient';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';

const AchievedRecord = () => {
    const { data: recordList, requestAction: refetchData} = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
        .from('student_theses')
        .select('student_id, status, students(profiles(name)), thesis_topics(topic_name), defense_committees(report_url)')
        .eq('status', 'approved')
    })
    console.log(recordList)
    return (
        <div>
            Lưu trữ hồ sơ
        </div>
    );
};

export default AchievedRecord;