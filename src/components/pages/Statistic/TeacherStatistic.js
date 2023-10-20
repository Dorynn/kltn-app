import React, { useEffect, useState } from 'react';
import supabase from '../../../supabaseClient';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import { Select, Button, Table } from 'antd';


const TeacherStatistic = () => {
    const [selectedDepartment, setSelectedDepartment] = useState([])
    const [year, setYear] = useState()
    const [teacherStatistic, setTeacherStatistic] = useState()
    const [studentQuantity, setStudentQuantity] = useState([{
        semester1: '',
        semester2: '',
        semester3: '',
    }])

    const { data: departmentList, requestAction: refetchData2 } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('departments')
            .select(`*`)
    })
    const getTeacherStatistic = async () => {
        const { data, error } = await supabase
            .from('teachers')
            .select('*, thesis_topics(teacher_id, register_number, created_at), majors(id, department_id), profiles(name)')
        return data
    }
    const { data: timeList, requestAction: refetchData5 } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('thesis_topics')
            .select('*')
    })
    let yearList = new Set()
    timeList?.map(item => {
        yearList.add(item?.created_at?.slice(0, 4))
    })
    const filterTeacherStatistic = () => {
        console.log(selectedDepartment, year)
        getTeacherStatistic().then(data => {
            setTeacherStatistic(data?.filter(item =>
                item.majors.department_id === selectedDepartment
            ))

            const temp = data?.filter(item =>
                item.majors.department_id === selectedDepartment
            )

            const temp1 = temp?.map(item => item?.thesis_topics?.filter(item => item?.created_at?.slice(0, 4) == year && item?.created_at?.slice(5, 7) >= 1 && item?.created_at?.slice(5, 7) <= 3)).map(item => item?.reduce((total, num) => {
                return total + num.register_number;
            }, 0))
            const temp2 = temp?.map(item => item?.thesis_topics?.filter(item => item?.created_at?.slice(0, 4) == year && item?.created_at?.slice(5, 7) >= 4 && item?.created_at?.slice(5, 7) <= 7)).map(item => item?.reduce((total, num) => {
                return total + num.register_number;
            }, 0))
            const temp3 = temp?.map(item => item?.thesis_topics?.filter(item => item?.created_at?.slice(0, 4) == year && item?.created_at?.slice(5, 7) >= 8 && item?.created_at?.slice(5, 7) <= 11)).map(item => item?.reduce((total, num) => {
                return total + num.register_number;
            }, 0))
            setStudentQuantity({ semester1: temp1, semester2: temp2, semester3: temp3 })
        })
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            width: '5%'
        },
        {
            title: 'Mã giáo viên',
            dataIndex: 'teacher_id',
            width: '10%'
        },
        {
            title: 'Tên giáo viên',
            dataIndex: 'teacher_name',
        },
        {
            title: 'Kỳ 1',
            dataIndex: 'semester1'
        },
        {
            title: 'Kỳ 2',
            dataIndex: 'semester2'
        },
        {
            title: 'Kỳ 3',
            dataIndex: 'semester3'
        },
        {
            title: 'Tổng số lượng',
            dataIndex: 'total'
        }
    ]

    const data = [];
    teacherStatistic?.map((item, index) => {
        data.push({
            no: index + 1,
            teacher_id: `GV${item.user_id}`,
            teacher_name: item?.profiles?.name,
            semester1: studentQuantity.semester1[index],
            semester2: studentQuantity.semester2[index],
            semester3: studentQuantity.semester3[index],
            total: studentQuantity.semester1[index] + studentQuantity.semester2[index] + studentQuantity.semester3[index]
        })
    })

    return (
        <div>
            <h4 className='title pt-5'>Báo cáo thống kê số lượng sinh viên hướng dẫn KLTN</h4>
            <Select
                placeholder="Chọn Khoa"
                showSearch
                style={{ width: 300 }}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={departmentList?.map(({ id, department_name }) => ({ label: `${department_name}`, value: id }))}
                onChange={(value) => {
                    setSelectedDepartment(value)
                }}
                value={selectedDepartment}
            />
            <Select
                placeholder="Chọn Năm"
                showSearch
                style={{ width: 150, margin: '0 20px' }}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={Array.from(yearList).map(item => ({ label: item, value: item }))}
                onChange={(value) => {
                    setYear(value)
                }}
                value={year}
            />
            <Button onClick={filterTeacherStatistic}>Lọc</Button>
           
            <div className='p-5'>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                />
            </div>
        </div>
    );
};

export default TeacherStatistic;