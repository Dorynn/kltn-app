import React from 'react';
import useSupbaseAction from '../../../../hooks/useSupabase/useSupabaseAction';
import supabase from '../../../../supabaseClient';


const ResultUpdate = () => {
    const { data: reviewList, requestAction: refetchData} = useSupbaseAction({
        initialData: [],
        firstLoad: true, defaultAction: async () => await supabase
            .from('thesis_phases')
            .select(`*, 
                    student_theses(student_id, 
                                students(profiles(name)), 
                                thesis_topics(topic_name),
                                defense_committees(*)
                                )`
                    )
            .eq('phase_order', 3)
            .eq('status', 'approved')
    })
    console.log(reviewList)


    return (
        <div>
            Cập nhật kết quả
        </div>
    );
};

export default ResultUpdate;