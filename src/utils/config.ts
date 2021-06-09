'use strict';

import dotenv from 'dotenv';
import os from 'os';

enum LOGLEVEL {
    INFO = 1,
    WARNING = 2,
    ERROR = 4,
    DEBUG = 8
}

dotenv.config();

const SQLITE = {
    file: process.env.SQLITE_FILE || 'database.sqlite3'
};

const SERVER_HTTP = {
    hostname: process.env.SERVER_LAN_HOSTNAME || '127.0.0.1',
    port: process.env.SERVER_LAN_PORT || 8080
};

const SERVER_HTTPS = {
    hostname: process.env.SERVER_SSL_HOSTNAME || '127.0.0.1',
    port: process.env.SERVER_SSL_PORT || 443,
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
};

const APP = {
    enabled: process.env.APP_DNS ? true : false,
    url: process.env.APP_DNS ? 'https://' + process.env.APP_DNS + '/' : undefined,
    vapid_private: process.env.VAPID_PRIVATE,
    vapid_public: process.env.VAPID_PUBLIC,
    vapid_mail: process.env.VAPID_EMAIL,
    jwt_key:
        'jwt' +
        process.env.TELEGRAM_BOT_TOKEN +
        process.env.FOLDER_IN +
        process.env.FOLDER_ARCHIVE +
        process.env.GEOBING_KEY +
        process.env.DWD_WARCELLID +
        process.env.FW_NAME_STANDBY +
        process.env.VAPID_PRIVATE +
        os.homedir() +
        os.platform() +
        os.hostname() +
        os.networkInterfaces(),
    jwt_expire: 60 * 60 * 24 * 31,
    password_length: 10
};

const TELEGRAM = {
    bot_token: process.env.TELEGRAM_BOT_TOKEN || ''
};

const FOLDERS = {
    diashow: './filesDiashow/',
    thumbnailPrefix: 'thumbnail-',

    fileInput: process.env.ALARM_FILE_FOLDER_IN,
    fileInput_delay: Number(process.env.ALARM_FILE_DELAY_IN || 0),
    fileInput_filter: process.env.ALARM_FILE_TEXTFILTER,

    archive: process.env.FOLDER_ARCHIVE || './filesArchive/',

    temp: './temp/'
};

const FWVV = {
    enabled: process.env.FWVV_DAT_FOLDER ? true : false,
    dat_folder: process.env.FWVV_DAT_FOLDER
};

const ALARM = {
    telegram: process.env.SENDALARM_TELEGRAM ? /true/i.test(process.env.SENDALARM_TELEGRAM) : false,
    app: process.env.SENDALARM_APP ? /true/i.test(process.env.SENDALARM_APP) : false
};

const PROGRAMS = {
    ghostscript: process.env.GHOSTSCRIPT_PATH,
    ghostscript_res: process.env.GHOSTSCRIPT_RESOLUTION || '500x500',

    tesseract: process.env.TESSERACT_PATH,

    foxit: process.env.READER_PATH
};

const PRINTING = {
    pagecountOriginal: Number(process.env.PRINT_FAX_ORIGINAL_PAGES || 0),
    pagecountAlarm: Number(process.env.PRINT_ALARM_PAGES || 0),

    printFile_fax: process.env.PRINT_FAX_ORIGINAL
        ? /true/i.test(process.env.PRINT_FAX_ORIGINAL)
        : false,
    printFile_email: process.env.PRINT_EMAIL_ORIGINAL
        ? /true/i.test(process.env.PRINT_EMAIL_ORIGINAL)
        : false,

    print_ipp_url: process.env.PRINT_IPP_URL,

    print_printername: process.env.PRINT_PRINTERNAME
};

const PAPER = {
    printer_path: process.env.PAPER_PRINTER_PATH,
    printer_regex: process.env.PAPER_PRINTER_REGEX
};

const COMMON = {
    fwName: process.env.FW_NAME_LONG || 'Freiwillige Feuerwehr Test',
    fwName_short: process.env.FW_NAME_SHORT || 'FF Test',

    dwd_warncellid: process.env.DWD_WARCELLID || '',
    ical_url: process.env.ICAL_LINK,

    time_alarm: Number(process.env.ALARM_VISIBLE) || 60,

    fw_position: !(process.env.FW_KOORD_LAT && process.env.FW_KOORD_LNG)
        ? undefined
        : { lat: process.env.FW_KOORD_LAT, lng: process.env.FW_KOORD_LNG }
};

