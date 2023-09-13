import React from "react";


export function TableCustom(props) {

    const { data, isAdmin, listTitle, listFields } = props;

    const showAction = () => (
        isAdmin &&
        <td>
            {/* <i role="button" className="fa-solid fa-pen-to-square mx-2" onClick={() => {
                setUpdateDepartment({
                    id,
                    department_code, department_name, dean_code
                })
                setOpenEditModal(!openEditModal)
            }}></i>
            <i role="button" className="fa-solid fa-trash mx-2" onClick={() => ConfirmModal({ id })}></i> */}
        </td>

    );

    return (
        <table className="table table-bordered table-sm table-responsive table-striped table-hover">
            <thead className='table-head'>
                <tr>
                    {listTitle.map(item => (
                        <th scrope="col">{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody className='position-relative'>
                {
                    data.length > 0 ?
                        data?.map((data, index) =>
                            listFields.map(field => (
                                <tr key={data.id}>
                                    <th scrope="row">{index + 1}</th>
                                    <td>{data[field]}</td>
                                    <td>{showAction()}</td>
                                </tr>))
                        )
                        :
                        <tr>
                            <td colSpan={6} className="py-3">
                                <i className="fa-solid fa-box-archive me-4 fa-xl"></i>
                                No data
                            </td>
                        </tr>
                }
            </tbody>
        </table>
    );
}

export default TableCustom;