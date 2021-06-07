'use strict';

import express from 'express';
import DiashowController from '../../controllers/diashow';
import { awaitHandlerFactory } from '../../middleware/awaitHandlerFactory';
import * as ValidatorDiashow from '../../middleware/diashowValidator';
import config from '../../utils/config';
import { auth_api, UserRights } from '../../middleware/auth';

const router = express.Router();

router.get(
    '/list',
    auth_api(UserRights.admin, UserRights.http),
    awaitHandlerFactory(DiashowController.get_list.bind(DiashowController))
);

router.post(
    '/enable',
    auth_api(UserRights.admin),
    ValidatorDiashow.enable_pic,
    awaitHandlerFactory(DiashowController.enable_pic.bind(DiashowController))
);

router.post(
    '/disable',
    auth_api(UserRights.admin),
    ValidatorDiashow.disable_pic,
    awaitHandlerFactory(DiashowController.disable_pic.bind(DiashowController))
);

router.post(
    '/delete',
    auth_api(UserRights.admin),
    ValidatorDiashow.delete_pic,
    awaitHandlerFactory(DiashowController.delete_pic.bind(DiashowController))
);

router.get(
    '/files/full/:file',
    auth_api(UserRights.admin, UserRights.http),
    async function (req, res) {
        res.sendFile(req.params.file, {
            root: config.folders.diashow
        });
    }
);

router.get('/files/:file', auth_api(UserRights.admin, UserRights.http), async function (req, res) {
    res.sendFile(config.folders.thumbnailPrefix + req.params.file, {
        root: config.folders.diashow
    });
});

export = router;
