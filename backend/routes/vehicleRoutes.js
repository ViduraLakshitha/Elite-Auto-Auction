import express from 'express';
import { addVehicle, verifyVehicle } from '../controllers/vehicleController.js'; 
import { upload } from '../middleware/upload.js';  

const router = express.Router();

router.post('/add', upload, addVehicle);
router.patch('/verify/:id', verifyVehicle);

export default router;
