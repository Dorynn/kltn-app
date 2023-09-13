import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import $ from "jquery";
const Sidebar = () => {
    useEffect(() => {
        window.$('.list-group-item').click(function () {
            $('.list-group-item').removeClass('active');
            $(this).addClass('active');
        })
    })
    const [toggle, setToggle] = useState()

    return (
        <>
            <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
                <div className="position-sticky">
                    <div className="list-group list-group-flush mt-4 text-start" role='button'>
                        <Link
                            to="/department"
                            className="list-group-item list-group-item-action py-2 ripple mb-2 text-start active"
                            aria-current="true"
                        >
                            <span>Quản lý khoa</span>
                        </Link>
                        <Link to="/major" className="list-group-item list-group-item-action mb-2 py-2 ripple text-start">
                            <span>Quản lý ngành</span>
                        </Link>
                        <Link to="/subject" className="list-group-item list-group-item-action mb-2 py-2 ripple text-start">
                            <span>Quản lý học phần</span>
                        </Link>
                        <div
                            className='list-group-item list-group-item-action ripple d-flex justify-content-between'
                            onClick={() => setToggle(!toggle)}
                        >
                            <span>Quản lý người dùng</span>
                            {
                                toggle ?
                                    <i className="fa-solid fa-caret-up text--white mt-1"></i>
                                :   <i className="fa-solid fa-caret-down text--white mt-1"></i>

                            }
                        </div>
                        {toggle &&
                            <div id='user-management-collapse' className='collapse show list-group list-group-flush'>
                                <Link
                                    to="/graduate-charge-person"
                                    className="list-group-item py-2 mb-2 text-start"

                                >
                                    <span className='ms-3'>Quản lý phụ trách KLTN</span>
                                </Link>
                                <Link
                                    to="/lecturer"
                                    className="list-group-item py-2 mb-2 text-start"

                                >
                                    <span className='ms-3'>Quản lý giáo viên</span>
                                </Link>
                                <Link
                                    to="/student"
                                    className="list-group-item list-group-item-action py-2 ripple mb-2 text-start"

                                >
                                    <span className='ms-3'>Quản lý sinh viên</span>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Sidebar;