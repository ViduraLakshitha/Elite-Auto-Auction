import express from 'express';
import {Admin} from '../model/admin.js';
import { getAllUsers, deleteUser } from "../controllers/adminController.js";
import { getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/profile", getAdminProfile);
router.put("/profile/", updateAdminProfile);

//route for save a new admin
router.post('/', async (req,res) => {
    try {
        if(
            !req.body.name ||
            !req.body.email ||
            !req.body.password
        ){
            return res.status(400).send({message: "send all required fields: name, email, password"});
        }
        
        const newAdmin = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        };

        const admin = await Admin.create(newAdmin);

        return res.status(201).send(admin);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
        
    }
})

export default router;