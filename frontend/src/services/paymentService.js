import api from "./api";

export const getPaymentPlans = async () => {
    const response = await api.get("/payment/plans");
    return response.data;
};

export const createCheckoutSession = async (planId) => {
    const response = await api.post("/payment/checkout-session", {
        planId,
    });
    return response.data;
};

export const getMySubscription = async () => {
    const response = await api.get("/payment/my-plan");
    return response.data;
};

export const verifyCheckoutSession = async(sessionId) =>{
    const response = await api.get("/payment/verify-session",{
        params:{
            session_id: sessionId,
        },
    });
    return response.data;
};