import { Chain } from "@accesstimeio/accesstime-common";
import {
    createPublicClient,
    defineChain,
    http,
    PublicClient,
    Chain as ChainType
} from "viem";

export interface ClientConfig {
    id: number,
    rpcUrl?: string,
}

export class Client {
    public publicClient: PublicClient;

    constructor(config: ClientConfig) {
        if (!Chain.ids.includes(config.id)) {
            throw new Error("Given chain is not supported!");
        }

        const preChainConfig = Chain.wagmiConfig.find((chain) => chain.id == config.id);
        const userProvidedChainConfig = config.rpcUrl && defineChain({
            id: config.id,
            name: 'Localhost',
            nativeCurrency: {
                decimals: 18,
                name: 'Ether',
                symbol: 'ETH',
            },
            rpcUrls: {
                default: { http: [config.rpcUrl] },
            },
        });

        if (!preChainConfig && !userProvidedChainConfig) {
            throw new Error("Chain config is not found!");
        }

        this.publicClient = createPublicClient({
            transport: http(),
            chain: userProvidedChainConfig as ChainType || preChainConfig as ChainType
        });
    }
}
