import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import AuthContext from '../../context/authContext';

// URL
import {
    URL_APPROVED_TOPIC_LIST,
    URL_DEPARTMENT,
    URL_GRADUATION_THESIS_INFO,
    URL_GRADUATION_THESIS_MANAGER,
    URL_GRADUATION_THESIS_SUBMIT,
    URL_LECTURER,
    URL_MAJOR,
    URL_PROPOSED_TOPIC_LIST,
    URL_REVIEW_REPORT_GRADUATION,
    URL_STUDENT,
    URL_STUDENT_TOPIC_REGISTRATION,
    URL_SUBJECT,
    URL_TEACHER_TOPIC_REGISTRATION,
    URL_TOPIC_LIST,
    URL_ACHIEVED_RECORD,
    URL_GRADE_MANAGEMENT,
    URL_RESULT_UPDATE,
    URL_GRADUATION_THESES_STUDENT_INFO,
    URL_DEFENSE_ESTABLISH,
    URL_REVIEWER_TEACHER_ASSIGNMENT,
    URL_THESIS_GRADE,
    URL_VIEW_GRADES,

} from "../../const/configUrl";


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
                            <Link to={URL_DEPARTMENT}>
                                <span>{isAdmin ? 'Quản lý' : 'Danh sách'} khoa</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        !isStudent &&
                        <Menu.Item key="2">
                            <Link to={URL_MAJOR}>
                                <span>{isAdmin ? 'Quản lý' : 'Danh sách'} ngành</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        isAdmin &&
                        <Menu.Item key="3">
                            <Link to={URL_SUBJECT}>
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
                                <Link to={URL_LECTURER}>
                                    <span>{isAdmin ? 'Quản lý' : 'Danh sách'} giáo viên</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to={URL_STUDENT}>
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
                                <Link to={URL_TEACHER_TOPIC_REGISTRATION}>
                                    <span>Đăng ký đề tài</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <Link to={URL_TOPIC_LIST}>
                                    <span>Danh sách đề tài</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="9">
                                <Link to={URL_APPROVED_TOPIC_LIST}>
                                    <span>Duyệt danh sách đăng ký</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="10">
                                <Link to={URL_PROPOSED_TOPIC_LIST}>
                                    <span>Duyệt danh sách đề xuất</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    }
                    {
                        !isTeacher &&
                        <Menu.Item key="11">
                            <Link to={URL_STUDENT_TOPIC_REGISTRATION}>
                                <span>Đăng ký & đề xuất đề tài</span>
                            </Link>
                        </Menu.Item>
                    }
                    {
                        (isStudent || isAdmin || isTeacher) &&
                        <SubMenu
                            key="sub3"
                            title={<span>Khóa luận tốt nghiệp</span>}
                        >
                            {
                                isStudent || isAdmin &&
                                <Menu.Item key="12">
                                    <Link to={URL_GRADUATION_THESIS_INFO}>
                                        <span>Thông tin</span>
                                    </Link>
                                </Menu.Item>
                            }
                            {
                                isStudent || isAdmin &&
                                <Menu.Item key="13">
                                    <Link to={URL_GRADUATION_THESIS_SUBMIT}>
                                        <span>Nộp tài liệu</span>
                                    </Link>
                                </Menu.Item>
                            }
                            {
                                isStudent || isAdmin &&
                                <Menu.Item key="21">
                                    <Link to={URL_THESIS_GRADE}>
                                        <span>Xem điểm</span>
                                    </Link>
                                </Menu.Item>
                            }
                            <Menu.Item key="16">
                                <Link to={URL_VIEW_GRADES}>
                                    <span>Xem điểm</span>
                                </Link>
                            </Menu.Item>
                            {
                                (isTeacher || isAdmin) &&
                                <Menu.Item key="14">
                                    <Link to={URL_GRADUATION_THESIS_MANAGER}>
                                        {/* <span>Quản lý khóa luận tốt nghiệp</span> */}
                                        <span>Duyệt đề cương</span>
                                    </Link>
                                </Menu.Item>
                            }
                            {
                                (isTeacher || isAdmin) &&
                                <Menu.Item key="15">
                                    <Link to={URL_REVIEW_REPORT_GRADUATION}>
                                        <span>Duyệt báo cáo bảo vệ</span>
                                    </Link>
                                </Menu.Item>
                            }
                        </SubMenu>
                    }
                    {
                        (isAdmin) &&
                        <SubMenu
                            key="sub4"
                            title={<span>Quản lý bảo vệ KLTN</span>}
                        >
                            <Menu.Item key="16">
                                <Link to={URL_REVIEWER_TEACHER_ASSIGNMENT}>
                                    <span>Phân công giáo viên phản biện</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="17">
                                <Link to={URL_DEFENSE_ESTABLISH}>
                                    <span>Thành lập Hội đồng</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="18">
                                <Link to={URL_GRADUATION_THESES_STUDENT_INFO}>
                                    <span>Danh sách bảo vệ KLTN</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="19">
                                <Link to={URL_RESULT_UPDATE}>
                                    <span>Cập nhật kết quả</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="20">
                                <Link to={URL_GRADE_MANAGEMENT}>
                                    <span>Quản lý nhập điểm</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="22">
                                <Link to={URL_ACHIEVED_RECORD}>
                                    <span>Hồ sơ lưu trữ</span>
                                </Link>
                            </Menu.Item>

                        </SubMenu>
                    }
                </Menu>

            </Sider>

        </>
    );
};

export default Sidebar;