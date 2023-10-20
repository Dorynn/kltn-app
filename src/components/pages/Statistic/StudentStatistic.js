import React, { useEffect, useState } from 'react';
import supabase from '../../../supabaseClient';
import useSupbaseAction from '../../../hooks/useSupabase/useSupabaseAction';
import { Select, Button, Table } from 'antd';

const StudentStatistic = () => {
    const [selectedDepartment, setSelectedDepartment] = useState([])
    const [major, setMajor] = useState();
    const [semester, setSemester] = useState()
    const [filtered, setFiltered] = useState([])

    const getMajorStatistic = async () => {
        const { data, error } = await supabase
            .from('majors')
            .select(`*, students(*, student_theses(*))`)
        return data
    }

    useEffect(() => {
        getMajorStatistic()
    }, [])

    const filterMajorList = async () => {
        await getMajorStatistic().then((data) => {
            if (selectedDepartment)
                setMajor(data?.filter(item => item?.department_id === selectedDepartment))
            const temp2 = data?.filter(item => item?.department_id === selectedDepartment)
            let temp = []
            if (semester) {
                if (semester.slice(3, 4) == 1) {
                    temp = temp2?.map(item => item?.students?.filter(item => item?.student_theses?.[0]?.created_at?.slice(0, 4) === semester?.slice(9, 13) && item?.student_theses?.[0]?.created_at?.slice(5, 7) >= 1 && item?.student_theses?.[0]?.created_at?.slice(5, 7) <= 3))
                }
                if (semester.slice(3, 4) == 2) {
                    temp = temp2?.map(item => item?.students?.filter(item => item?.student_theses?.[0]?.created_at?.slice(0, 4) === semester?.slice(9, 13) && item?.student_theses?.[0]?.created_at?.slice(5, 7) >= 4 && item?.student_theses?.[0]?.created_at?.slice(5, 7) <= 7))
                }
                if (semester.slice(3, 4) == 3) {
                    temp = temp2?.map(item => item?.students?.filter(item => item?.student_theses?.[0]?.created_at?.slice(0, 4) === semester?.slice(9, 13) && item?.student_theses?.[0]?.created_at?.slice(5, 7) >= 8 && item?.student_theses?.[0]?.created_at?.slice(5, 7) <= 11))
                }
                setFiltered(temp)
            }
        })

    }

    const { data: departmentList, requestAction: refetchData2 } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('departments')
            .select(`*`)
    })


    const { data: semesterList, requestAction: refetchData3 } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('student_theses')
            .select('created_at')
    })

    const dataSource = []
    semesterList?.map(item => {
        const year = item.created_at.slice(0, 4)
        const month = item.created_at.slice(5, 7)
        if (month >= 1 && month <= 3)
            dataSource.push({ label: `Kỳ 1 năm ${year}` })
        if (month >= 4 && month <= 7)
            dataSource.push({ label: `Kỳ 2 năm ${year}` })
        if (month >= 8 && month <= 11)
            dataSource.push({ label: `Kỳ 3 năm ${year}` })
    })
    const semesterList2 = Array.from(new Set(dataSource?.map(item => JSON.stringify({ label: item.label }))))?.map(str => JSON.parse(str))

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            width: '5%',
        },
        {
            title: 'Mã ngành',
            dataIndex: 'major_id',
            width: '10%'
        },
        {
            title: 'Tên ngành',
            dataIndex: 'major_name'
        },
        {
            title: 'Số lượng đăng ký',
            dataIndex: 'register_quantity'
        },
        {
            title: 'Số lượng hoàn thành',
            dataIndex: 'completed_quantity'
        },
        {
            title: 'Tỷ lệ hoàn thành',
            dataIndex: 'completed_percent'
        }
    ]
    
    const data = [];
    major?.map((item, index) => {
        data.push({
            no: index + 1,
            major_id: `MJ${item?.id}`,
            major_name: item.major_name,
            register_quantity: filtered?.[index]?.length,
            completed_quantity: filtered?.[index]?.filter(item => item?.student_theses?.[0]?.status=='approved').length,
            completed_percent: `${filtered?.[index]?.length === 0 ? 0: filtered?.[index]?.filter(item => item?.student_theses?.[0]?.status=='approved').length*100/filtered?.[index]?.length}%`

        })
    })

    return (
        <div>
            <h4 className='title pt-5'>Báo cáo thống kê số lượng sinh viên thực hiện KLTN</h4>
            <Select
                placeholder="Chọn Khoa"
                showSearch
                style={{width: 300}}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={departmentList?.map(({id, department_name}) => ({label: `${department_name}`, value: id }))}
                onChange={(value)=> {
                    setSelectedDepartment(value)
                }}
                value={selectedDepartment}
            />
            <Select
                placeholder="Chọn kỳ"
                showSearch
                style={{width: 200, margin: '0 20px'}}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={semesterList2?.map(({label}) => ({label: label, value: label }))}
                onChange={(value)=> {
                    setSemester(value)
                }}
                value={semester}
            />

            <Button onClick={filterMajorList}>Lọc</Button>
            
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

export default StudentStatistic;