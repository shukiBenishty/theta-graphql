const { gql } = require('apollo-server');

export let typeDefs = gql`

  interface INode  {
    id: ID!
  }

  type Subscription {
    classAdded: Class
  }


  scalar Date


  type GeoCenter {
    lat: Float
    lon: Float
  }


  type Class implements INode{

    id: ID!

    classId: Int
    center: GeoCenter

    name: String,

  }

  type Query {
    class(classId: Int!): Class,
    classes: [Class]
  }

`;
