import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Sidebar = () => {
    

    return (
        <>
            <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
                <div className="position-sticky">
                    <div className="list-group list-group-flush mt-4">
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
                        <Link to="/major" className="list-group-item list-group-item-action mb-2 py-2 ripple text-start">
                            <span>Quản lý giáo viên</span>
                        </Link>
                        <Link to="/major" className="list-group-item list-group-item-action mb-2 py-2 ripple text-start">
                            <span>Quản lý học phần</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;