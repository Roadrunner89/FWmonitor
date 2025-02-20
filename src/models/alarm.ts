'use strict';

import DatabaseConnection from '../database/connection';
import Model from './model';
import logging from '../utils/logging';

const NAMESPACE = 'Alarm_Model';
const TABLENAME = 'alarms';

type AlarmRow = {
    id: number | undefined;
    date: string;
    einsatznummer: string;
    einsatzstichwort: string;
    schlagwort: string;
    objekt: string;
    bemerkung: string;
    strasse: string;
    ortsteil: string;
    ort: string;
    lat: string;
    lng: string;
    cars1: string;
    cars2: string;
    isAddress: boolean;
    kreuzung: string;
    hinweis: string;
    prio: string;
    tetra: string;
    mitteiler: string;
    rufnummer: string;
    patient: string;
    einsatzplan: string;
};

interface StatisticRow {
    einsatzstichwort: string;
    count: number;
}

class AlarmModel extends Model {
    constructor() {
        super(TABLENAME);
    }

    /**
     * Findet einen Eintrag anhand der Suchparameter
     * @param params //{spalte: wert, ...}
     * @returns {Promise<undefined | CalendarRow[]}
     */
    public async find(
        params: Record<string, unknown> = {},
        limit: number = -1,
        offset: number = -1,
        extra?: string
    ): Promise<AlarmRow[]> {
        return await super.findElement<AlarmRow>(params, limit, offset, extra);
    }

    /**
     * Gibt die Häufigkeit der Stichworte für ein Jahr zurück
     */
    public async getStatistic(year?: number): Promise<StatisticRow[]> {
        logging.debug(NAMESPACE, 'getStatistic', { year: year });

        if (!year) year = new Date().getFullYear();

        const sql = `SELECT einsatzstichwort, count(einsatzstichwort) AS count FROM ${this.tablename} WHERE strftime('%Y', date)=@year GROUP BY einsatzstichwort ORDER BY count DESC`;

        const response = await DatabaseConnection.query<StatisticRow>(sql, {
            year: String(year)
        });

        return response != undefined ? response : [];
    }
}

const model = new AlarmModel();

export { AlarmRow, StatisticRow, model };
