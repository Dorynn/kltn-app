import React from 'react';
import AddDepartmentModal from './AddDepartmentModal';
import EditDepartmentModal from './EditDepartmentModal';
import ConfirmModal from '../../common/modal/ConfirmModal';
import { useState, useEffect } from 'react';
import $ from "jquery";
import axios from 'axios';

const Department = () => {
    const [departments, setDepartment] = useState([]);
    const [curEdit, setCurEdit] = useState({})
    const [loading, setLoading] = useState(true);
    const [isOpenModal, setOpenModal] = useState(false);

    useEffect(()=>{
        window.$('#addDepartment').bind('hide.bs.modal', event => {
            getData();
        })
        window.$('#editDepartment').bind('hide.bs.modal', event =>{
            getData();

        })
        window.$('#confirmModal').bind('hide.bs.modal', ()=>{
            getData();
        })
        window.$('.modal').bind('show.bs.modal', event => {
            $(".modal-backdrop").remove();
            console.log("hihihi")
        })
        // window.$('#editDepartment').bind('show.bs.modal', event =>{
        //     $(".modal-backdrop").remove();
        //     console.log("hahah")
        // })
        // window.$('#confirmModal').bind('show.bs.modal', ()=>{
        //     $(".modal-backdrop").remove();
        // })

    },[]);

     const getData = async () => {
        try {
            setLoading(true)
            console.log(loading, '2222222222')
            await axios.get('http://localhost:8000/departments?active=true')
                .then(res =>{ 
                    setDepartment(res.data)
                })
        } catch (error) {
            console.log(error)
        }
        finally {
        }
        setLoading(false);
    }

    useEffect(() => {
        console.log(departments)
        console.log(loading)
        getData();
    }, [])


    const addNewDepartment = (newDep) => {
        try {
            axios.post('http://localhost:8000/departments', newDep)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditDepartment = (dep) => {
        setCurEdit(dep)
    }

    const handleDeleteDepartment = () => {
        try {
            axios.put(`http://localhost:8000/departments/${curEdit.id}`, { ...curEdit, active: false })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <h4 className='title' data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="top">Quản lý khoa</h4>
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
                <tbody className='position-relative'>
                    {
                        departments.length ?
                            departments.map((item, index) => {
                                return (

                                    <tr key={item.id}>
                                        <th scrope="row">{index + 1}</th>
                                        <td>{item.depID}</td>
                                        <td className='text-start ps-3'>{item.depName}</td>
                                        <td>{item.deanID}</td>
                                        <td className='text-start ps-3'>{item.deanName}</td>
                                        <td>
                                            <span data-toggle="tooltip" data-placement="top" title="Tooltip on top">
                                                <i role="button" data-bs-toggle="modal" data-bs-target="#editDepartment" className="fa-solid fa-pen-to-square mx-2"  onClick={() => setCurEdit(item)} ></i>
                                            </span>
                                            <span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip">
                                                <i role="button" data-bs-toggle="modal" data-bs-target="#confirmModal" className="fa-solid fa-trash mx-2" onClick={() => handleEditDepartment(item)}></i>
                                            </span>
                                        </td>
                                    </tr>

                                )
                            })
                            :
                            <tr>
                                <td colSpan={6} className="py-3"><i className="fa-solid fa-box-archive me-4 fa-xl"></i>No data</td>
                            </tr>


                    }
                    {
                        loading &&
                        <div class="text-center position-absolute top-50 start-50 translate-middle">
                            <div class="spinner-border" role="status"></div>
                        </div>
                    }

                </tbody>
            </table>
            <AddDepartmentModal addNewDepartment={addNewDepartment} />
            <EditDepartmentModal curEdit={curEdit} />
            <ConfirmModal handleConfirm={handleDeleteDepartment} />
        </>
    );
};

export default Department;