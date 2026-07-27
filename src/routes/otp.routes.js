import {Router} from "express";

import * as otpController from "../controllers/otp.controller.js";


const router = Router();

router.post("/send-otp", otpController.sendOTP);

export default router;