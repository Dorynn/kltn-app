import React, { useState } from 'react';
import { ConfigProvider, Modal } from 'antd';

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
        <ConfigProvider
            theme={{
                components: {
                    Modal: {
                        /* here is your component tokens */
                        headerBg: "#000A3D",
                        titleColor: "#fff",
                        colorIcon: "#fff",
                        titleFontSize: 22
                    },
                },
            }}
        >
            <Modal
                title={title}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                centered
                style={{ color: 'red' }}
                okText='Đồng ý'
                cancelText='Hủy'
            >
                {content}
            </Modal>
        </ConfigProvider>

    );
    return { modal, toggleModal }
};