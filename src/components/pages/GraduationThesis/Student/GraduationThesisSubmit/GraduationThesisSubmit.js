import React, {useState} from "react";
import { Input } from "antd";
import {
    CloudUploadOutlined,
    LoadingOutlined,
    CheckOutlined,
    LockOutlined
} from '@ant-design/icons';
import { configInput } from "./GraduationThesisSubmitconstants";
import SubmitModal from "./SubmitModal";

function GraduationThesisSubmit() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [idInput, setIdInput] = useState('');
    const [statusInputOutline, setStatusInputOutline] = useState('normal');
    const [statusInputReport, setStatusInputReport] = useState('disable');
    const [statusInputFinalReport, setStatusInputFinalReport] = useState('disable');

    const getSuffixInput = (id) => {
        if (id === 'outline') {
            if (statusInputOutline === 'normal') {
                return <CloudUploadOutlined onClick={() => {setIsOpenModal(true); setIdInput(id)}} />
            }
            if (statusInputOutline === 'pending') {
                return <LoadingOutlined />
            }
            if (statusInputOutline === 'success') {
                return <CheckOutlined />
            }
        }
        if (id === 'report') {
            if (statusInputReport === 'normal') {
                return <CloudUploadOutlined onClick={() => {setIsOpenModal(true); setIdInput(id)}} />
            }
            if (statusInputReport === 'pending') {
                return <LoadingOutlined />
            }
            if (statusInputReport === 'success') {
                return <CheckOutlined />
            }
        }
        if (id === 'finalReport') {
            if (statusInputFinalReport === 'normal') {
                return <CloudUploadOutlined onClick={() => {setIsOpenModal(true); setIdInput(id)}} />
            }
            if (statusInputFinalReport === 'pending') {
                return <LoadingOutlined />
            }
            if (statusInputFinalReport === 'success') {
                return <CheckOutlined />
            }
        }
        return <LockOutlined/>
    };
    const getDisabledInput = (id) => {
        if (id === 'outline') {
            return statusInputOutline === 'success';
        }
        if (id === 'report') {
            return statusInputReport === 'disable' || statusInputReport === 'success';
        }
        if (id === 'finalReport') {
            return statusInputFinalReport === 'disable' || statusInputFinalReport === 'success'
        }
        return false;
    };

    return (
        <>
            <h4 className='title'>Nộp tài liệu KLTN</h4>
            <div style={{ width: '50%', margin: 'auto' }}>
            {configInput.map(item => (
                <div className="mb-5" key={item.id}>
                    <Input
                        id={item.id}
                        value={item.value}
                        readOnly
                        suffix={getSuffixInput(item.id)}
                        size="large"
                        disabled={getDisabledInput(item.id)}
                    ></Input>
                </div>
            ))}
            </div>
            {isOpenModal && <SubmitModal
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                idInput={idInput}
                setStatusInputOutline={setStatusInputOutline}
                setStatusInputReport={setStatusInputReport}
                setStatusInputFinalReport={setStatusInputFinalReport}
                // refetchData={refetchData}
            ></SubmitModal>}
        </>
    );
}

export default GraduationThesisSubmit;