const SCREEN = {
    screen_pos_dwd: Number(process.env.SCREEN_DWD_POS) || 0,
    screen_pos_calendar: Number(process.env.SCREEN_CALENDAR_POS) || 2,
    screen_verf: process.env.SCREEN_VERF ? /true/i.test(process.env.SCREEN_VERF) : false,
    screen_nverf: process.env.SCREEN_NVERF ? /true/i.test(process.env.SCREEN_NVERF) : false,
    screen_time_diashow: Number(process.env.DIASHOW_DELAY) || 15000
};

const GEOCODE = {
    bing: process.env.GEOBING_KEY ? true : false,
    bing_apikey: process.env.GEOBING_KEY,

    osm_nominatim: true,
    osm_objects: true,

    bahn: true,

    ors_key: process.env.ORS_KEY
};

const ALARMFIELDS = {
    s_EINSATZSTICHWORT: process.env.ALARMFIELDS_EINSATZSICHWORT_S || 'Stichwort :', // Filter Beginn
    e_EINSATZSTICHWORT: process.env.ALARMFIELDS_EINSATZSICHWORT_E || '\n', // Filter Ende
    s_SCHLAGWORT: process.env.ALARMFIELDS_SCHLAGWORT_S || 'Schlagw. :', // Filter Beginn
    e_SCHLAGWORT: process.env.ALARMFIELDS_SCHLAGWORT_E || '\n', // Filter Ende
    s_OBJEKT: process.env.ALARMFIELDS_OBJEKT_S || 'Objekt :', // Filter Beginn
    e_OBJEKT: process.env.ALARMFIELDS_OBJEKT_E || '\n', // Filter Ende
    s_BEMERKUNG: process.env.ALARMFIELDS_BEMERKUNG_S || 'BEMERKUNG', // Filter Beginn
    e_BEMERKUNG: process.env.ALARMFIELDS_BEMERKUNG_E || 'EINSATZHINWEIS', // Filter Ende
    s_STRASSE: process.env.ALARMFIELDS_STRASSE_S || 'Straße :', // Filter Beginn
    e_STRASSE: process.env.ALARMFIELDS_STRASSE_E || '\n', // Filter Ende
    s_ORTSTEIL: process.env.ALARMFIELDS_ORTSTEIL_S || 'Ortsteil :', // Filter Beginn
    e_ORTSTEIL: process.env.ALARMFIELDS_ORTSTEIL_E || '\n', // Filter Ende
    s_ORT: process.env.ALARMFIELDS_ORT_S || 'Gemeinde :', // Filter Beginn
    e_ORT: process.env.ALARMFIELDS_ORT_E || '\n', // Filter Ende
    s_EINSATZMITTEL: process.env.ALARMFIELDS_EINSATZMITTEL_S || 'EINSATZMITTEL', // Filter Beginn
    e_EINSATZMITTEL: process.env.ALARMFIELDS_EINSATZMITTEL_E || 'BEMERKUNG', // Filter Ende
    s_CAR: process.env.ALARMFIELDS_EINSATZMITTEL_ZEILE_S || 'Name :', // Filter Beginn
    e_CAR: process.env.ALARMFIELDS_EINSATZMITTEL_ZEILE_E || '\n', // Filter Ende
    CAR1: process.env.ALARMFIELDS_FW_NAME || '123456789123456789', // Filter um als eigenes Fahrzeug erkannt zu weden
    EMPTY: '-/-'
};

const LOG = {
    pad_namespace: 20,
    loglevel: LOGLEVEL.ERROR | LOGLEVEL.INFO | LOGLEVEL.WARNING | LOGLEVEL.DEBUG
};

const config = {
    version: '3.0.0',
    raspiversion: process.env.RASPIVERSION ? /true/i.test(process.env.RASPIVERSION) : false,
    sqlite: SQLITE,
    server_http: SERVER_HTTP,
    server_https: SERVER_HTTPS,
    telegram: TELEGRAM,
    app: APP,
    folders: FOLDERS,
    fwvv: FWVV,
    alarm: ALARM,
    programs: PROGRAMS,
    printing: PRINTING,
    geocode: GEOCODE,
    common: COMMON,
    alarmfields: ALARMFIELDS,
    logging: LOG,
    screen: SCREEN,
    paper: PAPER
};

export default config;
