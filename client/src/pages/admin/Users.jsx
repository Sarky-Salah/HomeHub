// client/src/pages/admin/Users.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import "../../styles/Admin.css"
import AdminTable from "../../components/admin/AdminTable";

function Users() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetch(`${API_BASE}/api/admin/users`, {
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUsers(data.users);
            }
        });

    }, []);

    const columns = [
        { key: "fullname", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "country", label: "Country" },
        { key: "phoneNumber", label: "Phone" }
    ];

    return (
        <AdminTable
            title="Users"
            columns={columns}
            data={users}
            actions={(user) => (
                <>
                    <button
                        className="action-btn"
                    >
                        Edit
                    </button>

                    <button
                        className="action-btn"
                    >
                        Delete
                    </button>
                </>
            )}
        />
    );
}

export default Users;