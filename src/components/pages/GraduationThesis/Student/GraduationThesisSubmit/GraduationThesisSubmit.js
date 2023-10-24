import React, { useContext, useEffect, useState } from "react";
import { Input, Tooltip } from "antd";
import {
    CloudUploadOutlined,
    LoadingOutlined,
    CheckOutlined,
    LockOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { configInput } from "./GraduationThesisSubmitconstants";
import SubmitModal from "./SubmitModal";
import './style.scss';
import useSupbaseAction from "../../../../../hooks/useSupabase/useSupabaseAction";
import supabase from "../../../../../supabaseClient";
import AuthContext from "../../../../../context/authContext";

function GraduationThesisSubmit() {
    const { user } = useContext(AuthContext);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemInput, setItemInput] = useState('');
    const [valueThesisPhase, setValueThesisPhase] = useState({});
    const [statusInput, setStatusInput] = useState({
        phase1: 'locked',
        phase2: 'locked',
        phase3: 'locked',
        phase4: 'locked',
    });

    const { data: thesisPhases, requestAction: refetchData } = useSupbaseAction({
        initialData: [],
        firstLoad: true,
        defaultAction: async () => supabase
            .from('thesis_phases')
            .select(`
                *
            `)
            .order('phase_order', { ascending: true })
    });

    useEffect(() => {
        if (thesisPhases) {
            thesisPhases.map((value, index) => {
                if (value.phase_order === index + 1) {
                    setStatusInput(prev => ({ ...prev, [`phase${index + 1}`]: value.status }));
                }
            });
        }
    }, [thesisPhases])

    const getSuffixInput = (id) => {
        if (statusInput[id] === 'normal') {
            return <Tooltip title='Nộp tài liệu'>
                <CloudUploadOutlined />
            </Tooltip>
        }
        if (statusInput[id] === 'pending') {
            return <Tooltip title='Chờ duyệt'>
                <LoadingOutlined />
            </Tooltip>
        }
        if (statusInput[id] === 'approved') {
            return <Tooltip title='Đã được duyệt'>
                <CheckOutlined />
            </Tooltip>
        }
        if (statusInput[id] === 'reject') {
            return <Tooltip title='Bị từ chối'>
                <CloseOutlined />
            </Tooltip>
        }
        return <Tooltip title='Khóa'>
            <LockOutlined />
        </Tooltip>
    };
    const getDisabledInput = (id) => {
        return statusInput[id] === 'locked' || statusInput[id] === 'pending';
    };
    const handleClickSubmit = item => {
        setIsOpenModal(true);
        setItemInput(item.id);
        const thesisByPhasesOrder = thesisPhases.find(value => value.phase_order === item.key) || {};
        setValueThesisPhase(thesisByPhasesOrder);
    }

    return (
        <>
            <h4 className='title'>Nộp tài liệu KLTN</h4>
            <div style={{ width: '50%', margin: 'auto' }}>
                {configInput.map(item => (
                    <div className="mb-4" key={item.id}>
                        <Input
                            type="button"
                            id={item.id}
                            value={item.title}
                            readOnly
                            suffix={getSuffixInput(item.id)}
                            size="large"
                            disabled={getDisabledInput(item.id)}
                            className="input-add-file"
                            onClick={() => handleClickSubmit(item)}
                        ></Input>
                    </div>
                ))}
            </div>
            {isOpenModal && <SubmitModal
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                itemInput={itemInput}
                setStatusInput={setStatusInput}
                valueThesisPhase={valueThesisPhase}
                refetchData={refetchData}
            ></SubmitModal>}
        </>
    );
}

export default GraduationThesisSubmit;