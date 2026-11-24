
import { ApplicationPassPlan } from "../models/index.js";
import { STATUS_CODES } from "../utils/setConstants.js";

export const getPaymentPlans = async (req, res) => {
    try {
        const plans = await ApplicationPassPlan.findAll({
            where: {
                isActive: true,
            },
            attributes: [
                "id",
                "planCode",
                "name",
                "durationDays",
                "amount",
                "currency",
            ],
            order: [["amount", "ASC"]],
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            plans,
        });

    } catch (error) {
        console.error("Get Payment Plans Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to fetch payment plans",
        });
    }
};
