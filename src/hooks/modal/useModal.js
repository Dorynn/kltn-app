import React, { useState } from 'react';
import { Button, ConfigProvider, Modal } from 'antd';

export default function useModal(
    {
        width,
        content,
        title = 'Modal',
        handleConfirm = () => { },
        handleReject = () => { },
        setIsOpen = () => { },
        okText = 'Đồng ý',
        rejectText = '',
        viewButton = true
    }) {
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
            setConfirmLoading(false)
            handleCancel();
        }
    };
    const handleConfirmReject = async () => {
        try {
            setConfirmLoading(true);
            await handleReject().then()
            handleCancel();
        } catch (err) {
            console.error(err);
            setConfirmLoading(false)
            handleCancel();
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setOpen(false);
    };

    const getFooter = () => {
        if (!viewButton) {
            return null;
        }
        if (rejectText) {
            return [
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleConfirmReject}
                >
                    {rejectText}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleOk}
                >
                    {okText}
                </Button>,
            ];
        }
        return [
            <Button 
                key="back" 
                onClick={handleCancel}
            >
                Hủy
            </Button>,
            <Button
                key="submit"
                type="primary"
                onClick={handleOk}
            >
                {okText}
            </Button>
        ];
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
                okText={okText}
                cancelText='Hủy'
                width={width}
                footer={getFooter()}
            >
                {content}
            </Modal>
        </ConfigProvider>

    );
    return { modal, toggleModal }
};