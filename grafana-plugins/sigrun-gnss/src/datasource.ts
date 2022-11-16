
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

const path =  "http://api-app:8000/data/?"; // assuming the rapidAPI container is running and has been built with the docker compose

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery) {
    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url:  path + "siteID=" + query.siteID + "&period=" + query.period,
    });

    return response.data
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) => 
      this.doRequest(query).then((response) => {
        var resp_split = response.split("\n");
        const frame = new MutableDataFrame({
          refId: query.refId,
          name: query.siteID,
          fields: [
            { name: "time", type: FieldType.number },
            { name: "north", type: FieldType.number },
            { name: "err_n", type: FieldType.number },
            { name: "east", type: FieldType.number },
            { name: "err_e", type: FieldType.number },
            { name: "vertical", type: FieldType.number },
            { name: "err_u", type: FieldType.number },
          ],
        });

        resp_split.forEach((line: any) => {
          const values = line.split(/\s+/);
          var t = values[0];
          var north = values[1];
          var err_n = values[2];
          var east = values[4];
          var err_e = values[5];
          var vertical = values[7];
          var err_u = values[8];

          if (isNaN(north) || north == null) {
            console.log("found a NaN or a null here!");
          } else {
            frame.appendRow([t, north, err_n, east, err_e, vertical, err_u]);
          };
        });

        return frame;
      })
    );
    
    return Promise.all(promises).then((data) => ({ data }));
  };

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
