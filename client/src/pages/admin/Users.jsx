// client/src/pages/admin/Users.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import "../../styles/Admin.css"
import AdminTable from "../../components/admin/AdminTable";

function Users() {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);

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

    const handleSave = async () => {

        const res = await fetch(
            `${API_BASE}/api/admin/users/${editingUser._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(editingUser)
            }
        );
    
        const data = await res.json();
    
        if (data.success) {
    
            setUsers(prev =>
                prev.map(u =>
                    u._id === editingUser._id
                        ? data.user
                        : u
                )
            );
    
            setEditingUser(null);
        }
    };

    return (<div>
            <h1>Users</h1>
            <hr /><hr />

            <AdminTable
                columns={columns}
                data={users}
                actions={(user) => (
                    <>
                        <button
                            className="approve-btn"
                            onClick={() => setEditingUser(user)}
                        >
                            Edit
                        </button>

                        <button
                            className="reject-btn"
                        >
                            Delete
                        </button>
                    </>
                )}
            />

            {editingUser && (
                <div className="admin-edit">
                    <div className="modal-content">
            
                        <h2>Edit User</h2>
            
                        <input
                            value={editingUser.fullname}
                            onChange={(e) =>
                                setEditingUser({
                                    ...editingUser,
                                    fullname: e.target.value
                                })
                            }
                        />
            
                        <input
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({
                                    ...editingUser,
                                    email: e.target.value
                                })
                            }
                        />

                        <input
                            value={editingUser.role}
                            onChange={(e) =>
                                setEditingUser({
                                    ...editingUser,
                                    role: e.target.value
                                })
                            }
                        />
            
                        <input
                            value={editingUser.country}
                            onChange={(e) =>
                                setEditingUser({
                                    ...editingUser,
                                    country: e.target.value
                                })
                            }
                        />
            
                        <input
                            value={editingUser.phoneNumber}
                            onChange={(e) =>
                                setEditingUser({
                                    ...editingUser,
                                    phoneNumber: e.target.value
                                })
                            }
                        />
            
                        <button className="approve-btn" onClick={handleSave}>Save</button>
                        <button className="reject-btn" onClick={() => setEditingUser(null)}>Cancel</button>
            
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;