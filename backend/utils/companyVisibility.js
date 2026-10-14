import { RecruiterProfile, UserPreference } from "../models/index.js";

export const getHiddenCompanyIds = async (companyIds) => {
    const ids = [...new Set(companyIds.filter(Boolean))];
    if (ids.length === 0) return new Set();

    const recruiters = await RecruiterProfile.findAll({
        where: { companyId: ids },
        attributes: ["companyId", "userId"],
    });
    if (recruiters.length === 0) return new Set();

    const preferences = await UserPreference.findAll({
        where: { userId: [...new Set(recruiters.map(({ userId }) => userId))] },
        attributes: ["userId", "privacySettings"],
    });
    const visibilityByUser = new Map(preferences.map(({ userId, privacySettings }) => [
        userId,
        privacySettings?.companyVisibility !== false,
    ]));
    const recruitersByCompany = new Map();
    recruiters.forEach(({ companyId, userId }) => {
        const companyRecruiters = recruitersByCompany.get(companyId) || [];
        companyRecruiters.push(userId);
        recruitersByCompany.set(companyId, companyRecruiters);
    });

    return new Set([...recruitersByCompany.entries()]
        .filter(([, userIds]) => userIds.every((userId) => visibilityByUser.get(userId) === false))
        .map(([companyId]) => companyId));
};
