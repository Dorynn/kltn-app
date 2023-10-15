import React, { useContext, useState, useEffect, useRef } from 'react';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Modal } from "antd";
import { fieldSubmit } from './GraduationThesisSubmitconstants';
import { FileAddOutlined, CloudUploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import uploadFile from '../../../../../helpers/storage/uploadFile'
import './style.scss';
import useAuth from '../../../../../hooks/useSupabase/useAuth';

function SubmitModal(props) {
    const {
        isOpen,
        setIsOpen,
        idInput,
        setStatusInput,
        valueThesisPhase,
        refetchData,
    } = props;
    const inputRef = useRef();
    const { user } = useAuth();
    const { confirm } = Modal;
    const { TextArea } = Input;
    const { openNotification } = useContext(NotificationContext);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('Nộp đề cương');

    const fieldSubmit = [
        {
            label: 'File tài liệu',
            field: 'limit_register_number',
            type: 'FILEUPLOAD',
        },
        {
            label: 'Nhận xét của giáo viên hướng dẫn',
            field: 'topic_description',
            type: 'TEXT_AREA',
        },
    ];

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])

    useEffect(() => {
        if (idInput === 'phase1') {
            setTitle('Nộp đề cương');
        }
        if (idInput === 'phase2' || idInput === 'phase3') {
            setTitle('Nộp báo cáo');
        }
        if (idInput === 'phase4') {
            setTitle('Nộp báo cáo cuối');
        }
    }, [idInput])

    useEffect(() => {
        if (valueThesisPhase && valueThesisPhase.status !== 'pending') {
            const {data} = supabase
            .from('thesis_phases')
            .select(`*, `)
            .eq('id', valueThesisPhase.id)
        }
    }, [valueThesisPhase]);

    const checkFirstSubmit = () => (valueThesisPhase && valueThesisPhase.status === 'pending');

    const handleUploadFile = async () => {
        const { data, error } = await uploadFile({ file: file, folder: 'assignments', user: user });
        if (!error) {
            setIsOpen(false);
            setStatusInput(prev => ({
                ...prev,
                [idInput]: 'normal',
            }));
            await supabase
                .from('thesis_phases')
                .update({
                    status: 'normal',
                })
                .eq('id', valueThesisPhase.id)
            await supabase
                .from('submit_assignments')
                .insert({
                    submit_url: data.path,
                    phase_id: valueThesisPhase.id
                })
            await refetchData({});
            return openNotification({
                message: `${title} thành công`
            })
        }
        return openNotification({
            type: 'error',
            message: `${title} thất bại`,
        })
    };

    const handleUpdateFileUpload = ({ field, value }) => {
    };
    const handleOnUpload = event => {
        setFile(event.target.files[0]);
    };
    const ConfirmModal = (id) => {
        confirm({
            title: 'Bạn có thực sự muốn nộp tài liệu này?',
            icon: <ExclamationCircleFilled />,
            content: 'Tài liệu sẽ gửi lên hệ thống sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleUploadFile({ id })
            },
            onCancel() { },
        });
    };
    // console.log('valueThesisPhase', valueThesisPhase);
    const checkDisabled = () => (valueThesisPhase.status === 'approved');
    console.log(valueThesisPhase.status === 'approved');

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'FILEUPLOAD') {
            return (
                <>
                    <Input
                        type="button"
                        value={file?.name}
                        prefix={file?.name ? <FileAddOutlined /> : <></>}
                        suffix={<div>
                            <CloudUploadOutlined />
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
                        disabled={checkDisabled()}
                    />
                    {!file?.name && (
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
                    disabled={() => checkDisabled()}
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
            {checkFirstSubmit() ?
                fieldSubmit
                    .splice(0, 1)
                    .map(item => (
                        <Form.Item label={item.label} key={item.field}>
                            {renderInput(item)}
                        </Form.Item>)) :
                fieldSubmit.map(item => (
                    <Form.Item label={item.label} key={item.field}>
                        {renderInput(item)}
                    </Form.Item>))
            }
        </Form>
    );

    const { modal: createNewTopic, toggleModal } = useModal({
        content: createTopicModalContent,
        title: title,
        okText: 'Duyệt',
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