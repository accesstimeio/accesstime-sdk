import { Contract } from "@accesstimeio/accesstime-common";
import {
    Address,
    getAddress,
    getContract,
    zeroAddress,
} from "viem";

import { Client, ClientConfig } from "./client";

interface Config {
    chain: ClientConfig,
    accessTime: Address
}

export class AccessTime extends Client {
    public read;
    public simulate;
    public watchEvent;
    public write;

    constructor(config: Config) {
        super(config.chain);

        if (config.accessTime == zeroAddress) {
            throw new Error("Zero address is not accepted!");
        }

        const address = getAddress(config.accessTime);

        const readABI = Contract.abis.accessTime.filter((abi) => abi.type == "function" && abi.stateMutability == "view");
        const readContract = getContract({
            address,
            abi: readABI,
            client: this.publicClient
        });

        const eventABI = Contract.abis.accessTime.filter((abi) => abi.type == "event");
        const eventContract = getContract({
            address,
            abi: eventABI,
            client: this.publicClient
        });

        const writeABI = Contract.abis.accessTime.filter((abi) => abi.type == "function" && abi.stateMutability != "view");
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
