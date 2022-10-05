
// import {
//   readFile
// } from "fs";

import * as fs from "fs";

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  // dateTime,
} from '@grafana/data';


import { MyQuery, MyDataSourceOptions } from './types';

const path = "/home/admin/rapid";

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) => {

      const full_path = path + query.siteID + "8h.NEU"
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

      fs.readFileSync(full_path, function(err, data){
        if (err) throw err;

        const all_lines = data.toString().replace(/\r\n/g, "\n").split("\n");

        for (let i = 0; i < all_lines.length-1; i++){
          const line = all_lines[i];
          const vals = line.split(/\s+/);
          frame.appendRow([vals[0], vals[1], vals[2], vals[4], vals[5], vals[7], vals[8]]);
        }

      });

          return frame;
      });

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
