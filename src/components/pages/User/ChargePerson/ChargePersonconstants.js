export const fieldAddChargePerson = [
    {
        label: 'Mã người phụ trách',
        field: 'chargePerson_code',
        type: 'INPUT',
    },
    {
        label: 'Họ và tên',
        field: 'chargePerson_name',
        type: 'INPUT',
    },
    {
        label: 'Mã khoa',
        field: 'department_code',
        type: 'SELECT',
    },
    {
        label: 'Số điện thoại',
        field: 'phoneNumber',
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
        dataIndex: 'chargePerson_code',
        key: 'chargePerson_code',
        align: 'center',
    },
    {
        title: 'Họ và tên',
        dataIndex: 'chargePerson_name',
        key: 'chargePerson_name',
        align: 'center',
    },
    {
        title: 'Mã khoa',
        dataIndex: 'department_code',
        key: 'department_code',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    },
];
export const data = [
    {
        key: 1,
        chargePerson_code: 32,
        chargePerson_name: 'John Brown',
        department_code: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
        key: 2,
        chargePerson_code: 42,
        chargePerson_name: 'Jim Green',
        department_code: 'London No. 1 Lake Park',
        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
        key: 3,
        chargePerson_code: 29,
        chargePerson_name: 'Not Expandable',
        department_code: 'Jiangsu No. 1 Lake Park',
        description: 'This not expandable',
    },
    {
        key: 4,
        chargePerson_code: 32,
        chargePerson_name: 'Joe Black',
        department_code: 'Sydney No. 1 Lake Park',
        description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
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