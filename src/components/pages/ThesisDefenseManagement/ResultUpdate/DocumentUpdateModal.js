import React, { useContext, useEffect } from 'react'
import useModal from '../../../../hooks/modal/useModal';
import { Form, Input, Modal, Radio } from 'antd';
import NotificationContext from '../../../../context/notificationContext';
import { ExclamationCircleFilled } from '@ant-design/icons';

function DocumentUpdateModal(props) {
    const { refetchData, isOpen, setIsOpen, resultUpdate } = props;
    const { confirm } = Modal;
    const { openNotification } = useContext(NotificationContext);

    const fieldUpdateTopic = [
        {
            label: 'Mã sinh viên',
            field: 'student_id',
            type: 'INPUT',
        },
        {
            label: 'Tên sinh viên',
            field: 'name',
            type: 'INPUT',
        },
        {
            label: 'Đề tài',
            field: 'topic_name',
            type: 'INPUT',
        },
        {
            label: 'Biên bản bảo vệ',
            field: 'topic_description',
            type: 'INPUT',
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

    const ConfirmModal = (id) => {
        confirm({
            title: 'Bạn có thực sự muốn thay đổi đề tài này?',
            icon: <ExclamationCircleFilled />,
            content: 'Đề tài sẽ không được khôi phục sau khi bạn nhấn đồng ý!',
            okText: 'Đồng ý',
            cancelText: 'Hủy',
            centered: true,
            onOk() {
                // handleUpdateTopic({ id })
            },
            onCancel() { },
        });
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
        if (item.type === 'RADIO_BOX') {
            return (<div className='d-flex justify-content-between'>
                <Radio.Group
                    // onChange={onChange} 
                    // value={value}
                    defaultValue={2}
                >
                    <Radio value={1}>Yêu cầu chỉnh sửa</Radio>
                    <Radio value={2} defaultChecked >Hoàn thành</Radio>
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