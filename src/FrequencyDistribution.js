// @flow
import regionsData from '../data/regions.json';
import moment from 'moment';
import Serie from './Serie.js';

class FrequencyDistribution {

  regionId: number
  from: Date
  till: Date

  constructor(regionId: number,
                from: Date,
                till: Date) {
    this.regionId = regionId;
    this.from = from;
    this.till = till;
  }

  async execute() {
    let region = regionsData.regions.find( _region => {
      return _region.id == this.regionId
    });

    const cameraIds = [];
    region.cameras.map( camera => {
      cameraIds.push(camera.id);
    });

    const _from = moment(this.from, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const _till = moment(this.till, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const serie = [];

    for (var i = 0; i < 7; i++) {
      serie.push(casual.array_of_doubles(n = 3));
    }

    const totals = casual.array_of_integers(n = 4);
    const totalsPercentage = totals.map( t => (
      Math.round(t/934873*100)
    ));

    const labels = ['everyday', 'onceAWeek', 'twiceAWeek', 'other'];
    const values = [ totals, totalsPercentage ];

    return new Serie(labels, values);

  }

};

export default FrequencyDistribution;
