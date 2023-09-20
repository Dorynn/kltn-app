import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import AuthContext from '../../context/authContext';


const { Sider } = Layout;
const {SubMenu} = Menu;

const Sidebar = () => {
    const { isAdmin, isTeacher, isStudent } = useContext(AuthContext);

    return (
        <>
            <Sider
                style={{
                    background: '#fff',
                    borderColor: '#000'
                }}
            >
                <Menu mode='inline'>
                {
                    !isStudent && 
                    <Menu.Item key="1">
                        <Link to="/department">
                            <span>{isAdmin ? 'Quản ': 'Danh sách '}khoa</span>
                        </Link>
                    </Menu.Item>
                }

                    <Menu.Item key="2">
                        <Link to="/major">
                            <span>Quản lý ngành</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/subject">
                            <span>Quản lý học phần</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={<span>Quản lý người dùng</span>}
                    >
                        <Menu.Item key="4">
                            <Link to="/graduate-charge-person">
                                <span>Quản lý người phụ trách</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/lecturer">
                                <span>Quản lý giáo viên</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/student">
                                <span>Quản lý sinh viên</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="7" hasRole={['admin','teacher']}>
                        <Link to="/teacher-registration">
                            <span>Đăng ký đề tài</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/topic-list">
                            <span>Danh sách đề tài</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to="/student-registration">
                            <span>Đăng ký đề tài</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                        <Link to="/proposed-topic-list">
                            <span>Danh sách đề tài đề xuất</span>
                        </Link>
                    </Menu.Item>
                </Menu>
                
            </Sider>

        </>
    );
};

export default Sidebar;