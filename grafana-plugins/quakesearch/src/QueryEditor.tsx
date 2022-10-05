import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onBboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, bbox: event.target.value });
  };
  
  onMinDepthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, mindepth: event.target.value });
  };
  onMaxDepthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, maxdepth: event.target.value });
  };
  onMinMagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, minmag: event.target.value });
  };
  onMaxMagChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, maxmag: event.target.value });
  };
 

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { bbox, mindepth, maxdepth, minmag, maxmag} = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={bbox}
          onChange={this.onBboxChange}
          label="Box bound."
          type="string"
          tooltip="lonmin,latmin,lonmax,latmax"
        />
        <FormField
          width={4}
          value={mindepth}
          onChange={this.onMinDepthChange}
          label="Min. Depth"
          type="string"
        />
        <FormField
          width={4}
          value={maxdepth}
          onChange={this.onMaxDepthChange}
          label="Max. Depth"
          type="string"
        />
        <FormField
          width={4}
          value={minmag}
          onChange={this.onMinMagChange}
          label="Min. Magnitude"
          type="string"
        />
        <FormField
          width={4}
          value={maxmag}
          onChange={this.onMaxMagChange}
          label="Max. Magnitude"
          type="string"
        />

        
      </div>
    );
  }
}
