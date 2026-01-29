import { useState } from "react";
import { createSubscription, getSubscriptionStatus } from "../services/PaymentService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Subscription plan details
  const planDetails = {
    name: "Premium Monthly",
    price: 999,
    duration: "12 months",
    features: [
      "Unlimited access to all products",
      "Priority customer support",
      "Exclusive deals and discounts",
      "Free shipping on all orders",
      "Early access to new products"
    ]
  };

  const handleSubscribe = async () => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create subscription
      const response = await createSubscription({ userId });
      const { subscriptionId: subId, key } = response.data;
      
      setSubscriptionId(subId);

      // Step 2: Initialize Razorpay subscription
      const options = {
        key: key,
        subscription_id: subId,
        name: "Your Store Premium",
        description: "Monthly Subscription",
        handler: async function (response) {
          toast.success("Subscription activated! 🎉");
          
          // Webhook will handle backend updates
          // You can verify subscription status
          setTimeout(async () => {
            try {
              const statusRes = await getSubscriptionStatus(subId);
              console.log("Subscription status:", statusRes.data);
            } catch (err) {
              console.error("Failed to fetch status:", err);
            }
          }, 2000);

          navigate("/subscription/success");
        },
        prefill: {
          name: auth.username || "",
          email: auth.email || "",
          contact: auth.phone || ""
        },
        notes: {
          userId: userId
        },
        theme: {
          color: "#FBBF24"
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.error("Subscription cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Failed to create subscription");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Premium Subscription
      </h1>

      <div className="bg-gray-800 rounded-xl p-8 border-2 border-yellow-400">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{planDetails.name}</h2>
          <div className="text-4xl font-bold text-green-400 mb-2">
            ₹{planDetails.price}
            <span className="text-lg text-gray-400">/month</span>
          </div>
          <p className="text-gray-400">{planDetails.duration} commitment</p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
            What's Included:
          </h3>
          <ul className="space-y-3">
            {planDetails.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={processing}
          className="w-full bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Subscribe Now"}
        </button>

        {/* Terms */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            By subscribing, you agree to automatic monthly billing. 
            Cancel anytime from your account settings.
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-blue-900/30 rounded-lg p-6">
        <h3 className="font-semibold mb-3 text-blue-300">Subscription Benefits:</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>• Automatically renews every month</li>
          <li>• First charge happens immediately</li>
          <li>• Subsequent charges on the same date each month</li>
          <li>• Cancel anytime - no hidden fees</li>
          <li>• Secure payments via Razorpay</li>
        </ul>
      </div>
    </div>
  );
}