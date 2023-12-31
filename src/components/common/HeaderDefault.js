import React, { useContext } from 'react';
import '../../styles/Header.scss';
import logo from "../../assets/images/logo.svg";
import avatar from "../../assets/images/avt2.jpg";
import AuthContext from '../../context/authContext';
import Layout from 'antd/es/layout/layout';
const { Header } = Layout;

const HeaderDefault = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <>
            <Header id="header" className="d-flex align-items-center justify-content-between py-4 px-0 fixed-top">
                <div className='d-flex align-items-center'>
                    <img src={logo} width={207} height={50} alt="logo" className='me-4 mb-3' />
                    <h1 className="fs-3 ms-4">Hệ thống Quản lý Khóa luận tốt nghiệp</h1>
                </div>
                <div className='d-flex me-5 align-items-center'>
                    <div className='d-flex me-5'>
                        <img className='avatar me-2' width={33} height={33} src={avatar} alt='user avatar' />
                        <div className='d-flex flex-column ms-1 text-start'><span>Xin chào, </span><span><strong>{user?.name || 'guest'}</strong></span></div>
                    </div>
                    <div className='d-flex flex-column ms-4 logout' role="button" onClick={logout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Đăng xuất</span>
                    </div>
                </div>
            </Header>
        </>

    );
};

export default HeaderDefault;