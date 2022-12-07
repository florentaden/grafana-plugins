import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onSiteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, stationid: event.target.value });
  };
  onSensorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, sensor: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { stationid, sensor } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={stationid}
          onChange={this.onSiteChange}
          label="Station"
          type="string"
          tooltip="WEL"
        />
        <FormField
          width={4}
          value={sensor}
          onChange={this.onSensorChange}
          label="Sensor Type"
          type="string"
          tooltip="Broadband"
        />
      </div>
    );
  }
}
