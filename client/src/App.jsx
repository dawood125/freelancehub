import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Lazy pages for route-level code splitting
const HomePage = lazy(() => import("./pages/home/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const GigsPage = lazy(() => import("./pages/gigs/GigsPage"));
const GigDetailPage = lazy(() => import("./pages/gigs/GigDetailPage"));
const CreateGigPage = lazy(() => import("./pages/gigs/CreateGigPage"));
const OrdersPage = lazy(() => import("./pages/orders/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/orders/OrderDetailPage"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));
const MessagesPage = lazy(() => import("./pages/messages/MessagesPage"));

const RouteFallback = () => (
  <div className="min-h-[56vh] flex items-center justify-center px-4">
    <div className="glass-card rounded-2xl px-6 py-5 flex items-center gap-3">
      <div className="w-5 h-5 rounded-full border-2 border-[rgba(var(--accent-rgb),0.25)] border-t-[rgb(var(--accent-rgb))] animate-spin" />
      <p className="text-sm font-medium text-(--text-2)">Loading page...</p>
    </div>
  </div>
);

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

      <main className="grow">
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/messages" element={<MessagesPage />} />
          </Routes>
        </Suspense>
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