import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, type: event.target.value });
  };
  onSiteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, site: event.target.value });
  };
  onMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, method: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { type, site, method } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={type}
          onChange={this.onTypeChange}
          label="Type"
          type="string"
          tooltip="CO2-flux-e"
        />
        <FormField
          width={4}
          value={site}
          onChange={this.onSiteChange}
          label="Site Code"
          type="string"
          tooltip="WI001"
        />
        <FormField
          width={4}
          value={method}
          onChange={this.onMethodChange}
          label="Method"
          type="string"
          tooltip="cont"
        />
      </div>
    );
  }
}
