
import {
    Application,
    CandidatePlan,
    Payment,
} from "../models/index.js";

import calculateRefund from "../utils/refundCalculator.js";

const getRefundDetails = async (userId, paymentId) => {
    // 1. Find the candidate's successful payment.
    const payment = await Payment.findOne({
        where: {
            id: paymentId,
            userId,
            status: "SUCCESS",
        },
    });

    if (!payment) {
        throw new Error("Successful payment not found.");
    }

    // 2. Find the candidate plan purchased through this payment.
    const candidatePlan = await CandidatePlan.findOne({
        where: {
            paymentId: payment.id,
            userId,
        },
    });

    if (!candidatePlan) {
        throw new Error("Candidate plan not found for this payment.");
    }

    // 3. Count applications associated with this specific plan.
    const applicationCount = await Application.count({
        where: {
            candidatePlanId: candidatePlan.id,
        },
    });

    // 4. Calculate the refund.
    const refund = calculateRefund({
        payment,
        applicationCount,
    });

    return {
        paymentId: payment.id,
        candidatePlanId: candidatePlan.id,
        applicationCount,
        originalAmount: payment.amount,
        ...refund,
    };
};

export default getRefundDetails;