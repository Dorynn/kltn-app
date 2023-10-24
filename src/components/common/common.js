import React from 'react';

// lay template cho tung status
export const getStatus = (status) => {
    // const value = status && status.toUpperCase() || '';

    if (status === 'pending') {
        return <div className="status status-inprogress">Chờ duyệt</div>;
    }
    if (status === 'doing') {
        return <div className="status status-approved">Đã duyệt</div>;
    }
    if (status === 'reject') {
        return <div className="status status-reject">Từ chối duyệt</div>;
    }
    if (status === 'approved') {
        return <div className="status status-approved">Hoàn thành</div>;
    }
    return '';
}