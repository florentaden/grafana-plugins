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

const fitsSiteApi = 'http://fits.geonet.org.nz/site?';

interface FitsSiteResponse {
  features: SiteFeature[];
}

interface SiteFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    siteID: string;
    height: number;
    groundRelationship: number;
    name: string;
  };
}

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async doRequest(query: MyQuery, from: number, to: number) {
    // const now = dateTime();
    // const nowS = now.format('YYYY-MM-DD');
    // const fromDT = dateTime(from);
    // const toDT = dateTime(to);
    // const fromS = fromDT.format('YYYY-MM-DD');
    // const toS = toDT.format('YYYY-MM-DD');
    // var fromTo: string;

    // if (nowS > toS) {
    //   fromTo = fromS + '/' + toS;
    // } else {
    //   // latest mode
    //   fromTo = 'latest/';
    //   const diff = (to - from) / 3600;
    //   if (diff > 7 * 24) {
    //     fromTo += '30d';
    //   } else if (diff > 2 * 24) {
    //     fromTo += '7d';
    //   } else if (diff > 1 * 24) {
    //     fromTo += '2d';
    //   } else if (diff > 6) {
    //     fromTo += '1d';
    //   } else {
    //     fromTo += '6h';
    //   }
    // }

    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: fitsSiteApi + '&siteID=' + query.siteid,
    });

    // console.log(response.data as unknown as string);
    let fitsResp = response.data as FitsSiteResponse;
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
            { name: 'siteiD', type: FieldType.string },
            { name: 'height', type: FieldType.number },
            { name: 'groundRelationship', type: FieldType.number },
            { name: 'name', type: FieldType.string },
            { name: 'longitude', type: FieldType.number },
            { name: 'latitude', type: FieldType.number },
          ],
        });
        response.forEach((point: any) => {
          frame.appendRow([
            point.properties.siteID,
            point.properties.height,
            point.properties.groundRelationship,
            point.properties.name,
            point.geometry.coordinates[0],
            point.geometry.coordinates[1],
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
