const { gql } = require('graphql-request');

const QUERY_COLLECTIONS = gql`
  query($factory: String!) {
    stemsCollections(where: { factory: $factory }) {
      artist {
        id
      }
      timestamp
      contract {
        id
        name
        symbol
        tokens {
          identifier
          owner
          uri
        }
      }
      sponsors {
        account {
          id
        }
        flowRate
        timestamp
        token {
          identifier
        }
      }
    }
  }
`;

module.exports = {
  QUERY_COLLECTIONS
}
