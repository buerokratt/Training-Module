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
interface SplitStringBody {
    data: string;
    separator: string;
}
router.post('/string/split', (req: Request, res: Response) => {
    let { data, separator }: SplitStringBody = req.body
    console.log(req.body);
    res.send(data.split(separator).filter(function(n){return n; })); // filter removes empty array elements.
});

interface ReplaceStringBody {
    data: string;
    search: string;
    replace:string;
}
router.post('/string/replace', (req: Request, res: Response) => {
    let { data, search, replace }: ReplaceStringBody = req.body
    console.log(search);
    res.json(data.replaceAll(search, replace));
});
export default router;
