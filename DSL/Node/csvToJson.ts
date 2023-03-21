import express, { Request, Response, Router } from 'express';
import multer from "multer";
import Papa from "papaparse";
const router: Router = express.Router();

router.post('/', multer().array('file'), async (req: Request, res: Response) => {
    const file = base64ToText(req.body.file);
    let result = Papa.parse(file, {skipEmptyLines: true});
    res.send(result.data);
});
export default router;
