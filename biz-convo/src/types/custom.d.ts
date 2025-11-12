// src/types/custom.d.ts

import * as moment from 'moment';

declare global {
  interface JQuery {
    daterangepicker(options?: any, callback?: (start: moment.Moment, end: moment.Moment) => void): JQuery;
  }
}
