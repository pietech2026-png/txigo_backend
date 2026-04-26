const express = require('express');
const router = express.Router();
const { 
    getDrivers, 
    getDriverDetails, 
    updateDriver, 
    verifyDocument,
    getDistinctStates,
    deleteDriver
} = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDrivers);
router.get('/states', getDistinctStates);
router.get('/:id', getDriverDetails);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);
router.post('/:id/verify-document', verifyDocument);

module.exports = router;
