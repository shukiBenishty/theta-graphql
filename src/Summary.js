// @flow
import moment from 'moment';
import casual from 'casual';
import regionsData from '../data/regions.json';

class Summary {

  id: string
  regionId: number
  from: Date
  till: Date
  kind: string

  constructor(regionId: number,
              from: Date,
              till: Date,
              kind: string) {
    this.id = casual.uuid;
    this.regionId = regionId;
    this.from = from;
    this.till = till;
    this.kind = kind;
  }

  value() {

    return casual.building_number;
  }

};

export default Summary;
