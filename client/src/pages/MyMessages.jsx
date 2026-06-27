// pages/MyMessages.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";
import "../styles/messages.css";

function MyMessages() {

    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetch(`${API_BASE}/api/messages`, {
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                setConversations(data.conversations);
            }
        });

    }, []);

    return (
        <div>
            <h1>My Messages</h1>
            {conversations.map(conv => {

                const time = conv.time
                    ? new Date(conv.time).toLocaleString()
                    : "";

                return (
                    <div key={conv._id}
                        className={`conversation-card ${ conv.unread ? "unread" : "read" }`}
                        onClick={() => navigate(`/messages/${conv._id}`) }
                    >

                        <div className="conv-header">
                            <h3>{conv.name}</h3>
                            <small>{time}</small>
                        </div>

                        <p className="last-message">
                            {conv.lastMessage}
                        </p>
                    </div>
                );
            })}

        </div>
    );
}

export default MyMessages;