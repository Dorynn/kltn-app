import {v4 as uuidv4} from 'uuid';
import $ from "jquery";
import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';

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
        setDeanID('');
        setDeanName('');
        setDepID('');
        setDepName('');
    }
    const AddDepartmentModal = ({ refetchData }) => {
        const [newDepartment, setNewDepartment] = useState({
            department_code: '',
            department_name: '',
            dean_code: ''
        });
        const { openNotification } = useContext(NotificationContext);
    
        const handleInputChange = (key, value) => {
            setNewDepartment(prev => ({ ...prev, [key]: value }))
        }
    
        const handleCreateDepartment = async () => {
            const { error } = await supabase
                .from('departments')
                .insert([
                    newDepartment
                ])
                .select()
            if (!error) {
                await refetchData({})
                return openNotification({
                    message: 'Create department successfully'
                })
            }
            return openNotification({
                type: 'error',
                message: 'Create department failed',
                description: error.message
            })
        }

    return (
        <div className="modal fade" id="addDepartment" tabIndex='-1' aria-labelledby="departmentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="departmentModalLabel">Thêm mới khoa</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label for="departmentID" class="col-sm-3 col-form-label text-start">Mã khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentID" className="form-control" value={newDepartment.department_code} onChange={(e) => handleInputChange('department_code', e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="departmentName" class="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentName" className="form-control" value={newDepartment.department_name} onChange={(e) => handleInputChange('department_name', e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanID" class="col-sm-3 col-form-label text-start">Mã trưởng khoa:</label>
                                <div class="col-sm-9">
                                    <input id="deanID" className="form-control" value={newDepartment.dean_code} onChange={(e) => handleInputChange('dean_code', e.target.value)} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className="btn bg-main" onClick={handleCreateDepartment}>Tạo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
}

export default AddDepartmentModal;