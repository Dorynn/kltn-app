export const fieldAddLecturer = [
    {
        label: 'Họ và tên',
        field: 'name',
        type: 'INPUT',
    },
    {
        label: 'Mã ngành',
        field: 'major_id',
        type: 'SELECT',
    },
    {
        label: 'Số điện thoại',
        field: 'phone',
        type: 'INPUT',
    },
    {
        label: 'Email',
        field: 'email',
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
        title: 'Mã giáo viên',
        dataIndex: 'user_id',
        key: 'user_id',
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
        title: 'Tên ngành',
        dataIndex: 'major_name',
        key: 'major_name',
        align: 'center',
    },
    {
        title: 'Tên khoa',
        dataIndex: 'department_name',
        key: 'department_name',
        align: 'center',
    },
];

export const expandConfig = [
    {
        label: 'Mã giáo viên',
        field: 'user_id',
        key: 'user_id',
    },
    {
        label: 'Họ và tên',
        field: 'name',
        key: 'name',
    },
    {
        label: 'Tên ngành',
        field: 'major_code',
        key: 'major_code',
    },
    {
        label: 'Email',
        field: 'email',
        key: 'email',
    },
    {
        label: 'Tên khoa',
        field: 'department_name',
        key: 'department_name',
    },
    {
        label: 'Số điện thoại',
        field: 'phone',
        key: 'phone',
    },
    {
        label: 'Địa chỉ',
        field: 'address',
        key: 'address',
    },
];