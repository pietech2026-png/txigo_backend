import express from 'express';
const router = express.Router();
import { 
    getDrivers, 
    getDriverDetails, 
    updateDriver, 
    verifyDocument,
    getDistinctStates,
    deleteDriver
} from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/', getDrivers);
router.get('/states', getDistinctStates);
router.get('/:id', getDriverDetails);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);
router.post('/:id/verify-document', verifyDocument);

export default router;
