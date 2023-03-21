import express, { Request, Response, Router } from 'express';
import multer from "multer";
import {parse} from "yaml";
const router: Router = express.Router();

router.post('/', multer().array('file'), async (req: Request, res: Response) => {
    const file = base64ToText(req.body.file);
    let result = parse(file);
    res.send(result);
});
export default router;
