import express, { Request, Response, Router } from 'express';
import multer from "multer";
import {parse, stringify} from "yaml";
import Papa from "papaparse";
const router: Router = express.Router();


router.post('/yaml-to-json', multer().array('file'), async (req: Request, res: Response) => {
    const file = base64ToText(req.body.file);
    let result = parse(file);
    res.send(result);
});

router.post('/json-to-yaml', multer().array('file'), async (req: Request, res: Response) => {
    let result = stringify(req.body);
    res.json({"json": result});
});

function base64ToText(base64String: string): string {
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
}

router.post('/csv-to-json', multer().array('file'), async (req: Request, res: Response) => {
    const file = base64ToText(req.body.file);
    let result = Papa.parse(file);
    res.send(result.data);
});
export default router;
