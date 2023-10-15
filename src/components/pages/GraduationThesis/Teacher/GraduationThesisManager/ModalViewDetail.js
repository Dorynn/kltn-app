import React, { useContext, useState, useEffect, useRef } from 'react';
import NotificationContext from '../../../../../context/notificationContext';
import supabase from '../../../../../supabaseClient';
import useModal from '../../../../../hooks/modal/useModal';
import { Form, Input, Modal, Select } from "antd";
import { FileAddOutlined, CloudDownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { fieldViewDetail } from './GraduationThesisManagerconstant';
import useSupbaseAction from '../../../../../hooks/useSupabase/useSupabaseAction';
import downloadFile from '../../../../../helpers/storage/downloadFile';

function ModalViewDetail(props) {
    const {
        refetchData,
        isOpen,
        setIsOpen,
        phasesId,
    } = props;
    const { confirm } = Modal;
    const { TextArea } = Input;
    const { openNotification } = useContext(NotificationContext);
    const [teacherComment, setTeacherComment] = useState('');

    useEffect(() => {
        if (isOpen) {
            toggleModal(true);
        }
    }, [isOpen])

    const { data: dataPhase} = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('submit_assignments')
            .select(`
                submit_url, phase_id,
                thesis_phases(comment, phase_order)
            `)
            .eq('phase_id', phasesId)
    });
    const urlFile = (dataPhase && dataPhase.length > 0 && dataPhase[0] && dataPhase[0].submit_url) || '';
    const comment = (dataPhase && dataPhase.length > 0 && dataPhase[0] && dataPhase[0]?.thesis_phases) || {comment: ''};
    const fileName = urlFile && urlFile.split('/')[1];
    useEffect(() => {
        if (dataPhase) {
            setTeacherComment(comment && comment.comment);
        }
    }, [dataPhase]);
    const handleApproved = async () => {
        const { error } = await supabase
            .from('thesis_phases')
            .update({ 
                comment: teacherComment,
                status: 'approved',
            })
            .eq('id', phasesId)
        if (!error) {
            await supabase
                .from('')
            await refetchData({})
            setIsOpen(false);
            return openNotification({
                message: 'Duyệt đề cương thành công'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Duyệt đề cương thất bại',
        })
    };

    const ConfirmModal = () => {
        confirm({
            title: 'Bạn có thực sự muốn thay đổi đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                handleApproved()
            },
            onCancel() { },
        });
    };
    const handleDownloadFile = async () => {
        const { data, error } = await downloadFile({pathname: urlFile});
        if (!error) {
            window.open(data.signedUrl);
        }
    };

    // tùy loại input để render
    const renderInput = (item) => {
        if (item.type === 'FILEUPLOAD') {
            return (
                <>
                    <Input
                        type="button"
                        value={fileName}
                        prefix={fileName ? <FileAddOutlined /> : <></>}
                        suffix={<CloudDownloadOutlined onClick={() => handleDownloadFile()}/>}
                        size='large'
                        className="input-add-file"
                    />
                </>
            );
        }
        if (item.type === 'TEXT_AREA') {
            return (
                <TextArea
                    value={teacherComment}
                    onChange={e => setTeacherComment(e.target.value)}
                    rows={5}
                    disabled={comment[item.field]}
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
            {fieldViewDetail.map(item => (
                <Form.Item label={item.label} key={item.field}>
                    {renderInput(item)}
                </Form.Item>
            ))}
        </Form>
    );

    const { modal: createNewTopic, toggleModal } = useModal({
        content: createTopicModalContent,
        title: 'Chi tiết đề cương',
        okText: `${comment.comment ? '' : 'Duyệt'}`,
        handleConfirm: ConfirmModal,
        setIsOpen: setIsOpen
    });

    return (
        <>
            {createNewTopic}
        </>
    );
};

export default ModalViewDetail;