import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  dateTime,
} from '@grafana/data';

import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';

const QuakeSearchAPI = "https://quakesearch.geonet.org.nz/geojson?";

interface EqCatResponse {
  features: EqCatFeature[];
}

interface EqCatFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    publicid: string;
    origintime: Date;
    depth: number;
    magnitude: number;
    magnitudetype: string;
    evaluationmethod: string;
    evaluationstatus: string;
    evaluationmode: string;
    usedphasecount: number;
    usedstationcount: number;
    azimuthalgap: number;
    originerror: number;
  };
}

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery, from: number, to: number) {
    const fromDT = dateTime(from);
    const fromS = fromDT.toISOString();
    const toDT = dateTime(to);
    const toS = toDT.toISOString();

    // var dateOffset = (24*60*60*1000) * 90; //90 days in milliseconds
    // var startDate = new Date();
    // startDate.setTime(to - dateOffset);
    // const fromS = startDate.toISOString();
    
    var target_url: string;

    // bbox 
    target_url = QuakeSearchAPI + "bbox=" + query.bbox;
    
    // check for minimum magnitude (optional = 0)
    target_url = target_url + "&minmag=" + query.minmag  + "&maxmag=" + query.maxmag;

    // check for maximum depth (optional = 200)
    target_url = target_url + "&mindepth=" + query.mindepth  + "&maxdepth=" + query.maxdepth;
    
    // apply time range and distance from Point
    target_url = target_url + "&startdate=" + fromS + "&enddate=" + toS;

    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: target_url,
    });

    let eqcatResp = response.data as EqCatResponse;
    return eqcatResp.features;
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
            { name: 'public-id', type: FieldType.string },
            { name: 'origin-time', type: FieldType.time },
            { name: 'longitude', type: FieldType.number},
            { name: 'latitude', type: FieldType.number},
            { name: 'depth', type: FieldType.number},
            { name: 'magnitude', type: FieldType.number},
            { name: 'magnitude-type', type: FieldType.string },
            { name: 'evaluation-method', type: FieldType.string },
            { name: 'evaluation-status', type: FieldType.string },
            { name: 'evaluation-mode', type: FieldType.string },
            { name: 'used-phase-count', type: FieldType.number },
            { name: 'used-station-count', type: FieldType.number },
            { name: 'azimuthal-gap', type: FieldType.number},
            { name: 'origin-error', type: FieldType.number},
            { name: 'cumulative-count', type: FieldType.number},
          ],
        });

        // trick to get the cumulative count (go backward as earthquakes not sorted)
        var count = response.length + 1

        response.forEach((point: any) => {
          count = count - 1
          frame.appendRow([point.properties.publicid, 
                          point.properties.origintime, 
                          point.geometry.coordinates[0],
                          point.geometry.coordinates[1],
                          point.properties.depth,
                          point.properties.magnitude,
                          point.properties.magnitudetype,
                          point.properties.evaluationmethod,
                          point.properties.evaluationstatus,
                          point.properties.evaluationmode,
                          point.properties.usedphasecount,
                          point.properties.usedstationcount,
                          point.properties.azimuthalgap,
                          point.properties.originerror,
                          count,
                          ]);
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
