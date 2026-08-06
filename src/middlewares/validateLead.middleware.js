import { leadValidationSchema } from '../validations/lead.validations.js';

const validateLead = (req, res, next) => {

    const result = leadValidationSchema.safeParse(req.body);

    if (!result.success) {

        return res.status(400).json({
            success: false,
            errors: result.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }))
        });

    }

    req.body = result.data;

    next();
};

export default validateLead;