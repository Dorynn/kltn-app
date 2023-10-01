import React, { useContext, useState, useEffect, useRef } from 'react';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Modal, Select } from "antd";
import { fieldSubmit } from './GraduationThesisSubmitconstants';
import { FileAddOutlined, CloudUploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';

function SubmitModal(props) {
    const {
        refetchData,
        isOpen,
        setIsOpen,
        idInput,
        setStatusInputOutline,
        setStatusInputReport,
        setStatusInputFinalReport,
    } = props;
    const inputRef = useRef();
    const { confirm } = Modal;
    const { TextArea } = Input;
    const [fileName, setFileName] = useState('');
    const { openNotification } = useContext(NotificationContext);
    const [title, setTitle] = useState('Nộp đề cương');

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])

    useEffect(() => {
        if (idInput === 'outline') {
            setTitle('Nộp đề cương');
        }
        if (idInput === 'report' || idInput === 'finalReport') {
            setTitle('Nộp báo cáo');
        }
    }, [idInput])


    const handleUploadFile = async () => {
        const { error } = await supabase
            .from('thesis_topics')
        // .insert({ ...newTopic })
        if (!error) {
            await refetchData({})
            setIsOpen(false);
            return openNotification({
                message: 'Create student successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Create student failed',
        })
    };

    const handleUpdateFileUpload = ({ field, value }) => {
    };
    const handleOnUpload = event => {
        setFileName(event.target.files[0].name);
    };
    const ConfirmModal = (id) => {
        confirm({
            title: 'Bạn có thực sự muốn thay đổi đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleUploadFile({ id })
            },
            onCancel() { },
        });
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'FILEUPLOAD') {
            return (
                <>
                    <Input
                        value={fileName}
                        prefix={fileName ? <FileAddOutlined /> : <></>}
                        suffix={<div>
                            <span
                                role="button"
                                onClick={() => inputRef.current.click()}
                            >
                                <CloudUploadOutlined />
                                <input
                                    hidden
                                    ref={inputRef}
                                    type="file"
                                    id="inputFile"
                                    onChange={(event) => handleOnUpload(event)}
                                ></input>
                            </span>
                        </div>}
                        size='large'
                    />
                    {!fileName && (
                        <div className="invalid-feedback d-block">
                            File tải lên không được để trống
                        </div>
                    )}
                </>
            );
        }
        if (item.type === 'TEXT_AREA') {
            return (
                <TextArea
                    // value={newTopic[item.field]}
                    onChange={e => handleUpdateFileUpload({
                        field: item.field,
                        value: e.target.value
                    })}
                    rows={5}
                ></TextArea>
            );
        }
        return <></>;
    };

    const createTopicModalContent = (
        <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="horizontal"
        >
            {fieldSubmit.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewTopic, toggleModal } = useModal({
        content: createTopicModalContent,
        title: title,
        okText: 'Nộp',
        handleConfirm: ConfirmModal,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewTopic}
        </>
    );
};

export default SubmitModal;