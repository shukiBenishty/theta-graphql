// @flow
import { ApolloError, PubSub } from 'apollo-server';
import assign from 'lodash.assign';
import moment from 'moment';
import casual from 'casual';

import DayOfWeekDistribution from './DayOfWeekDistribution';
import FrequencyDistribution from './FrequencyDistribution';
import ClusterDistribution from './ClusterDistribution';
import Summary from '../src/Summary';
import Serie from '../src/Serie';

import regionsData from '../data/regions.json';
import classSymbol from '../data/classSymbol.json';

import Database from './Database';
const config = {
  host: "sql125.main-hosting.eu",
  user: "u143806214_elamy",
  password: "Day1!2111",
  database: "u143806214_elamy"
};
const pubsub = new PubSub();

const REGION_ADDED = 'REGION_ADDED';

setInterval(() => {
  let database = new Database(config);
  let _classSymbol = classSymbol.class[casual.integer(0, classSymbol.class.length) ].id
  database.query(`SELECT * FROM elamayan_class WHERE groupSymbol = ${_classSymbol}`)
    .then( rows => {
      database.close();
      console.log(rows[0].groupSymbol);
      pubsub.publish(REGION_ADDED, {
          regionAdded: {
            id: rows[0].groupSymbol,
            name: rows[0].description,
            center: {
                lat: "32.066667",
                lon: "34.783333"
            }
          }
        })
    });

}, 2000);

export let resolvers = {
  Subscription: {
    regionAdded: {
      subscribe: () => {
        return pubsub.asyncIterator([REGION_ADDED])
      },
    },
  },
  Query: {
    region: (_, {regionId}: {regionId: number}) => {

      let region = regionsData.regions.find( _region => {
        return _region.id == regionId
      });
      if( region === undefined) {
        throw new ApolloError(`No region with id ${regionId}`, 1001);
      }

      // Without assign, we'll deal with real object found in data array
      let _region = assign({}, region); // lodash implied

      const cameras = region.cameras.map( (camera) => {
        return {
          id: casual.uuid,
          name: camera.name,
          cameraId: camera.id,
          location:  {
            lat: camera.lat,
            lon: camera.lon
          }
        }
      });
      _region.regionId = region.id;
      _region.cameras = cameras;
      _region.id = casual.uuid;

      return _region;
    },
    regions: () => {
      const _regions = [];
      let database = new Database(config);
      return database.query( "SELECT * FROM elamayan_class" )
        .then( rows => {
          rows.map( (region, index) => {
            _regions.push({
              id: region.groupSymbol,
              name: region.description,
              center: {
                  lat: "32.066667",
                  lon: "34.783333"
              }
            });
          });
          database.close();
          return _regions;
        });
    }
  },
  Region: {
    summary(region, {from, till, kind} : {from: Date, till: Date, kind: string} ) {
      return new Summary(region.regionId, from, till, kind);
    },
    summaries(region, {from, till} : {from: Date, till: Date} ): Summary[] {

      const regionId = region.regionId;
      let _summaries: Summary[] = [];
      _summaries.push(new Summary(regionId, from, till, "IN"));
      _summaries.push(new Summary(regionId, from, till, "OUT"));
      _summaries.push(new Summary(regionId, from, till, "CROSS"));
      _summaries.push(new Summary(regionId, from, till, "PASSENGERS"));
      return _summaries;

    },
    disrtibution(region, {from, till} : {from: Date, till: Date} ) : Serie {

      return new DayOfWeekDistribution(region.regionId, from, till)
                 .execute();
    },
    frequencyDistribution(region, {from, till} : {from: Date, till: Date} ) : Serie {
      return new FrequencyDistribution(region.regionId, from, till)
                  .execute();
    },
    clusterDistribution(region, {from, till} : {from: Date, till: Date} ) : Serie {
      return new ClusterDistribution(region.regionId, from, till)
                 .execute();
    }
  }
}
