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
    {
        title: 'Thao tác',
        dataIndex: 'action',
        key: 'action',
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

export const fieldAddTopic = [
    {
        label: 'Tên đề tài',
        field: 'topic_name',
        type: 'INPUT',
    },
    {
        label: 'Giới hạn',
        field: 'limit_register_number',
        type: 'SELECT',
    },
    {
        label: 'Mô tả đề tài',
        field: 'topic_description',
        type: 'TEXT_AREA',
    },
];

export const fieldUpdateTopic = [
    {
        label: 'Tên đề tài',
        field: 'topic_name',
        type: 'INPUT',
    },
    {
        label: 'Giới hạn',
        field: 'limit_register_number',
        type: 'SELECT',
    },
    {
        label: 'Mô tả đề tài',
        field: 'topic_description',
        type: 'TEXT_AREA',
    },
];

export const optionLimitStudent = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
    {
        value: 3,
        label: 3,
    },
    {
        value: 4,
        label: 4,
    },
    {
        value: 5,
        label: 5,
    },
];