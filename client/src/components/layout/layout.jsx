// client/src/components/layout/Layout.jsx
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css"

function Layout({ children }) {

    const { user } = useAuth();

    const isAdmin = user?.role === "admin";

    return (
        <div className="app-wrapper">

            {/* ADMIN LAYOUT */}
            {isAdmin ? (
                <div className="admin-layout">
                    <AdminSidebar />
                    <main className="admin-content">
                        {children}
                    </main>
                </div>
            ) : (
                <>
                    <NavigationBar />

                    <main className="content">
                        <div className="page-container">
                            {children}
                        </div>
                    </main>

                    <Footer />
                </>
            )}

        </div>
    );
}

export default Layout;