// client/src/App.js

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { io } from "socket.io-client";
import { useEffect } from "react";
import Layout from "./components/layout/layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyMessages from "./pages/My Messages";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboards from "./pages/admin/AdminDashboards";
import Users from "./pages/admin/Users";
import UserVerification from "./pages/admin/UserVerification";
import Property from "./pages/admin/Property";
import Uploads from "./pages/admin/Uploads";
import Database from "./pages/admin/Database";
import Messages from "./pages/admin/Messages";
import Ads from "./pages/admin/Ads";
import Visualization from "./pages/admin/Visualization";
import ReportsAndAnalytics from "./pages/admin/Reports&Analytics";
import Feedback from "./pages/admin/Feedback";
import AdminProfile from "./pages/admin/AdminProfile";
import Settings from "./pages/admin/Settings";
import AdminLayout from "./components/layout/AdminLayout";

import TenantDashboard from "./pages/tenant/TenantDashboard";

import LandlordDashboard from "./pages/landlord/landlordDashboard";
import AddProperties from "./pages/landlord/AddProperties";
import Properties from "./pages/landlord/Properties";
import PropertyDetails from "./pages/landlord/PropertyDetails";
import MyProperties from "./pages/landlord/MyProperties";


function AppContent() {
    const { user } = useAuth();

    const isAdmin = user?.role === "admin";    

    useEffect(() => {
        if (!user || !user._id) return;
    
        const socket = io("http://192.168.100.5:5000");
    
        socket.connect(); // 🔥 THIS IS THE MISSING PIECE
    
        socket.emit("user-online", user._id);
        
        socket.on("connect", () => {
            console.log("CONNECTED:", socket.id);  
            console.log("USER:", user);
        });
    
        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <>
            {isAdmin ? (
                <AdminLayout>
                    <Routes>
                        <Route path="*" element={<h1>Route Not Found</h1>} />
                        <Route path="/dashboard-admin" element={<AdminDashboards />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/user-verification" element={<UserVerification />} />
                        <Route path="/property" element={<Property />} />
                        <Route path="/uploads" element={<Uploads />} />
                        <Route path="/database" element={<Database />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/ads" element={<Ads />} />
                        <Route path="/visualization" element={<Visualization />} />
                        <Route path="/reportsandanalytics" element={<ReportsAndAnalytics />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/adminprofile" element={<AdminProfile />} />
                    </Routes>
                </AdminLayout>
            ) : (
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/dashboard-tenant" element={
                            <ProtectedRoute allowedRoles={["tenant"]}>
                                <TenantDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/dashboard-landlord" element={
                            <ProtectedRoute allowedRoles={["landlord"]}>
                                <LandlordDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/add-property" element={
                            <ProtectedRoute allowedRoles={["landlord", "admin"]}>
                                <AddProperties />
                            </ProtectedRoute>
                        } />

                        <Route
                            path="/my-properties"
                            element={
                                <ProtectedRoute allowedRoles={["landlord", "admin"]}>
                                    <MyProperties />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/property/:id" element={
                            <ProtectedRoute allowedRoles={["tenant","landlord","admin"]}>
                                <PropertyDetails />
                            </ProtectedRoute>
                        } />

                        <Route path="/properties" element={
                            <ProtectedRoute allowedRoles={["tenant","landlord","admin"]}>
                                <Properties />
                            </ProtectedRoute>
                        } />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/adminprofile"
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <AdminProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute allowedRoles={["tenant","landlord"]}>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-messages"
                            element={
                                <ProtectedRoute allowedRoles={["admin","tenant","landlord"]}>
                                    <MyMessages />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            )}
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}