export const configInput = [
    {
        key: 1,
        id: 'phase1',
        title: 'Nộp đề cương',
        class: '',
    },
    {
        key: 2,
        id: 'phase2',
        title: 'Nộp báo cáo (Cho giáo viên hướng dẫn)',
        class: '',
    },
    {
        key: 3,
        id: 'phase3',
        title: 'Nộp báo cáo (Cho giáo viên phản biện)',
        class: '',
    },
    {
        key: 4,
        id: 'phase4',
        title: 'Nộp báo cáo cuối cùng (Hội đồng xét duyệt)',
        class: ''
    },
];

export const fieldSubmit = [
    {
        label: 'File tài liệu',
        field: 'limit_register_number',
        type: 'FILEUPLOAD',
    },
    {
        label: 'Nhận xét của giáo viên hướng dẫn',
        field: 'comment',
        type: 'TEXT_AREA',
    },
];