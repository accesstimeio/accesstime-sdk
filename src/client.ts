import { Chain, Contract } from "@accesstimeio/accesstime-common";
import {
    Address,
    createPublicClient,
    defineChain,
    getAddress,
    getContract,
    http,
    PublicClient
} from "viem";

interface ChainConfig {
    id: number,
    rpcUrl: string,
}

interface ClientConfig {
    chain: ChainConfig,
    accessTime: Address
}

export class Client {
    private accessTime: Address;
    private publicClient: PublicClient;

    constructor(config: ClientConfig) {
        if (!Chain.ids.includes(config.chain.id)) {
            throw new Error("Given chain is not supported!");
        }
        this.publicClient = createPublicClient({
            transport: http(),
            chain: defineChain({
                id: config.chain.id,
                name: 'Localhost',
                nativeCurrency: {
                    decimals: 18,
                    name: 'Ether',
                    symbol: 'ETH',
                },
                rpcUrls: {
                    default: { http: [config.chain.rpcUrl] },
                },
            })
        });
        this.accessTime = getAddress(config.accessTime);
    }

    private getContract() {
        return getContract({
            address: this.accessTime,
            abi: Contract.abis.accessTime,
            client: this.publicClient
        })
    }

    async getUserAccessTime(address: Address) {
        return await this.getContract().read.accessTimes([address]);
    }

    watchUserPurchase(address: Address, onLogs: (logs: any) => void) {
        return this.getContract().watchEvent.Purchased(
            { user: address },
            { onLogs: (logs) => onLogs(logs) },
        )
    }

    watchUserPurchasePackage(address: Address, onLogs: (logs: any) => void) {
        return this.getContract().watchEvent.PurchasedPackage(
            { user: address },
            { onLogs: (logs) => onLogs(logs) },
        )
    }

    watchUserExtraTimed(address: Address, onLogs: (logs: any) => void) {
        return this.getContract().watchEvent.ExtraTimed(
            { user: address },
            { onLogs: (logs) => onLogs(logs) },
        )
    }
}
