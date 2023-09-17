export const fieldAddChargePerson = [
    {
        label: 'Mã người phụ trách',
        field: 'user_code',
        type: 'INPUT',
    },
    {
        label: 'Họ và tên',
        field: 'name',
        type: 'INPUT',
    },
    {
        label: 'Mã khoa',
        field: 'department_id',
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
        title: 'Mã người phụ trách',
        dataIndex: 'user_code',
        key: 'user_code',
        align: 'center',
    },
    {
        title: 'Họ và tên',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
    },
    {
        title: 'Mã khoa',
        dataIndex: 'department_code',
        key: 'department_id',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    },
];

export const options = [
    {
        value: 'jack',
        label: 'Jack',
    },
    {
        value: 'lucy',
        label: 'Lucy',
    },
    {
        value: 'Yiminghe',
        label: 'yiminghe',
    },
];