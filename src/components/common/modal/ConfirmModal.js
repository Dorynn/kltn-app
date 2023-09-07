import React from 'react';

const ConfirmModal = (props) => {
    const handleOk = () => {
        props.handleConfirm();
        window.$('#confirmModal').modal('hide')
    }
    return (
        <div className='modal fade' id="confirmModal" tabIndex={-1} role="dialog" aria-labelledby='cofirmModalLabel' aria-hidden="true">
            <div className='modal-dialog modal-dialog-centered' role={document}>
                <div className='modal-content'>
                    <div className='modal-header border-bottom-0'>
                        <h5 id="confirmModalLabel" className='modal-title text-left'>Bạn có muốn xóa không?</h5>
                        <button className="btn-close text-dark" data-bs-dismiss='modal' aria-label='Close'>
                        <i className="fa-solid fa-xmark fa-xl"></i>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <p className='text-start'>Dữ liệu sẽ không thể khôi phục sau khi xóa</p>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-secondary' data-bs-dismiss="modal">Hủy</button>
                        <button type="button" className='btn btn-danger' onClick={handleOk}>Đồng ý</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;