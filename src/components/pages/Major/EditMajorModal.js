import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const EditMajorModal = (props) => {
    const [maID, setMaID] = useState("");
    const [maName, setMaName] = useState("");
    const [deanID, setDeanID] = useState("");
    const [deanName, setDeanName] = useState("");
    
    useEffect(() => {
        console.log(props);
        setMaID(props.curEdit.maID);
        setMaName(props.curEdit.maName);
        setDeanID(props.curEdit.deanID);
        setDeanName(props.curEdit.deanName);
    },[props.curEdit])

    

    const handleEdit = () => {
        console.log(deanName)
        try {
            axios.put(`http://localhost:8000/majors/${props.curEdit.id}`, {
                id: props.curEdit.id,
                maID: maID,
                maName: maName,
                deanID: deanID,
                deanName: deanName,
                active: true
            })
        }catch(error){
            console.log(error)
        }
        finally{
            // window.$('#editMajor').modal('hide')
            setDeanID('');
            setDeanName('');
            setMaID('');
            setMaName('');
        }

    }

    return (
        <div className="modal fade" id="editMajor" tabIndex="-1" aria-labelledby="editMajorModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="editMajorModalLabel">Sửa thông tin ngành</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label for="majorID" class="col-sm-3 col-form-label text-start">Mã ngành:</label>
                                <div class="col-sm-9">
                                    <input id="majorID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="majorName" class="col-sm-3 col-form-label text-start">Tên ngành:</label>
                                <div class="col-sm-9">
                                    <input id="majorName" className="form-control" />
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
                        <button type="button" className="btn bg-main">Sửa</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMajorModal;