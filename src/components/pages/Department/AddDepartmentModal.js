import React from 'react';

const AddDepartmentModal = () => {
    return (
        <div className="modal fade" id="addDepartment" tabIndex="-1" aria-labelledby="departmentModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-main">
                        <h1 className="modal-title fs-5 " id="departmentModalLabel">Thêm mới khoa</h1>
                        <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark fa-xl"></i></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-3">
                                <label for="departmentID" class="col-sm-3 col-form-label text-start">Mã khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="departmentName" class="col-sm-3 col-form-label text-start">Tên khoa:</label>
                                <div class="col-sm-9">
                                    <input id="departmentName" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanID" class="col-sm-3 col-form-label text-start">Mã trưởng khoa:</label>
                                <div class="col-sm-9">
                                    <input id="deanID" className="form-control" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label for="deanName" class="col-sm-3 col-form-label text-start">Tên trưởng khoa:</label>
                                <div class="col-sm-9">
                                    <input id="deanName" className="form-control" />
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

export default AddDepartmentModal;