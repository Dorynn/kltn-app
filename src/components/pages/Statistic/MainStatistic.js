import React, {useState} from 'react';
import { Segmented } from 'antd' ;
import StudentStatistic from './StudentStatistic';
import TeacherStatistic from './TeacherStatistic';

const MainStatistic = () => {
    const [value, setValue] = useState('Sinh viên')
    return (
    <>
        <Segmented className='mt-1 mb-1 ms-1  border float-start' style={{}} options={['Sinh viên', 'Giáo viên']} value={value} onChange={setValue} />
        {
            value === 'Sinh viên' ? <StudentStatistic/> : <TeacherStatistic/>
        }

    </>
    );
};

export default MainStatistic;