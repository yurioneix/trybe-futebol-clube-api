import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';
import MatchService from '../services/MatchService';
import Validations from '../middlewares/Validations';

const matchService = new MatchService();
const matchController = new MatchController(matchService);

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.getInProgressMatches(req, res));

router.patch(
  '/:id',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);

router.patch(
  '/:id/finish',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

router.post(
  '/',
  Validations.validateToken,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);

export default router;
