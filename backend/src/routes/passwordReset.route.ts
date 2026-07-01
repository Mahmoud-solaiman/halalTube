import { Router } from "express";
import { checkOTP, resetPassword, sendOTP } from "../controllers/passwordReset.controller";

const router = Router();

router.post('/sendOTP', sendOTP);
router.post('/checkOTP', checkOTP);
router.post('/resetPassword', resetPassword);

export default router;