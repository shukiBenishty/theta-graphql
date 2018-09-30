// @flow
import moment from 'moment';
import Serie from './Serie.js';
import regionsData from '../data/regions.json';

class ClusterDistribution {

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

      const labels = ['Cluster1'];
      //const values = [avgDuration];
      const values = [44]; // measured in minutes

      return new Serie(labels, [values]);
    }
};
export default ClusterDistribution;
