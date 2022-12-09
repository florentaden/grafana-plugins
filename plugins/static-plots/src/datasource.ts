import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  // dateTime,
} from '@grafana/data';

type UrlName = { [id: string]: string };

const baseMap: UrlName = {
  sigrun: 'https://sftp.gns.cri.nz/pub/sigrun/rapid/',
  drum: 'http://images.geonet.org.nz/volcano/drums/latest/',
  combined: 'http://images.geonet.org.nz/volcano/drums/latest/',
  rsam: 'https://volcanolab.gns.cri.nz:8080/',
};

const plotNameMap: UrlName = {
  sigrun: '_8hrap.png',
  drum: '-seismic-drum.png',
  combined: '-seismic-combined.png',
  rsam: '.rsam_plot2_month.bp_1.00-4.00.png',
};

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    // Return a constant for each query.
    let data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [{ name: 'imageURL', type: FieldType.string }],
      });

      const base = baseMap[query.type]; // get base URL
      const suffix = plotNameMap[query.type]; // get suffix or last part of name

      const station_array = query.site.split(',');
      var station_name: string;

      station_array.forEach((station: string) => {
        if (query.type === 'sigrun' || query.type === 'rsam') {
          station_name = station;
        } else {
          station_name = station.toLowerCase();
        }

        let figname = base + station_name + suffix;
        frame.appendRow([figname]);
      });

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
