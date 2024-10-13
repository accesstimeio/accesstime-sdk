import {
    Address,
    createPublicClient,
    defineChain,
    getAddress,
    getContract,
    http,
    parseAbi,
    PublicClient
} from "viem";
import { SUPPORTED_CHAIN_IDS } from "./config";

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
        if (!SUPPORTED_CHAIN_IDS.includes(config.chain.id)) {
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
            abi: parseAbi([
                "function accessTimes(address client) view returns (uint256 time)",
                "event Purchased(address indexed user, uint256 indexed amount, address indexed paymentToken)",
                "event PurchasedPackage(address indexed user, uint256 indexed amount, address indexed paymentToken, uint256 packageID)",
                "event ExtraTimed(address indexed user, uint256 indexed unixTime, uint256 indexed newTime)"
            ]),
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
