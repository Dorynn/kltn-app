export const columnConfig= [
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
        dataIndex: 'topic_name',
        key: 'topic_name',
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

export const fieldViewDetail = [
    {
        label: 'Tài liệu',
        field: 'limit_register_number',
        type: 'FILEUPLOAD',
    },
    {
        label: 'Nhận xét của giáo viên hướng dẫn',
        field: 'topic_description',
        type: 'TEXT_AREA',
    },
];