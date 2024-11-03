const { validationResult } = require('express-validator');

// General input validation middleware
exports.validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    next();
};
