import React, { useContext, useState } from 'react';
import supabase from '../../../supabaseClient';
import NotificationContext from '../../../context/notificationContext';


const EditDepartmentModal = ({ updateDepartment, setUpdateDepartment, refetchData }) => {

    const { openNotification } = useContext(NotificationContext);

    const handleInputChange = (key, value) => {
        setUpdateDepartment(prev => ({ ...prev, [key]: value }))
    }

    const handleUpdateDepartment = async () => {
        const { error } = await supabase
            .from('departments')
            .update(updateDepartment)
            .eq('id', updateDepartment.id)
            .select()
        if (!error) {
            await refetchData({})
            return openNotification({
                message: 'Update department successfully'
            })
        }
        return openNotification({
            type: 'error',
            message: 'Update department failed',
            description: error.message
        })
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
                                <label for="departmentID" class="col-sm-3 col-form-label text-start">Mã khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentID" className="form-control" value={updateDepartment.department_code} onChange={(e) => handleInputChange('department_code', e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="departmentName" class="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentName" className="form-control" value={updateDepartment.department_name} onChange={(e) => handleInputChange('department_name', e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanID" class="col-sm-3 col-form-label text-start">Mã trưởng khoa:</label>
                                <div class="col-sm-9">
                                    <input id="deanID" className="form-control" value={updateDepartment.dean_code} onChange={(e) => handleInputChange('dean_code', e.target.value)} />
                                </div>
                            </div>
                            {/* <div className="row mb-3">
                                <label for="deanName" class="col-sm-3 col-form-label text-start">Tên trưởng khoa:</label>
                                <div class="col-sm-9">
                                    <input id="deanName" className="form-control" />
                                </div>
                            </div> */}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className="btn bg-main" onClick={handleUpdateDepartment}>Sửa</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditDepartmentModal;