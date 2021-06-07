'use strict';

import express from 'express';
import statisticController from '../../controllers/statistic';
import { awaitHandlerFactory } from '../../middleware/awaitHandlerFactory';
import { auth_api, UserRights } from '../../middleware/auth';

const router = express.Router();

router.get('/:year', awaitHandlerFactory(statisticController.get_year.bind(statisticController)));
router.get(
    '/time/:id/:year',
    awaitHandlerFactory(statisticController.get_einsatzzeit.bind(statisticController))
);

export = router;
