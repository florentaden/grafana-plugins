import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onVolcanoIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, volID_varname: event.target.value });
  };
  onImageRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, imgrate_varname: event.target.value });
  };
  onStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, start_varname: event.target.value });
  };
  onEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, end_varname: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { volID_varname, imgrate_varname, start_varname, end_varname } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={volID_varname}
          onChange={this.onVolcanoIDChange}
          label="volcano-id var name"
          type="string"
        />    
        <FormField
          width={4}
          value={imgrate_varname}
          onChange={this.onImageRateChange}
          label="image-Rate var name"
          type="string"
        />        
        <FormField
          width={4}
          value={start_varname}
          onChange={this.onStartTimeChange}
          label="start-time var name"
          type="string"
        /> 
        <FormField
          width={4}
          value={end_varname}
          onChange={this.onEndTimeChange}
          label="end-time var name"
          type="string"
        />    
      </div>
    );
  }
}
