import React from "react";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./App.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import AboutMe from "./pages/AboutMe";
import Reviews from "./pages/Reviews";
import BookSession from "./pages/BookSession";
import MyAccount from "./pages/MyAccount";
import AccountInfoSection from "./components/MyAccount/MyAccountSection";
import ReviewsSection from "./components/ReviewsSection";
import SessionsSection from "./components/SessionsSection";
import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/CompleteProfile";
import AuthSuccess from "./pages/AuthSuccess";

axios.defaults.withCredentials = true;

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <NavBar />
        <Container className="mt-4">
          <Routes>
            <Route path="/about" element={<AboutMe />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/book/:date" element={<BookSession />} />
            <Route
              path="/book"
              element={
                <Navigate
                  to={`/book/${new Date().toISOString().split("T")[0]}`}
                  replace
                />
              }
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={`/book/${new Date().toISOString().split("T")[0]}`}
                  replace
                />
              }
            />
            <Route path="/account" element={<MyAccount />}>
              <Route path="my-account" element={<AccountInfoSection />} />
              <Route path="my-reviews" element={<ReviewsSection />} />
              <Route path="my-sessions" element={<SessionsSection />} />
              <Route index element={<AccountInfoSection />} />
            </Route>
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/complete-profile" element={<Profile />} />
          </Routes>
        </Container>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
