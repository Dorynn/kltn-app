import React, { useState } from "react";
import { Input } from "antd";
import {
    CloudUploadOutlined,
    LoadingOutlined,
    CheckOutlined,
    LockOutlined
} from '@ant-design/icons';
import { configInput } from "./GraduationThesisSubmitconstants";
import SubmitModal from "./SubmitModal";
import './style.scss';

function GraduationThesisSubmit() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [idInput, setIdInput] = useState('');
    const [statusInput, setStatusInput] = useState({
        outline: 'normal',
        reportTeacher: 'disable',
        reportReviewTeacher: 'disable',
        finalReport: 'disable'
    });

    const getSuffixInput = (id) => {
        if (statusInput[id] === 'normal') {
            return <CloudUploadOutlined />
        }
        if (statusInput[id] === 'pending') {
            return <LoadingOutlined />
        }
        if (statusInput[id] === 'success') {
            return <CheckOutlined />
        }
        return <LockOutlined />
    };
    const getDisabledInput = (id) => {
        if (id === 'reportTeacher') {
            return statusInput[id] === 'disable';
        }
        if (id === 'reportReviewTeacher') {
            return statusInput[id] === 'disable';
        }
        if (id === 'finalReport') {
            return statusInput[id] === 'disable'
        }
        return false;
    };

    return (
        <>
            <h4 className='title'>Nộp tài liệu KLTN</h4>
            <div style={{ width: '50%', margin: 'auto' }}>
                {configInput.map(item => (
                    <div className="mb-4" key={item.id}>
                        <Input
                            type="button"
                            id={item.id}
                            value={item.value}
                            readOnly
                            suffix={getSuffixInput(item.id)}
                            size="large"
                            disabled={getDisabledInput(item.id)}
                            className="input-add-file"
                            onClick={() => { setIsOpenModal(true); setIdInput(item.id) }}
                        ></Input>
                    </div>
                ))}
            </div>
            {isOpenModal && <SubmitModal
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                idInput={idInput}
                setStatusInput={setStatusInput}
            ></SubmitModal>}
        </>
    );
}

export default GraduationThesisSubmit;