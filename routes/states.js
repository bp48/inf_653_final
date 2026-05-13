const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statesController');
const verifyStates = require('../middleware/verifyStates');

router.get('/', ctrl.getAllStates);

router.route('/:state')
    .get(verifyStates, ctrl.getState);

router.route('/:state/funfact')
    .get(verifyStates, ctrl.getFunfact)
    .post(verifyStates, ctrl.createFunfact)
    .patch(verifyStates, ctrl.updateFunfact)
    .delete(verifyStates, ctrl.deleteFunfact);

router.get('/:state/capital', verifyStates, ctrl.getCapital);
router.get('/:state/nickname', verifyStates, ctrl.getNickname);
router.get('/:state/population', verifyStates, ctrl.getPopulation);
router.get('/:state/admission', verifyStates, ctrl.getAdmission);

module.exports = router;
