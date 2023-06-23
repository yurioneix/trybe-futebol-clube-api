import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';
import MatchService from '../services/MatchService';

const matchService = new MatchService();
const matchController = new MatchController(matchService);

const router = Router();

router.get('/home', (req: Request, res: Response) => matchController.getLeaderBoard(req, res));

export default router;
