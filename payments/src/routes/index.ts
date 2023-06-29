import express from "express";
import { signin, signout, signup } from "../controllers/user";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);

export default router;
