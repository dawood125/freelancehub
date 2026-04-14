import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiLock,
  FiClock,
  FiRefreshCw,
  FiCheck,
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";
import gigService from "../../services/gigService";
import paymentService from "../../services/paymentService";

// ─── Load Stripe outside component to avoid re-creating on every render ───
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

// ─── CARD ELEMENT STYLING ───
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1e293b",
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
  hidePostalCode: true,
};

// ═══════════════════════════════════════════════════════
// CHECKOUT FORM (inner component that uses Stripe hooks)
// ═══════════════════════════════════════════════════════
const CheckoutForm = ({ gig, packageType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const selectedPkg = gig.packages[packageType] || gig.packages.basic;
  const subtotal = selectedPkg.price;
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please wait.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order + PaymentIntent on backend
      const response = await paymentService.createPaymentIntent({
        gigId: gig._id,
        packageType,
      });

      const { clientSecret, order } = response.data;

      // Step 2: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        // Card error (e.g., declined, insufficient funds)
        toast.error(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful! 🎉");
        navigate(`/orders/${order._id}`);
      } else {
        // Requires additional action (3D Secure, etc.)
        toast.error("Payment requires additional verification.");
        setIsProcessing(false);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
      setIsProcessing(false);
    }
  };

  const seller = gig.seller || {};
  const primaryImage = gig.images?.[0]?.url;

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to={`/gigs/${gig._id}`}
          className="inline-flex items-center gap-2 text-sm text-[color:var(--text-2)] hover:text-[color:var(--accent)] transition-colors mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to gig
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold text-[color:var(--text-1)] mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ─── LEFT: Order Summary (3 cols) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Gig Summary Card */}
            <div className="ui-card p-6">
              <h2 className="text-lg font-bold text-[color:var(--text-1)] mb-4">
                Order Summary
              </h2>

              <div className="flex gap-4 mb-5">
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={gig.title}
                    className="w-24 h-18 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-18 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎨</span>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-[color:var(--text-1)] text-sm leading-snug line-clamp-2">
                    {gig.title}
                  </h3>
                  <p className="text-xs text-[color:var(--text-2)] mt-1">
                    by {seller.name || "Seller"}
                  </p>
                </div>
              </div>

              {/* Package details */}
              <div className="bg-[color:var(--surface-soft)] rounded-xl p-4 space-y-3 border border-[color:var(--line)]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[color:var(--text-1)] capitalize">
                    {packageType} Package
                  </span>
                  <span className="text-sm font-extrabold text-[color:var(--text-1)]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {selectedPkg.description && (
                  <p className="text-xs text-[color:var(--text-2)] leading-relaxed">
                    {selectedPkg.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-[color:var(--text-2)]">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />
                    {selectedPkg.deliveryDays}-day delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <FiRefreshCw className="w-3.5 h-3.5" />
                    {selectedPkg.revisions === -1
                      ? "Unlimited"
                      : selectedPkg.revisions}{" "}
                    revision{selectedPkg.revisions !== 1 ? "s" : ""}
                  </span>
                </div>

                {selectedPkg.features?.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    {selectedPkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <FiCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-[color:var(--text-2)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="ui-card p-6">
              <h2 className="text-lg font-bold text-[color:var(--text-1)] mb-4">
                Price Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--text-2)]">
                    Subtotal ({packageType} package)
                  </span>
                  <span className="text-[color:var(--text-1)] font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--text-2)]">Service fee (10%)</span>
                  <span className="text-[color:var(--text-1)] font-medium">
                    ${serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-[color:var(--line)] pt-3 flex justify-between">
                  <span className="text-base font-bold text-[color:var(--text-1)]">
                    Total
                  </span>
                  <span className="text-base font-extrabold text-[color:var(--text-1)]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── RIGHT: Payment Form (2 cols) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-5">
                <FiLock className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-[color:var(--text-1)]">
                  Payment Details
                </h2>
              </div>

              {/* Stripe Card Element */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[color:var(--text-2)] mb-2">
                  Card Information
                </label>
                <div className="border border-[color:var(--line)] bg-[color:var(--surface-soft)] rounded-xl p-4 focus-within:border-[color:var(--accent)] focus-within:ring-1 focus-within:ring-[color:var(--accent)] transition-all">
                  <CardElement
                    options={CARD_ELEMENT_OPTIONS}
                    onChange={(e) => setCardComplete(e.complete)}
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing || !stripe || !cardComplete}
                className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing payment...
                  </>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </button>

              {/* Security notice */}
              <div className="mt-4 flex items-start gap-2 text-xs text-[color:var(--text-muted)]">
                <FiShield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Your payment is secured by Stripe. We never store your card
                  details. Money is held safely until you approve the delivery.
                </p>
              </div>

              {/* Test card info (dev only) */}
              {import.meta.env.DEV && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                  <p className="font-bold mb-1">🧪 Test Mode</p>
                  <p>Card: 4242 4242 4242 4242</p>
                  <p>Expiry: any future date • CVC: any 3 digits</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </form>
  );
};

// ═══════════════════════════════════════
// CHECKOUT PAGE (outer wrapper)
// ═══════════════════════════════════════
const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const gigId = searchParams.get("gig");
  const packageType = searchParams.get("package") || "basic";

  const [gig, setGig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth check
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    if (!gigId) {
      toast.error("Invalid checkout link");
      navigate("/gigs");
      return;
    }
    fetchGig();
  }, [gigId]);

  const fetchGig = async () => {
    try {
      const response = await gigService.getGig(gigId);
      const gigData = response.data.gig;

      // Verify package exists and is active
      if (!gigData.packages?.[packageType]) {
        toast.error("Selected package not found");
        navigate(`/gigs/${gigId}`);
        return;
      }
      if (packageType !== "basic" && !gigData.packages[packageType]?.isActive) {
        toast.error("Selected package is not available");
        navigate(`/gigs/${gigId}`);
        return;
      }

      setGig(gigData);
    } catch (error) {
      toast.error("Failed to load gig details");
      navigate("/gigs");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[color:var(--text-2)] text-sm">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-[color:var(--text-1)] mb-2">
            Something went wrong
          </h2>
          <Link
            to="/gigs"
            className="text-[color:var(--accent)] font-medium hover:opacity-80"
          >
            ← Browse services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <Elements stripe={stripePromise}>
        <CheckoutForm gig={gig} packageType={packageType} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;