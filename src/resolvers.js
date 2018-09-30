// @flow
import { ApolloError, PubSub } from 'apollo-server';
import assign from 'lodash.assign';
import moment from 'moment';
import casual from 'casual';

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
          classAdded: {
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
    classAdded: {
      subscribe: () => {
        return pubsub.asyncIterator([REGION_ADDED])
      },
    },
  },
  Query: {
    class: (_, {classId}: {classId: number}) => {
      let database = new Database(config);
      return database.query(`SELECT * FROM elamayan_class WHERE groupSymbol = ${classId}`)
          .then( rows => {
            database.close();
            return  {
                  id: rows[0].groupSymbol,
                  name: rows[0].description,
                  center: {
                      lat: "32.066667",
                      lon: "34.783333"
                  }
                }
              })
          },
    classes: () => {
      const _classes = [];
      let database = new Database(config);
      return database.query( "SELECT * FROM elamayan_class" )
        .then( rows => {
          rows.map( (_class, index) => {
            _classes.push({
              id: _class.groupSymbol,
              name: _class.description,
              center: {
                  lat: "32.066667",
                  lon: "34.783333"
              }
            });
          });
          database.close();
          return _classes;
        });
    }
  }
}
