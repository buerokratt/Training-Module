import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();

interface SplitStringBody {
    data: string;
    separator: string;
}
router.post('/', (req: Request, res: Response) => {
    let { data, separator }: SplitStringBody = req.body
    res.send(data.split(separator).filter(function(n){return n; })); // filter removes empty array elements.
});
export default router;
