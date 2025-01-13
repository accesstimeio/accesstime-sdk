import { Contract, getFactoryAddress } from "@accesstimeio/accesstime-common";
import { getContract } from "viem";

import { Client, ClientConfig } from "./client";

export class Factory extends Client {
    public read;
    public simulate;
    public watchEvent;
    public write;


    constructor(config: ClientConfig) {
        super(config);
        const address = getFactoryAddress(config.id);

        const readABI = Contract.abis.factory.filter((abi) => abi.type == "function" && abi.stateMutability == "view");
        const readContract = getContract({
            address,
            abi: readABI,
            client: this.publicClient
        });

        const eventABI = Contract.abis.factory.filter((abi) => abi.type == "event");
        const eventContract = getContract({
            address,
            abi: eventABI,
            client: this.publicClient
        });

        const writeABI = Contract.abis.factory.filter((abi) => abi.type == "function" && abi.stateMutability != "view");
        const writeContract = getContract({
            address,
            abi: writeABI,
            client: this.publicClient
        });

        this.read = readContract.read;
        this.simulate = writeContract.simulate;
        this.watchEvent = eventContract.watchEvent;
        this.write = writeContract.write;
    }
}
