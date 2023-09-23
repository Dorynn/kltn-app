export const columnConfig = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
    },
    {
        title: 'Mã sinh viên',
        dataIndex: 'student_id',
        key: 'student_id',
        align: 'center',
        expand: true,
    },
    {
        title: 'Tên đề tài',
        dataIndex: 'topic_id',
        key: 'topic_id',
        align: 'center',
    },
    {
        title: 'Số sinh viên',
        dataIndex: 'register_number',
        key: 'register_number',
        align: 'center',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
    },
    {
        title: 'Thao tác',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
    },
];

export const expandConfig = [
    {
        label: 'Mô tả đề tài',
        field: 'topic_description',
        key: 'topic_description',
    },
];