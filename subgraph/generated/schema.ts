// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Account entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Account entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Account", id.toString(), this);
    }
  }

  static load(id: string): Account | null {
    return changetype<Account | null>(store.get("Account", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asERC721(): string | null {
    let value = this.get("asERC721");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set asERC721(value: string | null) {
    if (!value) {
      this.unset("asERC721");
    } else {
      this.set("asERC721", Value.fromString(<string>value));
    }
  }

  get ERC721tokens(): Array<string> {
    let value = this.get("ERC721tokens");
    return value!.toStringArray();
  }

  set ERC721tokens(value: Array<string>) {
    this.set("ERC721tokens", Value.fromStringArray(value));
  }

  get ERC721operatorOwner(): Array<string> {
    let value = this.get("ERC721operatorOwner");
    return value!.toStringArray();
  }

  set ERC721operatorOwner(value: Array<string>) {
    this.set("ERC721operatorOwner", Value.fromStringArray(value));
  }

  get ERC721operatorOperator(): Array<string> {
    let value = this.get("ERC721operatorOperator");
    return value!.toStringArray();
  }

  set ERC721operatorOperator(value: Array<string>) {
    this.set("ERC721operatorOperator", Value.fromStringArray(value));
  }

  get ERC721transferFromEvent(): Array<string> {
    let value = this.get("ERC721transferFromEvent");
    return value!.toStringArray();
  }

  set ERC721transferFromEvent(value: Array<string>) {
    this.set("ERC721transferFromEvent", Value.fromStringArray(value));
  }

  get ERC721transferToEvent(): Array<string> {
    let value = this.get("ERC721transferToEvent");
    return value!.toStringArray();
  }

  set ERC721transferToEvent(value: Array<string>) {
    this.set("ERC721transferToEvent", Value.fromStringArray(value));
  }

  get events(): Array<string> {
    let value = this.get("events");
    return value!.toStringArray();
  }

  set events(value: Array<string>) {
    this.set("events", Value.fromStringArray(value));
  }
}

export class ERC721Contract extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("asAccount", Value.fromString(""));
    this.set("supportsMetadata", Value.fromBoolean(false));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ERC721Contract entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ERC721Contract entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ERC721Contract", id.toString(), this);
    }
  }

  static load(id: string): ERC721Contract | null {
    return changetype<ERC721Contract | null>(store.get("ERC721Contract", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asAccount(): string {
    let value = this.get("asAccount");
    return value!.toString();
  }

  set asAccount(value: string) {
    this.set("asAccount", Value.fromString(value));
  }

  get supportsMetadata(): boolean {
    let value = this.get("supportsMetadata");
    return value!.toBoolean();
  }

  set supportsMetadata(value: boolean) {
    this.set("supportsMetadata", Value.fromBoolean(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (!value) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(<string>value));
    }
  }

  get tokens(): Array<string> {
    let value = this.get("tokens");
    return value!.toStringArray();
  }

  set tokens(value: Array<string>) {
    this.set("tokens", Value.fromStringArray(value));
  }

  get operators(): Array<string> {
    let value = this.get("operators");
    return value!.toStringArray();
  }

  set operators(value: Array<string>) {
    this.set("operators", Value.fromStringArray(value));
  }

  get transfers(): Array<string> {
    let value = this.get("transfers");
    return value!.toStringArray();
  }

  set transfers(value: Array<string>) {
    this.set("transfers", Value.fromStringArray(value));
  }
}

export class ERC721Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("contract", Value.fromString(""));
    this.set("identifier", Value.fromBigInt(BigInt.zero()));
    this.set("owner", Value.fromString(""));
    this.set("approval", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ERC721Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ERC721Token entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ERC721Token", id.toString(), this);
    }
  }

  static load(id: string): ERC721Token | null {
    return changetype<ERC721Token | null>(store.get("ERC721Token", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value!.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get identifier(): BigInt {
    let value = this.get("identifier");
    return value!.toBigInt();
  }

  set identifier(value: BigInt) {
    this.set("identifier", Value.fromBigInt(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value!.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get approval(): string {
    let value = this.get("approval");
    return value!.toString();
  }

  set approval(value: string) {
    this.set("approval", Value.fromString(value));
  }

  get uri(): string | null {
    let value = this.get("uri");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set uri(value: string | null) {
    if (!value) {
      this.unset("uri");
    } else {
      this.set("uri", Value.fromString(<string>value));
    }
  }

  get transfers(): Array<string> {
    let value = this.get("transfers");
    return value!.toStringArray();
  }

  set transfers(value: Array<string>) {
    this.set("transfers", Value.fromStringArray(value));
  }
}

export class ERC721Operator extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("contract", Value.fromString(""));
    this.set("owner", Value.fromString(""));
    this.set("operator", Value.fromString(""));
    this.set("approved", Value.fromBoolean(false));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ERC721Operator entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ERC721Operator entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ERC721Operator", id.toString(), this);
    }
  }

  static load(id: string): ERC721Operator | null {
    return changetype<ERC721Operator | null>(store.get("ERC721Operator", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value!.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    return value!.toString();
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get operator(): string {
    let value = this.get("operator");
    return value!.toString();
  }

  set operator(value: string) {
    this.set("operator", Value.fromString(value));
  }

  get approved(): boolean {
    let value = this.get("approved");
    return value!.toBoolean();
  }

  set approved(value: boolean) {
    this.set("approved", Value.fromBoolean(value));
  }
}

export class ERC721Transfer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("emitter", Value.fromString(""));
    this.set("transaction", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("contract", Value.fromString(""));
    this.set("token", Value.fromString(""));
    this.set("from", Value.fromString(""));
    this.set("to", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ERC721Transfer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ERC721Transfer entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ERC721Transfer", id.toString(), this);
    }
  }

  static load(id: string): ERC721Transfer | null {
    return changetype<ERC721Transfer | null>(store.get("ERC721Transfer", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get emitter(): string {
    let value = this.get("emitter");
    return value!.toString();
  }

  set emitter(value: string) {
    this.set("emitter", Value.fromString(value));
  }

  get transaction(): string {
    let value = this.get("transaction");
    return value!.toString();
  }

  set transaction(value: string) {
    this.set("transaction", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value!.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get token(): string {
    let value = this.get("token");
    return value!.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get from(): string {
    let value = this.get("from");
    return value!.toString();
  }

  set from(value: string) {
    this.set("from", Value.fromString(value));
  }

  get to(): string {
    let value = this.get("to");
    return value!.toString();
  }

  set to(value: string) {
    this.set("to", Value.fromString(value));
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("blockNumber", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Transaction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Transaction entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Transaction", id.toString(), this);
    }
  }

  static load(id: string): Transaction | null {
    return changetype<Transaction | null>(store.get("Transaction", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value!.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get events(): Array<string> {
    let value = this.get("events");
    return value!.toStringArray();
  }

  set events(value: Array<string>) {
    this.set("events", Value.fromStringArray(value));
  }
}

export class StemsFactoryContract extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save StemsFactoryContract entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save StemsFactoryContract entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("StemsFactoryContract", id.toString(), this);
    }
  }

  static load(id: string): StemsFactoryContract | null {
    return changetype<StemsFactoryContract | null>(
      store.get("StemsFactoryContract", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collections(): Array<string> {
    let value = this.get("collections");
    return value!.toStringArray();
  }

  set collections(value: Array<string>) {
    this.set("collections", Value.fromStringArray(value));
  }

  get artists(): Array<string> {
    let value = this.get("artists");
    return value!.toStringArray();
  }

  set artists(value: Array<string>) {
    this.set("artists", Value.fromStringArray(value));
  }
}

export class StemsArtist extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("account", Value.fromString(""));
    this.set("factory", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save StemsArtist entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save StemsArtist entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("StemsArtist", id.toString(), this);
    }
  }

  static load(id: string): StemsArtist | null {
    return changetype<StemsArtist | null>(store.get("StemsArtist", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value!.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get collections(): Array<string> {
    let value = this.get("collections");
    return value!.toStringArray();
  }

  set collections(value: Array<string>) {
    this.set("collections", Value.fromStringArray(value));
  }

  get factory(): string {
    let value = this.get("factory");
    return value!.toString();
  }

  set factory(value: string) {
    this.set("factory", Value.fromString(value));
  }
}

export class StemsCollection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("factory", Value.fromString(""));
    this.set("artist", Value.fromString(""));
    this.set("contract", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save StemsCollection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save StemsCollection entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("StemsCollection", id.toString(), this);
    }
  }

  static load(id: string): StemsCollection | null {
    return changetype<StemsCollection | null>(store.get("StemsCollection", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get factory(): string {
    let value = this.get("factory");
    return value!.toString();
  }

  set factory(value: string) {
    this.set("factory", Value.fromString(value));
  }

  get artist(): string {
    let value = this.get("artist");
    return value!.toString();
  }

  set artist(value: string) {
    this.set("artist", Value.fromString(value));
  }

  get sponsors(): Array<string> {
    let value = this.get("sponsors");
    return value!.toStringArray();
  }

  set sponsors(value: Array<string>) {
    this.set("sponsors", Value.fromStringArray(value));
  }

  get pastSponsors(): Array<string> {
    let value = this.get("pastSponsors");
    return value!.toStringArray();
  }

  set pastSponsors(value: Array<string>) {
    this.set("pastSponsors", Value.fromStringArray(value));
  }

  get contract(): string {
    let value = this.get("contract");
    return value!.toString();
  }

  set contract(value: string) {
    this.set("contract", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class StemsCollectionSponsor extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("account", Value.fromString(""));
    this.set("collection", Value.fromString(""));
    this.set("flowRate", Value.fromBigInt(BigInt.zero()));
    this.set("token", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save StemsCollectionSponsor entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save StemsCollectionSponsor entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("StemsCollectionSponsor", id.toString(), this);
    }
  }

  static load(id: string): StemsCollectionSponsor | null {
    return changetype<StemsCollectionSponsor | null>(
      store.get("StemsCollectionSponsor", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value!.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get flowRate(): BigInt {
    let value = this.get("flowRate");
    return value!.toBigInt();
  }

  set flowRate(value: BigInt) {
    this.set("flowRate", Value.fromBigInt(value));
  }

  get token(): string {
    let value = this.get("token");
    return value!.toString();
  }

  set token(value: string) {
    this.set("token", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class StemsCollectionSponsorHistorical extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("account", Value.fromString(""));
    this.set("collection", Value.fromString(""));
    this.set("createdAt", Value.fromBigInt(BigInt.zero()));
    this.set("deletedAt", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save StemsCollectionSponsorHistorical entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save StemsCollectionSponsorHistorical entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("StemsCollectionSponsorHistorical", id.toString(), this);
    }
  }

  static load(id: string): StemsCollectionSponsorHistorical | null {
    return changetype<StemsCollectionSponsorHistorical | null>(
      store.get("StemsCollectionSponsorHistorical", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value!.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    return value!.toString();
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value!.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get deletedAt(): BigInt {
    let value = this.get("deletedAt");
    return value!.toBigInt();
  }

  set deletedAt(value: BigInt) {
    this.set("deletedAt", Value.fromBigInt(value));
  }
}
