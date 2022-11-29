import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onVolIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, volId: event.target.value });
  };
  onImageNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, image_number: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { volId, image_number } = query;

    return (
      <div className="gf-form">
        <FormField width={4} value={volId} onChange={this.onVolIDChange} label="Volcano ID" type="string" />

        <FormField width={4} value={image_number} onChange={this.onImageNumberChange} label="# of Images" type="string" />
    </div>
    );
  }
}
