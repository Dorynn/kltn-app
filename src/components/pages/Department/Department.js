import React from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';

const Department = () => {
    return (
        <>
            <h4 className='title'>Quản lý khoa</h4>
            <div className='d-flex justify-content-end me-4'>
                <div className='me-3' role="button" data-bs-toggle="modal" data-bs-target="#addDepartment">
                    <i className="fa-solid fa-circle-plus"></i>
                    <span className='ms-2'>Thêm mới</span>
                </div>
                <div role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
                    </svg>
                    <span className='ms-2'>Import file</span>
                </div>
            </div>
            <table className="table table-bordered table-sm table-responsive table-striped table-hover">
                <thead className='table-head'>
                    <tr>
                        <th scrope="col">STT</th>
                        <th scrope="col">Mã khoa</th>
                        <th scrope="col">Tên khoa</th>
                        <th scrope="col">Mã trưởng khoa</th>
                        <th scrope="col">Tên trưởng khoa</th>
                        <th scrope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scrope="row">1</th>
                        <td>A1235</td>
                        <td>Công nghệ thông tin</td>
                        <td>PI1234</td>
                        <td>Nguyễn Đình Hóa</td>
                        <td>
                            <i role="button" data-bs-toggle="modal" data-bs-target="#editDepartment" className="fa-solid fa-pen-to-square mx-2"></i>
                            <i role="button" className="fa-solid fa-trash mx-2"></i>
                        </td>
                    </tr>
                    <tr>
                        <th scrope="row">2</th>
                        <td>A1235</td>
                        <td>Công nghệ thông tin</td>
                        <td>PI1234</td>
                        <td>Nguyễn Đình Hóa</td>
                        <td>
                            <i role="button" data-bs-toggle="modal" data-bs-target="#editDepartment" className="fa-solid fa-pen-to-square mx-2"></i>
                            <i role="button" className="fa-solid fa-trash mx-2"></i>
                        </td>
                    </tr>
                    <tr>
                        <th scrope="row">3</th>
                        <td>A1235</td>
                        <td>Công nghệ thông tin</td>
                        <td>PI1234</td>
                        <td>Nguyễn Đình Hóa</td>
                        <td>
                            <i role="button" data-bs-toggle="modal" data-bs-target="#editDepartment" className="fa-solid fa-pen-to-square mx-2"></i>
                            <i role="button" className="fa-solid fa-trash mx-2"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
            <AddDepartmentModal />
            <EditDepartmentModal/>
        </>
    );
};

export default Department;