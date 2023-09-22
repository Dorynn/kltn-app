export const columnConfig = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
    },
    {
        title: 'Mã sinh viên',
        dataIndex: 'suggested_student_id',
        key: 'suggested_student_id',
        align: 'center',
        expand: true,
    },
    {
        title: 'Tên đề tài',
        dataIndex: 'topic_name',
        key: 'topic_name',
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