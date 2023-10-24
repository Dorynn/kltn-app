import React, { useContext, useState, useEffect, useRef } from 'react';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Modal } from "antd";
import { FileAddOutlined, CloudUploadOutlined, ExclamationCircleFilled, CloudDownloadOutlined } from '@ant-design/icons';
import uploadFile from '../../../../../helpers/storage/uploadFile'
import './style.scss';
import useAuth from '../../../../../hooks/useSupabase/useAuth';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import downloadFile from '../../../../../helpers/storage/downloadFile';

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
    const [commentTeacher, setCommentTeacher] = useState('');
    const fieldSubmit = [
        {
            label: 'File tài liệu',
            field: 'file',
            type: 'FILEUPLOAD',
        },
    ];
    const fieldSubmitAndComment = [
        {
            label: 'File tài liệu',
            field: 'file',
            type: 'FILEUPLOAD',
        },
        {
            label: 'Nhận xét của giáo viên hướng dẫn',
            field: 'comment',
            type: 'TEXT_AREA',
        },
    ];

    const { data: dataPhase } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('submit_assignments')
            .select(`
                submit_url, phase_id,
                thesis_phases(comment, phase_order)
            `)
            .eq('phase_id', valueThesisPhase?.id)
    });
    const comment = (dataPhase && dataPhase.length > 0 && dataPhase[0] && dataPhase[0]?.thesis_phases?.comment) || { comment: '' };
    const urlFile = (dataPhase && dataPhase.length > 0 && dataPhase[0] && dataPhase[0].submit_url) || '';
    const fileName = urlFile && urlFile.split('/')[1];
    const phaseOrder = (dataPhase && dataPhase.length > 0 && dataPhase[0] && dataPhase[0]?.thesis_phases?.phase_order) || '';

    useEffect(() => {
        if (dataPhase) {
            setCommentTeacher(comment);
            setFile({
                ...file,
                name: fileName
            });
        }
    }, [dataPhase])
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

    const checkFirstSubmit = () => (
        valueThesisPhase &&
        (valueThesisPhase?.status === 'normal' &&
        !valueThesisPhase?.comment)
    );

    const handleUploadFile = async () => {
        const { data, error } = await uploadFile({ file: file, folder: 'assignments', user: user });
        if (!error) {
            setStatusInput(prev => ({
                ...prev,
                [idInput]: 'pending',
            }));
            await supabase
                .from('thesis_phases')
                .update({
                    status: 'pending',
                })
                .eq('id', valueThesisPhase.id)
                .select()
            if (valueThesisPhase?.comment) {
                await supabase
                    .from('submit_assignments')
                    .update({
                        submit_url: data.path,
                        phase_id: valueThesisPhase.id
                    })
                    .eq('id', valueThesisPhase.id)
                    .select()
            } else {
                await supabase
                    .from('submit_assignments')
                    .insert({
                        submit_url: data.path,
                        phase_id: valueThesisPhase.id
                    })
                    .select()
            }
            setIsOpen(false);
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
    const handleDownloadFile = async () => {
        const { data, error } = await downloadFile({ pathname: urlFile });
        if (!error) {
            window.open(data.signedUrl);
        }
    };
    const handleUpdateFileUpload = ({ field, value }) => {
    };
    const handleOnUpload = event => {
        setFile(event.target.files[0]);
    };
    const ConfirmModal = () => {
        confirm({
            title: 'Bạn có thực sự muốn nộp tài liệu này?',
            icon: <ExclamationCircleFilled />,
            content: 'Tài liệu sẽ gửi lên hệ thống sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleUploadFile()
            },
            onCancel() { },
        });
    };
    const handleUndo = async () => {
        const { error } = await supabase
            .from('thesis_phases')
            .update({
                status: 'normal',
            })
            .eq('id', valueThesisPhase?.id)
            .select()
        if (!error) {
            refetchData({})
        }
    };
    const checkDisabled = () => (
        valueThesisPhase.status === 'approved' ||
        valueThesisPhase.status === 'reject'
    );

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
                            {file?.name ?
                                <CloudDownloadOutlined onClick={() => handleDownloadFile()} /> :
                                <CloudUploadOutlined onClick={() => inputRef.current.click()} />
                            }
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
                    {((!valueThesisPhase?.status === 'approved' || !file?.name) ||
                        (valueThesisPhase?.status === 'normal' || valueThesisPhase?.comment)
                    ) && (
                            <div className="invalid-feedback d-block">
                                <span>File tải lên không được để trống</span>
                                <br></br>
                                <span>Tên file không được chứa tiếng Việt có dấu và ký tự đặc biệt</span>
                            </div>
                        )}
                </>
            );
        }
        if (item.type === 'TEXT_AREA') {
            return (
                <TextArea
                    value={commentTeacher || ''}
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
                    .map(item => (
                        <Form.Item label={item.label} key={item.field}>
                            {renderInput(item)}
                        </Form.Item>)) :
                fieldSubmitAndComment.map(item => (
                    <Form.Item label={item.label} key={item.field}>
                        {renderInput(item)}
                    </Form.Item>))
            }
        </Form>
    );
    const { modal: createNewTopic, toggleModal } = useModal({
        content: createTopicModalContent,
        title: title,
        okText: valueThesisPhase?.status === 'reject' ? 'Hoàn tác' : 'Nộp',
        handleConfirm: valueThesisPhase?.status === 'reject' ? handleUndo : ConfirmModal,
        setIsOpen: setIsOpen,
        viewButton: valueThesisPhase?.status === 'normal' || (valueThesisPhase?.status === 'reject' && phaseOrder !== 3),
    });

    return (
        <>
            {createNewTopic}
        </>
    );
};

export default SubmitModal;