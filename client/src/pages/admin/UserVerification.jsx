import { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import "../../styles/Admin.css"
import AdminTable from "../../components/admin/AdminTable";

function UserVerification(){
    const [users, setUsers] = useState([]);
    const approveUser = async (id) => {
        await fetch(`${API_BASE}/api/admin/verify/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
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
    
    return (
        <table>
            <tbody>
                {pendingUsers.map(user => (
                    <tr key={user._id}>
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{user.country}</td>
                        <td>
                            <button onClick={() => approveUser(user._id)}>
                                Approve
                            </button>

                            <button onClick={() => rejectUser(user._id)}>
                                Reject
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default UserVerification;