import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/profile/ProfilePage";
import GigsPage from "./pages/gigs/GigsPage";
import GigDetailPage from "./pages/gigs/GigDetailPage";
import CreateGigPage from "./pages/gigs/CreateGigPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";

const AppLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isAuthRoute = ["/login", "/register", "/verify-email", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password/");

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: theme === "dark" ? "#171b26" : "#ffffff",
            color: theme === "dark" ? "#e8eaf2" : "#111827",
            borderRadius: "14px",
            border: theme === "dark" ? "1px solid #262a35" : "1px solid #e6e9f3",
            boxShadow: theme === "dark"
              ? "0 12px 32px rgba(6, 8, 14, 0.45)"
              : "0 12px 32px rgba(15, 23, 42, 0.14)",
            padding: "14px 16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#3bd4b8", secondary: "#ffffff" },
          },
          error: {
            iconTheme: { primary: "#f97372", secondary: "#ffffff" },
          },
        }}
      />

      {!isAuthRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/gigs" element={<GigsPage />} />
          <Route path="/gigs/:id" element={<GigDetailPage />} />
          <Route path="/create-gig" element={<CreateGigPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </main>

      {!isAuthRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;