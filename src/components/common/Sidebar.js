import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div>
            <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-white">
                <div class="position-sticky">
                    <div class="list-group list-group-flush mx-3 mt-4">
                        <Link
                            to="/department"
                            class="list-group-item list-group-item-action py-2 ripple active mb-2"
                            aria-current="true"
                        >
                            <span>Quản lý khoa</span>
                        </Link>
                        <Link to="/major" class="list-group-item list-group-item-action py-2 ripple ">
                            <span>Quản lý ngành</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;