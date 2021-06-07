'use strict';

import { EventEmitter } from 'events';
import logging from '../utils/logging';

const NAMESPACE = 'GlobalEvents';

// globalEvents.on('alarm', (alarm: AlarmModel.AlarmRow) => { });

// globalEvents.on('softwareinfo', (text: string) => { });

// globalEvents.on('calendar-change', () => { });
// globalEvents.on('calendar-remind', () => { });

// globalEvents.on('diashow-change', () => { });

// globalEvents.on('userstatus-change', (userid: number) => { });

// globalEvents.on('paperstatus-change', (status: boolean) => { });

class GlobalEvents extends EventEmitter {
    public emit(event: string | symbol, ...args: any[]) {
        logging.debug(NAMESPACE, String(event) + ' emitted');
        return super.emit(event, ...args);
    }
}

const globalEvents = new GlobalEvents();

export default globalEvents;
