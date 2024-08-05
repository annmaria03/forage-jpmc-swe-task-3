import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
  price_abc: number;
  price_def: number;
  timestamp: Date;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const row: Row = {
      ratio: 0,
      upper_bound: 1.05, // adjust this value as needed
      lower_bound: 0.95, // adjust this value as needed
      trigger_alert: undefined,
      price_abc: 0,
      price_def: 0,
      timestamp: new Date(),
    };

    if (serverResponds.length === 2) {
      const abc = serverResponds[0];
      const def = serverResponds[1];

      row.price_abc = abc.top_ask && abc.top_ask.price || 0;
      row.price_def = def.top_ask && def.top_ask.price || 0;

      row.ratio = row.price_abc / row.price_def;

      if (row.ratio > row.upper_bound || row.ratio < row.lower_bound) {
        row.trigger_alert = row.ratio;
      } else {
        row.trigger_alert = 0; // set to 0 when ratio is within bounds
      }
    }

    return row;
  }
}