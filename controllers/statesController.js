const State = require('../model/State');
const statesData = require('../model/statesData.json');

const NON_CONTIG = ['AK', 'HI'];

const findStateData = (code) => statesData.find(st => st.code === code);

const getFunfactsForCode = async (code) => {
    const doc = await State.findOne({ stateCode: code }).exec();
    return doc?.funfacts || null;
};

const getAllStates = async (req, res) => {
    let data = statesData;
    if (req.query.contig === 'true') {
        data = statesData.filter(st => !NON_CONTIG.includes(st.code));
    } else if (req.query.contig === 'false') {
        data = statesData.filter(st => NON_CONTIG.includes(st.code));
    }

    const mongoStates = await State.find().exec();
    const merged = data.map(st => {
        const mongoEntry = mongoStates.find(m => m.stateCode === st.code);
        return { ...st, funfacts: mongoEntry?.funfacts || [] };
    });

    res.json(merged);
};

const getState = async (req, res) => {
    const state = findStateData(req.code);
    const funfacts = await getFunfactsForCode(req.code);
    res.json({ ...state, funfacts: funfacts || [] });
};

const getFunfact = async (req, res) => {
    const state = findStateData(req.code);
    const funfacts = await getFunfactsForCode(req.code);
    if (!funfacts?.length) {
        return res.json({
            message: `No Fun Facts found for ${state.state}`
        });
    }
    const random = funfacts[Math.floor(Math.random() * funfacts.length)];
    res.json({ funfact: random });
};

const getCapital = (req, res) => {
    const state = findStateData(req.code);
    res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = (req, res) => {
    const state = findStateData(req.code);
    res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = (req, res) => {
    const state = findStateData(req.code);
    res.json({
        state: state.state,
        population: state.population.toLocaleString('en-US')
    });
};

const getAdmission = (req, res) => {
    const state = findStateData(req.code);
    res.json({ state: state.state, admitted: state.admission_date });
};

const createFunfact = async (req, res) => {
    const { funfacts } = req.body;
    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    const existing = await State.findOne({ stateCode: req.code }).exec();
    let result;
    if (existing) {
        existing.funfacts = [...existing.funfacts, ...funfacts];
        result = await existing.save();
    } else {
        result = await State.create({ stateCode: req.code, funfacts });
    }
    res.json(result);
};

const updateFunfact = async (req, res) => {
    const { index, funfact } = req.body;
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const stateInfo = findStateData(req.code);
    const doc = await State.findOne({ stateCode: req.code }).exec();
    if (!doc?.funfacts?.length) {
        return res.json({
            message: `No Fun Facts found for ${stateInfo.state}`
        });
    }
    const i = index - 1;
    if (!doc.funfacts[i]) {
        return res.json({
            message: `No Fun Fact found at that index for ${stateInfo.state}`
        });
    }
    doc.funfacts[i] = funfact;
    const result = await doc.save();
    res.json(result);
};

const deleteFunfact = async (req, res) => {
    const { index } = req.body;
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const stateInfo = findStateData(req.code);
    const doc = await State.findOne({ stateCode: req.code }).exec();
    if (!doc?.funfacts?.length) {
        return res.json({
            message: `No Fun Facts found for ${stateInfo.state}`
        });
    }
    const i = index - 1;
    if (!doc.funfacts[i]) {
        return res.json({
            message: `No Fun Fact found at that index for ${stateInfo.state}`
        });
    }
    doc.funfacts = doc.funfacts.filter((_, idx) => idx !== i);
    const result = await doc.save();
    res.json(result);
};

module.exports = {
    getAllStates,
    getState,
    getFunfact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createFunfact,
    updateFunfact,
    deleteFunfact
};
