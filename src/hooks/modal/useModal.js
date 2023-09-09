import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export default function useModal({ content, title = 'Modal', handleConfirm = () => { } }) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const toggleModal = (status) => {
        setOpen(status);
    };

    const handleOk = async () => {
        try {
            setConfirmLoading(true);
            await handleConfirm().then()
            handleCancel();
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmLoading(false)
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const modal = (
        <>
            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                {content}
            </Modal>
        </>
    );
    return { modal, toggleModal }
};