import React from 'react';
import { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import $ from "jquery";

const AddMajorModal = (props) => {
    const [maID, setMaID] = useState('');
    const [maName, setMaName] = useState('');
    const [deanID, setDeanID] = useState('');
    const [deanName, setDeanName] = useState('');

    $(window).on('shown.bs.modal', () => {
        setDeanID('');
        setDeanName('');
        setMaID('');
        setMaName('');
    })

    const handleSubmit = () => {
        
        props.addNewMajor({
            id: uuidv4(),
            maID: maID,
            maName: maName,
            deanID: deanID,
            deanName: deanName,
            active: true
        });
        setDeanID('');
        setDeanName('');
        setMaID('');
        setMaName('');
    }

    return (
        <div className="modal fade" id="addMajor" tabIndex="-1" aria-labelledby="majortModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="majortModalLabel">Thêm mới ngành</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label for="majortID" class="col-sm-3 col-form-label text-start">Mã ngành:</label>
                                <div class="col-sm-9">
                                    <input id="majortID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="majortName" class="col-sm-3 col-form-label text-start">Tên ngành:</label>
                                <div class="col-sm-9">
                                    <input id="majortName" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanID" class="col-sm-3 col-form-label text-start">Mã trưởng ngành:</label>
                                <div class="col-sm-9">
                                    <input id="deanID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanName" class="col-sm-3 col-form-label text-start">Tên trưởng ngành:</label>
                                <div class="col-sm-9">
                                    <input id="deanName" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="departmentName" class="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentName" className="form-control" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className="btn bg-main">Tạo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMajorModal;