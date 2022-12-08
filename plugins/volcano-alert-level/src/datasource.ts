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

const GeoNetAPI = "https://api.geonet.org.nz/volcano/val";

interface AltVolResponse {
  features: AltVolFeature[];
}

interface AltVolFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    acc: string;
    activity: string;
    hazards: string;
    level: number;
    volcanoID: string;
    volcanoTitle: string;
  };
}

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery, from: number, to: number) {

    const target_url = GeoNetAPI; // no need to add anything
    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: target_url,
    });

    let altvolResp = response.data as AltVolResponse;
    return altvolResp.features;
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
            { name: 'volcanoTitle', type: FieldType.string},
            { name: 'volcanoID', type: FieldType.string},
            { name: 'alert_color', type: FieldType.string},
            { name: 'acc', type: FieldType.string },
            { name: 'activity', type: FieldType.string },
            { name: 'hazards', type: FieldType.string},
            { name: 'level', type: FieldType.number},
            { name: 'longitude', type: FieldType.string},
            { name: 'latitude', type: FieldType.string },
          ],
        });

        response.forEach((point: any) => {
          if ( point.properties.volcanoID === query.volcanoID ) {
            let alert_color: string;
            if ( point.properties.level === 0 ) {
              alert_color = "#E7DEEC";
            } else if ( point.properties.level === 1 ) {
              alert_color = "#DCC9E0";
            } else if ( point.properties.level === 2 ) {
              alert_color = "#D1B5D3";
            } else {
              alert_color = "White";
            }
            frame.appendRow([point.properties.volcanoTitle, 
                            point.properties.volcanoID, 
                            alert_color,
                            point.properties.acc,
                            point.properties.activity,
                            point.properties.hazards,
                            point.properties.level,
                            point.geometry.coordinates[0],
                            point.geometry.coordinates[1],
                            ]);
                        }
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
