import React from 'react';
import '../../styles/Header.scss';
import logo from "../../assets/images/logo.svg";
import avatar from "../../assets/images/avt2.jpg";

const Header = ({title}) => {
    return (
        <div id="header" className="d-flex align-items-center justify-content-between py-1 fixed-top">
            <div className='d-flex align-items-center'>
                <img src={logo} width={207} height={50} alt="logo" className='me-4 mb-3' />
                <h1 className="fs-3 ms-4">Hệ thống Quản lý Khóa luận tốt nghiệp</h1>
            </div>
            <div className='d-flex me-5 align-items-center'>
                <div className='d-flex me-5'>
                    <img className='avatar me-2 mt-2' width={33} height={33} src={avatar}/>
                    <div className='d-flex flex-column ms-1 text-start'><span>Xin chào, </span><span><strong>Amin</strong></span></div>
                </div>
                <div className='d-flex flex-column ms-4 logout' role="button">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Log out</span>
                </div>
            </div>
        </div>
    );
};

export default Header;