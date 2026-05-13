const statesData = require('../model/statesData.json');

const stateCodes = statesData.map(st => st.code);

const verifyStates = (req, res, next) => {
    const code = req.params.state?.toUpperCase();
    if (!stateCodes.includes(code)) {
        return res.status(400).json({
            message: 'Invalid state abbreviation parameter'
        });
    }
    req.code = code;
    next();
};

module.exports = verifyStates;
