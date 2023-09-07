import React from 'react';
import { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import $ from "jquery";

const AddDepartmentModal = (props) => {
    const [depID, setDepID] = useState('');
    const [depName, setDepName] = useState('');
    const [deanID, setDeanID] = useState('');
    const [deanName, setDeanName] = useState('');

    $(window).on('shown.bs.modal', () => {
        setDeanID('');
        setDeanName('');
        setDepID('');
        setDepName('');
    })

    const handleSubmit = () => {
        
        props.addNewDepartment({
            id: uuidv4(),
            depID: depID,
            depName: depName,
            deanID: deanID,
            deanName: deanName,
            active: true
        });
        window.$('#addDepartment').modal('hide')
        setDeanID('');
        setDeanName('');
        setDepID('');
        setDepName('');
    }

    return (
        <div className="modal fade" id="addDepartment" tabIndex="-1" aria-labelledby="departmentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="departmentModalLabel">Thêm mới khoa</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label htmlFor="departmentID" className="col-sm-3 col-form-label text-start">Mã khoa:</label>
                                <div className="col-sm-9">
                                    <input value={depID} onChange={e=>setDepID(e.target.value)} id="departmentID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="departmentName" className="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div className="col-sm-9">
                                    <input value={depName} onChange={e => setDepName(e.target.value)} id="departmentName" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="deanID" className="col-sm-3 col-form-label text-start">Mã trưởng khoa:</label>
                                <div className="col-sm-9">
                                    <input value={deanID} onChange={e => setDeanID(e.target.value)} id="deanID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="deanName" className="col-sm-3 col-form-label text-start">Tên trưởng khoa:</label>
                                <div className="col-sm-9">
                                    <input value={deanName} onChange={e => setDeanName(e.target.value)} id="deanName" className="form-control" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" onClick={handleSubmit} className="btn bg-main">Tạo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDepartmentModal;