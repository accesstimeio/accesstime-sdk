import { getAddress } from "viem";

export const convertToAddress = (address: any) => {
    return getAddress(address);
}
