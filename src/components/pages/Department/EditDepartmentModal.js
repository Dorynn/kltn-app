import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const EditDepartmentModal = (props) => {
    const [depID, setDepID] = useState("");
    const [depName, setDepName] = useState("");
    const [deanID, setDeanID] = useState("");
    const [deanName, setDeanName] = useState("");
    
    useEffect(() => {
        console.log(props);
        setDepID(props.curEdit.depID);
        setDepName(props.curEdit.depName);
        setDeanID(props.curEdit.deanID);
        setDeanName(props.curEdit.deanName);
    },[props.curEdit])

    

    const handleEdit = () => {
        console.log(deanName)
        try {
            axios.put(`http://localhost:8000/departments/${props.curEdit.id}`, {
                id: props.curEdit.id,
                depID: depID,
                depName: depName,
                deanID: deanID,
                deanName: deanName,
                active: true
            })
        }catch(error){
            console.log(error)
        }
        finally{
            // window.$('#editDepartment').modal('hide')
            setDeanID('');
            setDeanName('');
            setDepID('');
            setDepName('');
        }

    }

    return (
        <div className="modal fade" id="editDepartment" tabIndex="-1" aria-labelledby="editDepartmentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="editDepartmentModalLabel">Sửa thông tin khoa</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label htmlFor="departmentID" className="col-sm-3 col-form-label text-start">Mã khoa:</label>
                                <div className="col-sm-9">
                                    <input id="departmentID" value={depID} onChange={(e)=>setDepID(e.target.value)} className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="departmentName" className="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div className="col-sm-9">
                                    <input id="departmentName" value={depName} onChange={(e)=>setDepName(e.target.value)} className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="deanID" className="col-sm-3 col-form-label text-start">Mã trưởng khoa:</label>
                                <div className="col-sm-9">
                                    <input id="deanID" value={deanID} onChange={e => setDeanID(e.target.value)} className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="deanName" className="col-sm-3 col-form-label text-start">Tên trưởng khoa:</label>
                                <div className="col-sm-9">
                                    <input id="deanName" value={deanName} onChange={e => setDeanName(e.target.value)} className="form-control" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className="btn bg-main" data-bs-dismiss="modal" onClick={handleEdit} >Sửa</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDepartmentModal;