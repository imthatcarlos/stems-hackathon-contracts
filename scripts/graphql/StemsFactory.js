const { gql } = require('graphql-request');

const QUERY_COLLECTIONS = gql`
  query($factory: String!) {
    stemsCollections(where: { factory: $factory }) {
      id
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
      pastSponsors {
        account {
          id
        }
        createdAt
        deletedAt
      }
    }
  }
`;

module.exports = {
  QUERY_COLLECTIONS
}
