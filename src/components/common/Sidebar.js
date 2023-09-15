import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import $ from "jquery";
const { Sider } = Layout;
const {SubMenu} = Menu;
const Sidebar = () => {
    useEffect(() => {
        window.$('.list-group-item').click(function () {
            $('.list-group-item').removeClass('active');
            $(this).addClass('active');
        })
    })
    const [toggle, setToggle] = useState()
    function getItem(label, key, children, type) {
        return {
            key,
            children,
            label,
            type,
        };
    }
    const items = [
        getItem('Quản lý khoa', '1'),
        getItem('Quản lý ngành', '2'),
        getItem('Quản lý học phần', '3'),
        getItem('Quản lý người dùng', 'sub1',  [
            getItem('Quản lý người phụ trách', '5'),
            getItem('Quản lý giáo viên', '6'),
            getItem('Quản lý sinh viên', '7'),
        ]),
    ];
    return (
        <>
            <Sider
                style={{
                    background: '#fff',
                    borderColor: '#000'
                }}
            >
                <Menu mode='inline'>
                    <Menu.Item key="1">
                        <Link to="/department">
                            <span>Quản lý khoa</span>
                        </Link>
                    </Menu.Item>
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
                </Menu>
            </Sider>

        </>
    );
};

export default Sidebar;