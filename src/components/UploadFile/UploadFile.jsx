import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

const App = ({ action, headers, onChange, title, validTypes = '*', showUploadList = true, fileList = [], setFileList = () => { }, customRequest }) => {

    const beforeUpload = (file) => {
        const isValidType = validTypes === '*' || validTypes.includes(file.type);
        if (!isValidType) {
            console.error('You can only upload JPG/PNG file!');
        }
        return isValidType
    };
    return (
        <Upload action={action} headers={headers} onChange={onChange} beforeUpload={beforeUpload} customRequest={customRequest} showUploadList={showUploadList}>
            <Button icon={<UploadOutlined />}>{title}</Button>
        </Upload>
    )
};

export default App;