
const calculateRefund = ({
    payment,
    applicationCount,
    requestedAt = new Date(),
}) => {
    if (!payment || !payment.paidAt || !Number.isInteger(payment.amount)) {
        throw new Error("Invalid payment details for refund calculation.");
    }

    if (payment.amount <= 0) {
        throw new Error("Payment amount must be greater than zero.");
    }

    if (!Number.isInteger(applicationCount) || applicationCount < 0) {
        throw new Error("Invalid application count.");
    }

    const ONE_HOUR = 60 * 60 * 1000;

    const elapsedTime =
        new Date(requestedAt).getTime() -
        new Date(payment.paidAt).getTime();

    if (!Number.isFinite(elapsedTime) || elapsedTime < 0) {
        throw new Error("Invalid refund request time.");
    }

    let refundPercentage;
    let reason;

    // Application count has the highest priority.
    if (applicationCount > 20) {
        refundPercentage = 25;
        reason = "MORE_THAN_20_APPLICATIONS";
    } else if (elapsedTime <= ONE_HOUR) {
        refundPercentage = 100;
        reason = "WITHIN_ONE_HOUR";
    } else {
        refundPercentage = 50;
        reason = "AFTER_ONE_HOUR";
    }

    const refundAmount = Math.round(
        (payment.amount * refundPercentage) / 100
    );

    return {
        refundPercentage,
        refundAmount,
        reason,
    };
};

export default calculateRefund;