'use strict';

import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/httpException';
import HttpStatusCodes from '../utils/httpStatusCodes';
import { checkValidation } from './controller';
import { AlarmRow } from '../models/alarm';
import AlarmService from '../services/alarm';
import userService from '../services/user';
import groupService from '../services/group';
import { instance as DeviceServiceInstance } from '../services/device';
import logging from '../utils/logging';

const NAMESPACE = 'Alarm_Controller';

class AlarmController {
    /**
     * Entfernt nicht für den User freigegebene Infos aus den AlarmRows
     * @param list
     * @param userid
     * @returns
     */
    private async cleanAlarmInfos(list: AlarmRow[], userid: number): Promise<AlarmRow[]> {
        const user = await userService.find_by_userid(userid);
        if (!user || user.length < 1) {
            throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
        }

        const group = await groupService.find_by_id(user[0].group);
        if (!group || group.length < 1) {
            throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Group not found');
        }

        const pattern = group[0].pattern;

        for (let i = 0; i < list.length; i++) {
            list[i].einsatzstichwort =
                pattern.indexOf('{{EINSATZSTICHWORT}}') !== -1 ? list[i].einsatzstichwort : '';
            list[i].schlagwort = pattern.indexOf('{{SCHLAGWORT}}') !== -1 ? list[i].schlagwort : '';
            list[i].objekt = pattern.indexOf('{{OBJEKT}}') !== -1 ? list[i].objekt : '';
            list[i].strasse = pattern.indexOf('{{STRASSE}}') !== -1 ? list[i].strasse : '';
            list[i].ortsteil = pattern.indexOf('{{ORTSTEIL}}') !== -1 ? list[i].ortsteil : '';
            list[i].ort = pattern.indexOf('{{ORT}}') !== -1 ? list[i].ort : '';
            list[i].bemerkung = pattern.indexOf('{{BEMERKUNG}}') !== -1 ? list[i].bemerkung : '';
            list[i].cars1 = pattern.indexOf('{{EINSATZMITTEL_EIGEN}}') !== -1 ? list[i].cars1 : '';
            list[i].cars2 = pattern.indexOf('{{EINSATZMITTEL_ANDERE}}') !== -1 ? list[i].cars2 : '';
            list[i].lat = pattern.indexOf('{{KARTE}}') !== -1 ? list[i].lat : '';
            list[i].lng = pattern.indexOf('{{KARTE}}') !== -1 ? list[i].lng : '';
        }

        return list;
    }

    /**
     * Findet einen Alarm anhand der Alarmid
     */
    public async get_id(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_alarm_id', { id: req.params.id });
        checkValidation(req);

        let list = await AlarmService.find_by_id(Number(req.params.id));
        if (!list) {
            throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Alarm not found');
        }

        // Alarmfarbe hintufügen
        for (let i = 0; i < list.length; i++) {
            (list[i] as any)['color'] = AlarmService.getAlarmColor(list[i].einsatzstichwort);
        }

        // Prüfe ob Bildschirm oder Auto
        if (!req.session.userid || req.session.car == true) {
            res.send(list);
            return;
        }

        res.send(await this.cleanAlarmInfos(list, req.session.userid));
    }

    /**
     * Findet den letzten Alarm
     */
    public async get_last(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_last');

        let list = await AlarmService.find({}, 1, 0, 'ORDER BY id DESC');
        if (!list) {
            throw new HttpException(HttpStatusCodes.NOT_FOUND, 'No Alarm found');
        }

        // Alarmfarbe hinzufügen
        for (let i = 0; i < list.length; i++) {
            (list[i] as any)['color'] = AlarmService.getAlarmColor(list[i].einsatzstichwort);
        }

        // Prüfe ob Bildschirm oder Auto
        if (!req.session.userid || req.session.car == true) {
            res.send(list);
            return;
        }

        res.send(await this.cleanAlarmInfos(list, req.session.userid));
    }

    /**
     * Alarmliste auslesen
     */
    public async get_list(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_list', { limit: req.query.limit, offset: req.query.offset });
        checkValidation(req);

        let list = await AlarmService.find(
            {},
            Number(req.query.limit),
            Number(req.query.offset),
            'ORDER BY date DESC'
        );
        if (!list) {
            throw new HttpException(HttpStatusCodes.NOT_FOUND, 'No Alarm found');
        }

        // Alarmfarbe hinzufügen
        for (let i = 0; i < list.length; i++) {
            (list[i] as any)['color'] = AlarmService.getAlarmColor(list[i].einsatzstichwort);
        }

        // Prüfe ob Bildschirm oder Auto
        if (!req.session.userid || req.session.car == true) {
            res.send(list);
            return;
        }

        res.send(await this.cleanAlarmInfos(list, req.session.userid));
    }

    /**
     * Alarm Sendeinstellungen Telegram
     */
    public async update_alarmsettings_telegram(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'update_alarm_telegram', {
            value: req.body.value
        });
        checkValidation(req);

        AlarmService.set_alarmsettings_telegram(Boolean(req.query.value));

        res.send('OK');
    }

    /**
     * Alarm Sendeinstellungen APP
     */
    public async update_alarmsettings_app(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'update_alarm_app', {
            value: req.body.value
        });
        checkValidation(req);

        AlarmService.set_alarmsettings_app(Boolean(req.query.value));

        res.send('OK');
    }

    /**
     * Alarm Sendeinstellungen auslesen
     */
    public async get_alarmsettings(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_alarmsettings');

        const response = AlarmService.get_alarmsettings();

        res.send(response);
    }

    /**
     * Ist aktuell ein Alarm anstehend
     */
    public async get_isAlarm(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_isAlarm');

        const response = await AlarmService.isAlarm();

        res.send({ isAlarm: response });
    }

    /**
     * Alarm Rückmeldung
     */
    public async update_userstatus(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'update_userstatus', {
            userid: req.params.id,
            alarmid: req.body.alarmid,
            value: req.body.value
        });
        checkValidation(req);

        if (!DeviceServiceInstance) {
            throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Error');
        }

        const reponse = DeviceServiceInstance.broadcast_userstatus(
            Number(req.params.id),
            Number(req.body.alarmid),
            Boolean(req.body.value)
        );

        res.send('OK');
    }

    public async get_streetCache(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_streetCache');

        const response = await AlarmService.get_streetCache(Number(req.params.id));

        res.send(response);
    }

    public async get_route(req: Request, res: Response, next: NextFunction) {
        logging.debug(NAMESPACE, 'get_route');

        const response = await AlarmService.get_route(Number(req.params.id));

        res.send(response);
    }
}

export default new AlarmController();
