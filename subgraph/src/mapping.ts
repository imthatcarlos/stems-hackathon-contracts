import { BigInt, store } from "@graphprotocol/graph-ts";
import { fetchAccount } from "@openzeppelin/subgraphs/src/fetch/account";
import { fetchERC721Token } from "@openzeppelin/subgraphs/src/fetch/erc721";
import { ERC721 } from "../generated/templates";
import {
  StemsFactory,
  CollectionCreated,
  StreamUpdated,
  StreamDeleted
} from "../generated/StemsFactory/StemsFactory";
import {
  StemsFactoryContract,
  StemsArtist,
  StemsCollection,
  StemsCollectionSponsor,
  StemsCollectionSponsorHistorical
} from "../generated/schema";

export function handleCollectionCreated(event: CollectionCreated): void {
  ERC721.create(event.params.token); // dynamically add to datasources

  const tokenContractId = event.params.token.toHexString().toLowerCase();
  const factoryContractId = event.address.toHexString();
  const artistId = fetchAccount(event.params.deployer).id;

  const entity = new StemsCollection(tokenContractId);
  const artistEntity = new StemsArtist(event.params.deployer.toHexString());
  const factoryEntity = new StemsFactoryContract(factoryContractId);

  entity.factory = factoryContractId;
  entity.artist = artistId;
  entity.contract = fetchAccount(event.params.token).id;
  entity.timestamp = event.block.timestamp;
  entity.save();

  artistEntity.factory = factoryContractId;
  artistEntity.account = artistId;
  artistEntity.save(); // @TODO: can't we check if it exists without loading?

  factoryEntity.save();
}

// gets called when a stream is created/updated, with `flowRate` being the only value that could actually change
export function handleStreamUpdated(event: StreamUpdated): void {
  const tokenContractId = fetchAccount(event.params.token).id;
  const sponsorId = `${tokenContractId}/${event.params.sender.toHexString().toLowerCase()}/${event.params.tokenId.toHex()}`;
  const entity = new StemsCollectionSponsor(sponsorId);

  entity.account = fetchAccount(event.params.sender).id;
  entity.collection = tokenContractId;
  entity.flowRate = event.params.flowRate;
  entity.token = `${tokenContractId}/${event.params.tokenId.toHex()}`; // fetchERC721Token
  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handleStreamDeleted(event: StreamDeleted): void {
  const tokenContractId = fetchAccount(event.params.token).id;
  const sponsorId = `${tokenContractId}/${event.params.sender.toHexString().toLowerCase()}/${event.params.tokenId.toHex()}`;
  const removedEntity = StemsCollectionSponsor.load(sponsorId);

  if (removedEntity) {
    const createdAt = removedEntity.timestamp;
    store.remove('StemsCollectionSponsor', sponsorId);

    // for historical
    const entity = new StemsCollectionSponsorHistorical(`${sponsorId}-${removedEntity.timestamp.toString()}`);
    entity.account = fetchAccount(event.params.sender).id;
    entity.collection = tokenContractId;
    entity.createdAt = createdAt;
    entity.deletedAt = event.block.timestamp;
    entity.save();
  }
}
