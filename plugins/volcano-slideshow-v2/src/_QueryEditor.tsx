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
    onChange({ ...query, volcanoID: event.target.value });
  };
  onImageRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, img_rate: event.target.value });
  };
  onStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, starttime: event.target.value });
  };
  onEndTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, endtime: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { volcanoID, img_rate, starttime, endtime } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={volcanoID}
          onChange={this.onVolcanoIDChange}
          label="volcano-id"
          type="string"
          tooltip="ruapehu"
        />    
        <FormField
          width={4}
          value={img_rate}
          onChange={this.onImageRateChange}
          label="image-Rate"
          type="string"
          tooltip="10min"
        />        
        <FormField
          width={4}
          value={starttime}
          onChange={this.onStartTimeChange}
          label="start-time"
          type="string"
        /> 
        <FormField
          width={4}
          value={endtime}
          onChange={this.onEndTimeChange}
          label="end-time"
          type="string"
        />    
      </div>
    );
  }
}
