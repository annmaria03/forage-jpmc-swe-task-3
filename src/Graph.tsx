import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
      price_abc: 'float',
      price_def: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the table in the <perspective-viewer> DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        timestamp: 'distinct count',
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const row = DataManipulator.generateRow(this.props.data);
      const tableData = Object.entries(row).map(([key, value]) => ({ [key]: value !== undefined ? value.toString() : '' }));
      this.table.update(tableData);
    }
  }
}

export default Graph;