import { Router } from 'express';
import teamsRouter from './teams.routes';
import userRouter from './user.routes';
import matchRouter from './matches.routes';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', userRouter);
router.use('/matches', matchRouter);

export default router;
