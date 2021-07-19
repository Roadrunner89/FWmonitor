'use strict';

import axios from 'axios';
import logging from '../utils/logging';

const NAMESPACE = 'Hydrant_Service';

class HydrantService {
    public async find_latlng(lat: string, lng: string) {
        logging.debug(NAMESPACE, 'find_latlng', { lat, lng });

        // URL Overpass-API für Hydranten    siehe Ovepass turbo
        const overpassHydrantenUrl = `https://overpass-api.de/api/interpreter?data=
            [out:json][timeout:25];(
            node[%22emergency%22=%22fire_hydrant%22](around:3000,${lat},${lng});
            node[%22emergency%22=%22water_tank%22](around:3000,${lat},${lng});
            node[%22emergency%22=%22suction_point%22](around:3000,${lat},${lng});
            );out;%3E;out%20skel%20qt;`.replace(/[\n\s]/g, '');

        try {
            const response = await axios.get(overpassHydrantenUrl);
            const responseJSON = response.data;

            // Hydranten ausgeben
            const dataIn = responseJSON['elements'];
            const features = [];

            for (let i = 0; i < dataIn.length; i++) {
                const dataElement = dataIn[i];
                let name = '';

                name = dataElement['tags']['fire_hydrant:type'];
                if (dataElement['tags']['emergency'] == 'water_tank') name = 'water_tank';
                if (dataElement['tags']['water_source'] == 'pond') name = 'pond';
                if (dataElement['tags']['emergency'] == 'suction_point') name = 'pond';

                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [dataElement['lon'], dataElement['lat']]
                    },
                    properties: {
                        title: name,
                        iconcategory: 'icons'
                    }
                });
            }

            return features;
        } catch (error) {
            logging.exception(NAMESPACE, error);
            return;
        }
    }
}

export default new HydrantService();
