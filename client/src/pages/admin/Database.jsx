import { useEffect, useState } from "react";
import API_BASE from "../../config/api";

function Database() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/admin/database/collections`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCollections(data.collections);
            }
        })
        .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Database Collections</h1>

            <ul>
                {collections.map((col, index) => (
                    <li key={index}>{col}</li>
                ))}
            </ul>
        </div>
    );
}

export default Database;