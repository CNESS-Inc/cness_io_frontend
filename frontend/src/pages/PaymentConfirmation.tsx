import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConfirmPayment } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/Toast/ToastProvider";

const PaymentConfirmation: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            showToast({
                message: "Invalid payment session",
                type: "error",
                duration: 3000,
            });
            navigate("/dashboard/cart");
            return;
        }

        verifyPayment(sessionId);
    }, [searchParams]);

    const verifyPayment = async (sessionId: string) => {
        try {
            const response = await ConfirmPayment(sessionId);

            console.log("Payment confirmation response:", response);

            const data = response?.data?.data;
            const orderId = data?.order_id;

            if (data?.status === "succeeded" || data?.status === "completed") {
                // Payment successful - navigate to success page
                navigate("/dashboard/payment-success", {
                    state: {
                        orderDetails: data,
                    },
                });
            } else {
                // Payment failed - navigate to failed page with order_id for retry
                navigate("/dashboard/payment-failed", {
                    state: {
                        order_id: orderId,
                        message: data?.message || "Payment was not completed",
                    },
                });
            }
        } catch (error: any) {
            console.error("Payment confirmation error:", error);

            const errorMessage =
                error?.response?.data?.error?.message ||
                "Failed to verify payment status";

            showToast({
                message: errorMessage,
                type: "error",
                duration: 3000,
            });

            // Navigate to failed page
            navigate("/dashboard/payment-failed", {
                state: {
                    message: errorMessage,
                },
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isProcessing) {
        return null; 
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 font-[Poppins] text-[16px]">
                Processing your payment...
            </p>
            <p className="text-sm text-gray-500 mt-2 font-[Open_Sans]">
                Please do not close or refresh this window
            </p>
        </div>
    );
};

export default PaymentConfirmation;