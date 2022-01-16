# stems-nft-hack

## setup
```bash
nvm use
yarn
```

## compile contracts
```
yarn compile
```

## run demo script
`yarn demo:ropsten` does a couple things:
1. call `StemsFactory`.createCollection() which in turn deploys a new StemsERC721 contract
2. uses thegraph to query against `StemsFactory` for all collections available
3. mints 1 token for the user on the first collection available
4. upgrades fUSDC for the user (assuming `approve()` was called on UI like etherscan)
5. creates a stream from another user to the StemsERC721 contract for a given `tokenId` using the userData prop available
6. deletes the stream (optionally)
7. re-queries the data to show the transition to `pastSponsors`

## StemsDAO hack (product)
- artist mints NFT collection for a song - 50 stems
- artist receives money for the NFT collection in the form of a superfluid stream 0.01 eth per day
- stemserc721 receives the money stream ($1 / day, hour, etc)
    - the callback is configured so that the stream receiver is the actual artist
    - the contract notifies the stems factory contract to update the token’s sponsor on-chain
    - ENS integration in the client app shows this profile in the list of sponsors

### MVP
- react app to render NFTs available (using zora component) from a ERC721 subgraph (can use openzeppelin)
- button to “sponsor” an NFT which creates a SF stream (hardcoded super token for USDC/ETH) to the contract
- contract callback accepts the stream, pipes the money to the contract owner, notifies the factory contract
    - (optionally) contract callback splits the stream evenly for all token holders (instant distribution?)
- factory contract emits an event (tokenId, flowSender, flowRate)
- custom subgraph is aware of all token sponsors, ranks them by flowRate
- zora component is extended to show the ENS profile of top sponsor (using https://www.npmjs.com/package/@davatar/react)
- react app can show livefeed of token sponsors

### Scripts (DONE)
- create a collection
- mint some tokens from that collection
- create a stream to the given collection from an ENS-enabled account
- check that superfluid dashboard reflects
- query subgraph to check for sponsor data

### App (NOT DONE)
- zora auction house to read data from my subgraph
- add “Sponsor” button to create stream
- render sponsor data from ENS
