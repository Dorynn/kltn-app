export const fieldAddStudent = [
    {
        label: 'Họ và tên',
        field: 'name',
        type: 'INPUT',
    },
    {
        label: 'Ngành',
        field: 'major_id',
        type: 'SELECT',
    },
    {
        label: 'Khóa',
        field: 'school_year',
        type: 'INPUT',
    },
    {
        label: 'Lớp',
        field: 'student_class',
        type: 'INPUT',
    },
    {
        label: 'Email',
        field: 'email',
        type: 'INPUT',
    },
    {
        label: 'Số điện thoại',
        field: 'phone',
        type: 'INPUT',
    },
    {
        label: 'Địa chỉ',
        field: 'address',
        type: 'INPUT',
    },
];

export const columnConfig = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
    },
    {
        title: 'Mã sinh viên',
        dataIndex: 'student_code',
        key: 'student_code',
        align: 'center',
        expand: true,
    },
    {
        title: 'Họ và tên',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: 'Mã ngành',
        dataIndex: 'major_code',
        key: 'major_code',
        align: 'center',
    },
    {
        title: 'Khóa',
        dataIndex: 'school_year',
        key: 'school_year',
        align: 'center',
    },
];

export const expandConfig = [
    {
        label: 'Mã sinh viên',
        field: 'student_code',
        key: 'student_code',
    },
    {
        label: 'Họ và tên',
        field: 'name',
        key: 'user_name',
    },
    {
        label: 'Lớp',
        field: 'student_class',
        key: 'student_class',
    },
    {
        label: 'Số điện thoại',
        field: 'phone',
        key: 'phone',
    },
    {
        label: 'Tên khoa',
        field: 'major_name',
        key: 'major_name',
    },
    {
        label: 'Email',
        field: 'email',
        key: 'email',
    },
    {
        label: 'Tên ngành',
        field: 'department_name',
        key: 'department_name',
    },
    {
        label: 'Địa chỉ',
        field: 'address',
        key: 'address',
    },
];