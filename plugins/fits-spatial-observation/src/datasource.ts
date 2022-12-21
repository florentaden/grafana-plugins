
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

const fitsDataApi = 'http://fits.geonet.org.nz/observation?';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery, from: number, to: number) {
    let days_float: number;
    let days: number;
    
    days_float = (to - from) / 3600 / 24 / 1000;
    if (days_float < 1) {
      days_float = 1;
    }

    days = days_float | 0;

    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url:
        fitsDataApi  +
        'typeID='    +
        query.type   +
        '&siteID='   +
        query.site   +
        '&methodID=' +
        query.method +
        '&days='     +
        days,
    });

    // let fitsResp = response.data.split("\n") as FitsDataResponse[];
    // return fitsResp[0].data;
    return response.data
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    // Return a constant for each query.
    const promises = options.targets.map((query) =>
      this.doRequest(query, from, to).then((response) => {
        let resp_split = response.split("\n");
        let headers = resp_split[0].split(",");

        const frame = new MutableDataFrame({
          refId: query.refId,
          name: query.site,
          fields: [
            { name: headers[0], type: FieldType.time },
            { name: headers[1], type: FieldType.number },
            { name: headers[2], type: FieldType.number },
          ],
        });
        resp_split.forEach((line: any, index: number) => {
          if (index > 0) {
            let point = line.split(",");

            let t: Date;
            let value: number;
            let error: number;

            t = point[0];
            value = point[1];
            error = point[2];
            
            if (isNaN(value) || value == null) {
              console.log("found a NaN or null here!");
            } else {
              frame.appendRow([t, value, error]);
            }
          }
        });

        return frame;
      })
    );

    return Promise.all(promises).then((data) => ({ data }));
  }

  // async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
  //   const { range } = options;
  //   const from = range!.from.valueOf();
  //   const to = range!.to.valueOf();
  //   // Return a constant for each query.
  //   const promises = options.targets.map((query) =>
  //     this.doRequest(query, from, to).then((response) => {
  //       const frame = new MutableDataFrame({
  //         refId: query.refId,
  //         fields: [
  //           { name: 'time', type: FieldType.time },
  //           { name: 'value', type: FieldType.number },
  //           { name: 'error', type: FieldType.number },
  //         ],
  //       });
  //       response.forEach((point: any) => {
  //         frame.appendRow([point.ts, point.value]);
  //       });

  //       return frame;
  //     })
  //   );

  //   return Promise.all(promises).then((data) => ({ data }));
  // }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
