// cleint/src/pages/admin/UserVerification.jsx

import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import "../../styles/Admin.css"
import AdminTable from "../../components/admin/AdminTable";

function UserVerification(){
    const [users, setUsers] = useState([]);
    const approveUser = async (userId) => {
        const res = await fetch(
            `${API_BASE}/api/admin/users/${userId}/approve`,
            {
                method: "PUT",
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
    
        const data = await res.json();
    
        if (data.success) {
            alert("User verified");
        }
    };
    
    const rejectUser = async (id) => {
        await fetch(`${API_BASE}/api/admin/reject/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
    };

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setUsers(data.users);
            }
        });
    }, []);

    const pendingUsers = users.filter(
        users => users.verificationStatus === "pending"
    );
    const columns = [
        { key: "fullname", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "country", label: "Country" },
        { key: "phoneNumber", label: "Phone" }
    ];
    
    return (
        <div>
            <h1>Users Verification</h1>
            <hr /><hr />
            <AdminTable
                columns={columns}
                data={pendingUsers}
                actions={(user) => (
                    <>
                        <div>
                            <button className="approve-btn" onClick={() => approveUser(user._id)}>
                                Approve
                            </button>
            
                            <button className="reject-btn" onClick={() => rejectUser(user._id)}>
                                Reject
                            </button>
                        </div>
                    </>
                )}
            />
        </div>
    );
}

export default UserVerification;