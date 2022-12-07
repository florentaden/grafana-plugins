import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  // dateTime,
} from '@grafana/data';

import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';

// assuming the user is requesting a Broad Band Seismometer
const GeoNetSensorAPI = 'https://api.geonet.org.nz/network/sensor?';

type sensorTypeMap = { [id: string]: number };
const sensorTypeNames: sensorTypeMap = {
  accelerometer: 1,
  barometer: 2,
  broadband: 3,
  gnss: 4,
  hydrophone: 5,
  microphone: 6,
  pressure: 7,
  borehole: 8,
  short: 9,
  strong: 10,
};

interface GeoNetSensorResponse {
  features: GeoNetSensorFeature[];
}

interface GeoNetSensorFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    Network: string;
    Station: string;
    Location: string;
    Code: string; 
    Start: string;
    End: string;
    SensorType: string;
  };
}


export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery, from: number, to: number) {
    const sensor = query.sensor;
    const sensor_type = sensorTypeNames[sensor.toLowerCase()];
    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url:
        GeoNetSensorAPI +
        'sensorType=' +
        sensor_type +
        '&station=' +
        query.stationid 
    });

    // console.log(response.data as unknown as string);
    let fitsResp = response.data as GeoNetSensorResponse;
    return fitsResp.features;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    // Return a constant for each query.
    const promises = options.targets.map((query) =>
      this.doRequest(query, from, to).then((response) => {
        const frame = new MutableDataFrame({
          refId: query.refId,
          fields: [
            { name: 'network', type: FieldType.string },
            { name: 'code', type: FieldType.string },
            { name: 'location', type: FieldType.string },
            { name: 'name', type: FieldType.string},
            { name: 'start', type: FieldType.string },
            { name: 'end', type: FieldType.string },
            { name: 'sensor-type', type: FieldType.string},
            { name: 'longitude', type: FieldType.string},
            { name: 'latitude', type: FieldType.string},
          ],
        });
        response.forEach((point: any) => {
          frame.appendRow([point.properties.Network, 
                          point.properties.Code, 
                          point.properties.Location,
                          point.properties.Station,
                          point.properties.Start,
                          point.properties.End,
                          point.properties.SensorType,
                          point.geometry.coordinates[0],
                          point.geometry.coordinates[1]]);
        });

        return frame;
      })
    );

    return Promise.all(promises).then((data) => ({ data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
