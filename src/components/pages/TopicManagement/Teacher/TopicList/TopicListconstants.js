export const columnConfigAdmin = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
    },
    {
        title: 'Mã đề tài',
        dataIndex: 'topic_code',
        key: 'topic_code',
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
        title: 'Người hướng dẫn',
        dataIndex: 'teacher_id',
        key: 'teacher_id',
        align: 'center',
    },
];

export const columnConfigTeacher = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
    },
    {
        title: 'Mã đề tài',
        dataIndex: 'topic_code',
        key: 'topic_code',
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
];

export const expandConfig = [
    {
        label: 'Mô tả đề tài',
        field: 'topic_description',
        key: 'topic_description',
    },
];