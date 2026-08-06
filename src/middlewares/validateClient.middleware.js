import { clientValidationSchema } from "../validations/client.validation.js";

export const validateClient = (req, res, next) => {

    const result = clientValidationSchema.safeParse(req.body);

    if (!result.success) {

        const errorMessages = result.error.issues.map(
            issue => issue.message
        );

        return res.status(400).json({
            success: false,
            errors: errorMessages
        });
    }

    req.body = result.data;

    next();
};