import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import AuthContext from '../../context/authContext';


const { Sider } = Layout;
const { SubMenu } = Menu;

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
                                <span>{isAdmin ? 'Quản lý' : 'Danh sách'} khoa</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        !isStudent &&
                        <Menu.Item key="2">
                            <Link to="/major">
                                <span>{isAdmin ? 'Quản lý' : 'Danh sách'} ngành</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        isAdmin &&
                        <Menu.Item key="3">
                            <Link to="/subject">
                                <span>Quản lý học phần</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        !isStudent &&
                        <SubMenu
                            key="sub1"
                            title={<span>{isAdmin ? 'Quản lý' : 'Danh sách'} người dùng</span>}
                        >
                            <Menu.Item key="5">
                                <Link to="/lecturer">
                                    <span>{isAdmin ? 'Quản lý' : 'Danh sách'} giáo viên</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to="/student">
                                    <span>{isAdmin ? 'Quản lý' : 'Danh sách'} sinh viên</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    }
                    {
                        !isStudent &&
                        <SubMenu
                            key="sub2"
                            title={<span>Quản lý đề tài</span>}
                        >
                            <Menu.Item key="7">
                                <Link to="/teacher-topic-registration">
                                    <span>Đăng ký đề tài</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <Link to="/topic-list">
                                    <span>Danh sách đề tài</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="9">
                                <Link to="/approved-topic-list">
                                    <span>Duyệt danh sách đăng ký</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="10">
                                <Link to="/proposed-topic-list">
                                    <span>Duyệt danh sách đề xuất</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    }
                    {
                        !isTeacher &&
                        <Menu.Item key="11">
                            <Link to="/student-topic-registration">
                                <span>Đăng ký & đề xuất đề tài</span>
                            </Link>
                        </Menu.Item>
                    }

                </Menu>

            </Sider>

        </>
    );
};

export default Sidebar;