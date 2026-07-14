const leadToCustomerValidation = (req, res, next) => {
    const status = req.body.status;
    if (status === 'converted') {
        return res.status(400).json({ error: 'Cant be modified because it is already converted' });
    }
    next();
};

export default leadToCustomerValidation;