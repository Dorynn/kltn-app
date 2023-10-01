
import React, { useContext, useEffect, useState } from 'react';
import { responseCode } from 'utils/constants';
import { Upload } from 'antd';
import { MAX_FILE_SIZE, allowFileType } from './FileUploadConst';
import './FileUpload.Scss';
import NotificationContext from '../../../context/notificationContext';

export function FileUpload(props) {
    const {
        onUploadSuccess,
        defaultSelected,
    } = props;
    const baseData = {
        lastModified: 0,
        lastModifiedDate: null,
        name: "",
        originFileObj: null,
        percent: 0,
        size: 0,
        type: "",
        uid: ""
    };

    const { openNotification } = useContext(NotificationContext);


    const getDefaultSelected = () => (defaultSelected && Array.isArray(defaultSelected)) ? defaultSelected.map(item => ({
        ...baseData,
        name: item.fileName ? item.fileName : item,
        uid: item.fileId ? item.fileId : item
    })) : [];

    const getDefaultUploaded = () => (defaultSelected && Array.isArray(defaultSelected)) ? defaultSelected.map(item => {
        // trường hợp item có đủ thông tin
        if (item.name || item.uid) {
            return {
                ...baseData,
                ...item,
                name: item.name,
                uid: item.uid,
                originFileObj: item ? item.originFileObj : null
            }
        }
        // trường hợp item không đủ thông tin
        return {
            ...baseData,
            name: item,
            uid: item,
            originFileObj: item ? item.originFileObj : null
        }
    }) : [];

    const [filesSelected, setFilesSelected] = useState([]);
    const [fileUploaded, setFileUploaded] = useState([]);

    useEffect(() => {
        setFilesSelected(getDefaultSelected())
        setFileUploaded(getDefaultUploaded())
    }, [defaultSelected])

    // check file đã tồn tại trong danh sách đã upload chưa, nếu đã có thì không upload nữa
    const checkExist = (file) => fileUploaded.some(item => item.originFileObj && item.originFileObj.uid === file.uid);

    // check có file mới để upload không , nếu có mới được upload
    const checkHasNewFile = () => {
        const arr = filesSelected.filter(item => !fileUploaded.some(file => file.originFileObj && file.originFileObj.uid === item.uid));
        return arr.length;
    };

    const handleUploadFile = async () => {
        // check có file mới để upload không , nếu có mới được upload
        if (filesSelected.length && checkHasNewFile()) {
            let newFileUploaded = [...fileUploaded];
            // lặp qua các phần tử trong mảng
            for (let index = 0; index < filesSelected.length; index += 1) {
                // check file đã tồn tại trong danh sách đã upload chưa, nếu đã có thì khoongg upload nữa và check có file size > 0
                if (filesSelected[index].size && !checkExist(filesSelected[index])) {
                    // file quá dung lượng
                    if (filesSelected[index].size > MAX_FILE_SIZE) {
                        return openNotification({ message: `File ${filesSelected[index].name} vượt quá dung lượng cho phép (5Mb)` });
                    }
                    // fie không đúng định dạng
                    if (!allowFileType.includes(filesSelected[index].type)) {
                        return openNotification({ message: `File ${filesSelected[index].name} không đúng định dạng` });;
                    }
                    try {
                        const formData = new FormData();
                        formData.append('file', filesSelected[index].originFileObj);
                        const res = {};
                        if (res && res.data && res.data.code === responseCode.success) {
                            newFileUploaded = [...newFileUploaded, {
                                ...baseData,
                                uid: res.data.data.fileId,
                                name: res.data.data.fileName,
                                originFileObj: filesSelected[index].originFileObj
                            }];
                            openNotification({ message: `Upload file ${filesSelected[index].name} thành công` });
                        }
                        else {
                            openNotification({ message: `Upload file ${filesSelected[index].name} không thành công` });
                        }
                    } catch (error) {
                        openNotification({ message: `Quá trình upload file ${filesSelected[index].name} không thành công, vui lòng thử lại` });
                    }
                }
            };
            setFileUploaded(newFileUploaded);
            onUploadSuccess(newFileUploaded && newFileUploaded.map(item => item.uid));
        }
    };

    // xử lý khi file được chọn thay đổi
    useEffect(() => {
        if (filesSelected.length && filesSelected.some(item => item && item.originFileObj)) {
            handleUploadFile();
        }
    }, [filesSelected]);

    // cập nhật lại file đã được chọn
    const onChangeFile = (files) => setFilesSelected(files.fileList);

    // xử lý khi xóa file
    const handleRemoveFile = (index) => {
        const newFilesSelected = [...filesSelected];
        const newFileUploaded = [...fileUploaded];

        // xóa file đã xóa trong file selected và file uploaded
        newFilesSelected.splice(index, 1);
        newFileUploaded.splice(index, 1);

        setFilesSelected(newFilesSelected);
        setFileUploaded(newFileUploaded);
        // gửi lại file đã được upload lại component cha
        onUploadSuccess(newFileUploaded.map(item => item.uid));
    };

    const isUploadError = (item) => filesSelected.some(file => file.originFileObj?.uid === item.uid) && !fileUploaded.some(file => file.originFileObj?.uid === item.uid)

    return (
        <div className="file-upload row">
            <div className="col-lg-12 d-flex justify-content-between">
                <div className="box-file-selected h-100 d-flex flex-wrap">
                    {filesSelected.map((item, index) => (
                        <span className={isUploadError(item) ? 'file-selected m-1 file-selected-error' : 'file-selected m-1'} key={item.uid}>
                            {item.name}
                            <i className='fe-x-circle ml-2' onClick={() => handleRemoveFile(index)} />
                        </span>
                    ))}
                </div>
                <Upload
                    onChange={onChangeFile}
                    beforeUpload={() => false}
                    // accept=''
                    showUploadList={false}
                    fileList={filesSelected}
                >
                    <button
                        type="button"
                        className="btn ml-3 btn-upload-file"
                    >
                        <i className='fe-upload' />
                        Tải lên
                    </button>
                </Upload>

            </div>
        </div>
    );
}

export default FileUpload;
