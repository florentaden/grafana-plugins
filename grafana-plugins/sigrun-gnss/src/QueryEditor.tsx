import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onSiteIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, siteID: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { siteID } = query;

    return (
      <div className="gf-form">
        <FormField
          width={4}
          value={siteID}
          onChange={this.onSiteIDChange}
          label="Site Code"
          type="string"
          tooltip="VGTR"
        />
        
      </div>
    );
  }
}
