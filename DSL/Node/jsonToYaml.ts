import express, { Request, Response, Router } from 'express';
import multer from "multer";
import {stringify} from "yaml";
const router: Router = express.Router();

router.post('/', multer().array('file'), async (req: Request, res: Response) => {
    let result = stringify(req.body);
    res.json({"json": result});
});
export default router;
