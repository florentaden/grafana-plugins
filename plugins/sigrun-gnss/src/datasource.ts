
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

const path =  "http://kaizen.gns.cri.nz:8000/data/?"; // assuming the rapidAPI container is running and has been built with the docker compose

interface RapidResponse {
  data: RapidRecord[]
}

interface RapidRecord {
  time: Date;
  north: number;
  err_north: number;
  east: number;
  err_east: number;
  vertical: number;
  err_vertical: number;
}
export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery) {
    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url:  path + "siteID=" + query.siteID + "&period=" + query.period,
    });

    let rapidResp = response.data as RapidResponse;
    return rapidResp.data
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) => 
      this.doRequest(query).then((response) => {
        
        const frame = new MutableDataFrame({
          refId: query.refId,
          name: query.siteID,
          fields: [
            { name: "time", type: FieldType.time },
            { name: "north", type: FieldType.number },
            { name: "err_north", type: FieldType.number },
            { name: "east", type: FieldType.number },
            { name: "err_east", type: FieldType.number },
            { name: "vertical", type: FieldType.number },
            { name: "err_vertical", type: FieldType.number },
          ],
        });

        response.forEach((point: any) => {
          frame.appendRow([point.time, 
                           point.north, 
                           point.err_north, 
                           point.east, 
                           point.err_east, 
                           point.vertical, 
                           point.err_vertical]);
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
