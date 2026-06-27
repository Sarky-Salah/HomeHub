// pages/Message.jsx
import { useParams , useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config/api";
import { FaPhoneAlt, HiDotsVertical, IoArrowBack, FaRegUser } from "../../src/icons/index.js";
import "../styles/messages.css";

function Message() {

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [text, setText] = useState("");
    
    useEffect(() => {
        if (!id || !user) return;
        fetch(
            `${API_BASE}/api/messages/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMessages(data.messages || []);
                setConversation(data.conversation);
            }
        })
        .catch(err => console.log(err));
    }, [id, user]);

    const sendMessage = async () => {
        if (!text.trim()) return;
        const res = await fetch(
            `${API_BASE}/api/messages/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    text
                })
            }
        );
        const data = await res.json();
        if (data.success) {
            setMessages(prev => [
                ...prev,
                data.message
            ]);
            setText("");
        }
    };

    const otherUser =
    conversation?.participants?.find(
        p => String(p._id) !== String(user._id)
    );

    const avatarLetter =
        otherUser?.fullname?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="chat-container">
            <div className="chat-header">
                {/* BACK BUTTON */}
                <button
                    className="icon-btn"
                    onClick={() => navigate(-1)}
                >
                    <IoArrowBack />
                </button>

                {/* USER INFO */}
                <div className="chat-user-info">
                    {/* Avatar (first letter) */}
                    <div className="chat-avatar">
                        {avatarLetter}
                    </div>

                    {/* Name */}
                    <div className="chat-name">
                        {otherUser?.fullname}
                    </div>
                </div>

                {/* ACTION ICONS */}
                <div className="chat-actions">

                    {/* CALL */}
                    <button
                        className="icon-btn"
                        onClick={() => {
                            if (otherUser?.phone) {
                            window.location.href = `tel:${otherUser.phone}`;
                        }}}
                    >
                        <FaPhoneAlt />
                    </button>

                    {/* OPTIONS */}
                    <button
                        className="icon-btn"
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        <HiDotsVertical />
                    </button>
                    {showMenu && (
                        <div className="chat-menu">
                            <button onClick={() => navigate(`/profile/${otherUser?._id}`)} >                                
                                <FaRegUser /> View Profile
                            </button>

                            <button onClick={() => { alert("Block feature coming soon.");}} >
                                🚫 Block User
                            </button>

                            <button onClick={() => { alert("Report feature coming soon.");}} >
                                ⚠ Report User
                            </button>

                        </div>
                    )}
                </div>
            </div>
            <div className="chat-messages">
                {messages.map(msg => {

                    const isMine = String(msg.sender._id) === String(user._id);

                    return (
                        <div
                            key={msg._id}
                            className={`message-row ${isMine ? "mine" : "other"}`}
                        >
                            <div className="message-bubble">
                                <strong> {msg.sender.fullname} </strong>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type message..."
                    value={text}
                    onChange={(e) =>
                        setText(e.target.value)
                    }
                />

                <button onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Message;