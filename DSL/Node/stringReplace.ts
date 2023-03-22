import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

interface ReplaceStringBody {
    data: string;
    search: string;
    replace:string;
}
router.post('/string/replace', (req: Request, res: Response) => {
    let { data, search, replace }: ReplaceStringBody = req.body
    res.json(data.replaceAll(search, replace));
});
export default router;
