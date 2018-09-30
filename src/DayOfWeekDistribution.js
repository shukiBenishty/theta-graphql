import moment from 'moment';
import Serie from './Serie.js';
import regionsData from '../data/regions.json';

class DayOfWeekDistribution {

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

  execute() {

    let region = regionsData.regions.find( _region => {
      return _region.id == this.regionId
    });

    const cameraIds = [];
    region.cameras.map( camera => {
      cameraIds.push(camera.id);
    });

    const _from = moment(this.from, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const _till = moment(this.till, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const labels = [];
    const values = [];
    const serie = [];

    for (var i = 0; i < 7; i++) {
      labels.push(casual.username);
      serie.push(casual.array_of_doubles(n = 3));
    }


    values.push(serie);

    return new Serie(labels, values);
  }

};

export default DayOfWeekDistribution;
