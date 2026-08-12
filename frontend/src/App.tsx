import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import FindId from "./pages/auth/FindId";
import FindPassword from "./pages/auth/FindPassword";
import ChangeMyInfo from "./pages/auth/ChangeMyInfo";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import RobotManagement from "./pages/admin/RobotManagement";
import RobotDetails from "./pages/admin/RobotDetails";
import RobotRegistration from "./pages/admin/RobotRegistration";
import CollectionStatus from "./pages/admin/CollectionStatus";
import NotificationPage from "./pages/admin/NotificationPage";
import BookRegistration from "./pages/admin/BookRegistration";
import BookDetails from "./pages/BookDetails";
import MyBookShelf from "./pages/MyBookshelf";
import QrcodePage from "./pages/Barcode";
import MyPage from "./pages/MyPage";
import RobotHome from "./pages/admin/RobotHome";
import Header from "./components/common/Header";
import ToastList from "./components/common/ToastList";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen bg-snow">
              {location.pathname !== "/admin/robot/screen" && <Header />}
              <main
                className={`flex-grow ${
                  location.pathname === "/admin/robot/screen"
                    ? "w-[1024px] h-[600px] p-0 m-0 flex justify-center items-center bg-white"
                    : "p-4 bg-snow -mt-10"
                }`}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/find-id" element={<FindId />} />
                  <Route path="/find-password" element={<FindPassword />} />
                  <Route path="/book/:id" element={<BookDetails />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/my-info" element={<ChangeMyInfo />} />
                    <Route path="/bookshelf" element={<MyBookShelf />} />
                    <Route path="/qrcode" element={<QrcodePage />} />
                    <Route path="/my" element={<MyPage />} />
                  </Route>
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin/robot" element={<RobotManagement />} />
                    <Route path="/admin/robot/:id" element={<RobotDetails />} />
                    <Route
                      path="/admin/robot/add"
                      element={<RobotRegistration />}
                    />
                    <Route
                      path="/admin/collection"
                      element={<CollectionStatus />}
                    />
                    <Route
                      path="/admin/notification"
                      element={<NotificationPage />}
                    />
                    <Route path="/admin/add" element={<BookRegistration />} />
                    <Route path="/admin/robot/screen" element={<RobotHome />} />
                  </Route>
                </Routes>
              </main>
              <ToastList />
            </div>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
