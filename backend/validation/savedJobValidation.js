import Joi from "joi";

const saveJobSchema = Joi.object({
    jobId: Joi.number()
        .integer()
        .positive()
        .required(),
});

export { saveJobSchema };
