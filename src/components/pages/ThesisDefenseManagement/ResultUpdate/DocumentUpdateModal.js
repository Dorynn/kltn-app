import React, { useContext, useEffect, useRef, useState } from 'react'
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Modal, Radio } from 'antd';
import NotificationContext from '../../../../context/notificationContext';
import { ExclamationCircleFilled, CloudUploadOutlined, FileAddOutlined } from '@ant-design/icons';
import uploadFile from '../../../../helpers/storage/uploadFile';
import useAuth from '../../../../hooks/useSupabase/useAuth';
import supabase from '../../../../supabaseClient';

function DocumentUpdateModal(props) {
    const { refetchData, isOpen, setIsOpen, resultUpdate } = props;
    const { confirm } = Modal;
    const { user } = useAuth();
    const inputRef = useRef();
    const { openNotification } = useContext(NotificationContext);
    const [file, setFile] = useState(null);
    const [radioValue, setRadioValue] = useState('success');
    const [errorStatus, setErrorStatus] = useState(['File tải lên không được để trống', 'Tên file không được chứa tiếng Việt có dấu và ký tự đặc biệt']);

    const fieldUpdateTopic = [
        {
            label: 'Mã sinh viên',
            field: 'student_id',
            type: 'INPUT',
        },
        {
            label: 'Tên sinh viên',
            field: 'student_name',
            type: 'INPUT',
        },
        {
            label: 'Đề tài',
            field: 'topic_name',
            type: 'INPUT',
        },
        {
            label: 'Biên bản bảo vệ',
            field: 'report_url',
            type: 'FILEUPLOAD',
        },
        {
            label: '',
            field: 'topic_description',
            type: 'RADIO_BOX',
        },

    ];
    useEffect(() => {
        if (isOpen) {
            toggleModal(isOpen);
        }
    }, [isOpen])
    const ConfirmModal = (e) => {
        if (errorStatus) {
            return e.preventDefault();
        }
        confirm({
            title: 'Bạn có thực sự muốn cập nhật thông tin này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleUpdateResult()
            },
            onCancel() { },
        });
    };

    const handleOnUpload = event => {
        setFile(event.target.files[0]);
        setErrorStatus(null);
    };
    const handleUpdateResult = async () => {
        const { data, error } = await uploadFile({ file: file, folder: 'defense_report', user: user });
        if (!error) {
            // lưu url vào defense_commmit
            await supabase
                .from('defense_committees')
                .update({
                    report_url: data.path
                })
                .eq('id', resultUpdate.defense_committees_id)
            // nếu hoàn thành -> student_theses = approve
            if (radioValue === 'success') {
                await supabase
                    .from('student_theses')
                    .update({
                        status: 'approved'
                    })
                    .eq('id', resultUpdate.student_thesis_id)
                setIsOpen(false);
                await refetchData({});
                return openNotification({
                    message: `Cập nhật kết quả thành công`
                })
            }
            // nếu yêu cầu chỉnh sủa -> status phase 4 = normal
            if (radioValue === 'editRequest') {
                await supabase
                    .from('thesis_phases')
                    .update({
                        status: 'normal'
                    })
                    .eq('id', resultUpdate.id + 1)
                setIsOpen(false);
                await refetchData({});
                return openNotification({
                    message: `Cập nhật kết quả thành công`
                })
            }
        }
        setIsOpen(false);
        return openNotification({
            message: `Cập nhật kết quả thất bại`
        })
    };
    const handleChangeRadio = (e) => {
        setRadioValue(e.target.value);
    };

    const renderInput = (item) => {
        if (item.type === 'INPUT') {
            return (
                <Input
                    value={item.field === 'student_id' ? `SV${resultUpdate[item.field]}` : resultUpdate[item.field]}
                    disabled
                />
            );
        }
        if (item.type === 'FILEUPLOAD') {
            return (
                <>
                    <Input
                        type="button"
                        value={file?.name}
                        prefix={file?.name ? <FileAddOutlined /> : <></>}
                        suffix={<div>
                            <CloudUploadOutlined onClick={() => inputRef.current.click()} />
                            <input
                                hidden
                                ref={inputRef}
                                type="file"
                                id="inputFile"
                                onChange={(event) => handleOnUpload(event)}
                            ></input>
                        </div>}
                        size='large'
                        className="input-add-file"
                        onClick={() => inputRef.current.click()}
                    />
                    {!file?.name && (
                        <div className="invalid-feedback d-block">
                            <span>{errorStatus[0]}</span>
                            <br></br>
                            <span>{errorStatus[1]}</span>
                        </div>
                    )}
                </>
            );
        }
        if (item.type === 'RADIO_BOX') {
            return (<div className='d-flex justify-content-between'>
                <Radio.Group
                    onChange={handleChangeRadio}
                    defaultValue={radioValue}
                >
                    <Radio value={'editRequest'}>Yêu cầu chỉnh sửa</Radio>
                    <Radio value={'success'}>Hoàn thành</Radio>
                </Radio.Group>
            </div>)
        }
        return <></>;
    };

    const editTopicModalContent = (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            layout="horizontal"
        >
            {fieldUpdateTopic.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: documentUpdate, toggleModal } = useModal({
        content: editTopicModalContent,
        title: 'Cập nhật biên bản',
        handleConfirm: ConfirmModal,
        okText: 'Cập nhật',
        setIsOpen: setIsOpen
    });

    return (
        <div>{documentUpdate}</div>
    )
}

export default DocumentUpdateModal