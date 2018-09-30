const typeDefs =  require('./schemas/schema.js').typeDefs;
const resolvers =  require('./src/resolvers.js').resolvers;
const pubsub =  require('./src/resolvers.js').pubsub;
const express = require('express');
const { ApolloServer, gql } = require('apollo-server');

import Database from './src/Database';
const config = {
  host: "sql125.main-hosting.eu",
  user: "u143806214_elamy",
  password: "Day1!2111",
  database: "u143806214_elamy"
};





// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

var port = process.env.PORT || 4000;
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
