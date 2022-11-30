import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  dateTime,
} from '@grafana/data';

type volNameMap = { [id: string]: string };
const volImageNames: volNameMap = {
  ruapehunorth: 'DISC.01',
  ruapehusouth: 'MTSR.01',
  ruapehungauruhoe: 'KMTP.01',
  ngauruhoe: 'DISC.02',
  taranaki: 'TEMO.02',
  raoulisland: 'RIMK.01',
  tongariro: 'KAKA.01',
  tongarirotemaaricrater: 'TOKR.01',
  whiteislandcraterrim: 'WINR.02',
  whakatane: 'WHOH.02',
  whiteislandwestrim: 'WIWR.01',
};
const path = 'https://images.geonet.org.nz/volcano/cameras/images/';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    let data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [{ name: 'imageName', type: FieldType.string }],
      });

      const fromDT = dateTime(from);
      const toDT = dateTime(to);
      // align to 10 minutes first
      const alignedFrom = fromDT.unix() - (fromDT.unix() % 600);
      const alignedTo = toDT.unix() - (toDT.unix() % 600);
      const base = path + volImageNames[query.volId];

      // volcano camera 10 minutes interval
      // we aim to get 36 images most (6 hrs).
      const diff = (alignedTo - alignedFrom) / 3600;
      // let step = Math.floor(diff / 6) * 600;
      // if (step < 600) {
      //   step = 600;
      // }
      const step = 600;
      console.log(diff, step);

      var time_range = [];
      for (let t = alignedFrom; t < alignedTo; t += step){
        time_range.push(t)
      }

      var i_init: number;
      var image_number: number;
      image_number = Number(query.image_number);

      if ( image_number < 1) {
        i_init = 0;
      } else {
        i_init = time_range.length - image_number;
      }

      for ( var i = i_init; i < time_range.length; i++){
        var t = time_range[i];
        let tm = dateTime(t * 1000);
        let nm = base + tm.format('YYYYMMDDHHmmSS') + 'NZDT.jpg';
        frame.appendRow([nm]);
      }

      return frame;
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
