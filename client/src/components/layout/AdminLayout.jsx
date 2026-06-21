// client/src/components/layout/AdminLayout.jsx

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="admin-layout">

            <AdminNavbar onMenuClick={() => setSidebarOpen(true)}/>

            <div className="admin-body">
                <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="admin-content">
                    {children}
                </div>
            </div>

        </div>

    );
}

export default AdminLayout;