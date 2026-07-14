const validateLead = (req, res, next) => {
    const { name, email, phone, company, status, source, value, assignedTo } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (!phone) {
        return res.status(400).json({ error: 'Phone is required' });
    }
    if (!company) {
        return res.status(400).json({ error: 'Company is required' });
    }
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    if (!source) {
        return res.status(400).json({ error: 'Source is required' });
    }
    if (!assignedTo) {
        return res.status(400).json({ error: 'Assigned To is required' });
    }

    next();
};

export default validateLead;