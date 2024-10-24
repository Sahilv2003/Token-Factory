// frontend/src/hooks/useTokenFactory.js
import { useCallback } from 'react';
import {
    useAccount,
    useWriteContract,
    usePublicClient
} from 'wagmi';
import { parseAbi } from 'viem';
import contractAddresses from '../contracts/contractAddresses.json';

// Import ABIs
import TokenFactoryABI from '../artifacts/contracts/TokenFactory.sol/TokenFactory.json';
import ERC20TokenABI from '../artifacts/contracts/ERC20Token.sol/ERC20Token.json';

export const useTokenFactory = () => {
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();

    // Contract write hook for creating tokens
    const { writeContract, isError: isWriteError, error: writeError } = useWriteContract();

    // Create token function
    const createToken = async (name, symbol, tokenURI) => {
        try {
            const hash = await writeContract({
                address: contractAddresses.TokenFactory,
                abi: TokenFactoryABI.abi,
                functionName: 'createToken',
                args: [name, symbol, tokenURI],
            });

            // Wait for transaction receipt
            const { status, transactionHash } = await publicClient.waitForTransactionReceipt({
                hash
            });

            if (status === 'success') {
                // Get the token address from the event logs
                const logs = await publicClient.getLogs({
                    address: contractAddresses.TokenFactory,
                    event: parseAbi(['event TokenCreated(address indexed creator, address tokenAddress, string name, string symbol, string tokenURI)']),
                    fromBlock: 'latest',
                    toBlock: 'latest',
                });

                const tokenAddress = logs[0].args.tokenAddress;
                return { transactionHash, tokenAddress };
            }

            throw new Error('Transaction failed');
        } catch (error) {
            console.error('Error creating token:', error);
            throw error;
        }
    };

    // Get creator's tokens
    const getCreatorTokens = async (address) => {
        try {
            const data = await publicClient.readContract({
                address: contractAddresses.TokenFactory,
                abi: TokenFactoryABI.abi,
                functionName: 'getCreatorTokens',
                args: [address],
            });
            return data;
        } catch (error) {
            console.error('Error getting creator tokens:', error);
            return [];
        }
    };

    // Get token details
    const getTokenDetails = async (tokenAddress) => {
        try {
            const [name, symbol, tokenURI, totalSupply] = await Promise.all([
                publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20TokenABI.abi,
                    functionName: 'name',
                }),
                publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20TokenABI.abi,
                    functionName: 'symbol',
                }),
                publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20TokenABI.abi,
                    functionName: 'tokenURI',
                }),
                publicClient.readContract({
                    address: tokenAddress,
                    abi: ERC20TokenABI.abi,
                    functionName: 'totalSupply',
                })
            ]);

            return {
                address: tokenAddress,
                name,
                symbol,
                imageUrl: tokenURI,
                totalSupply: totalSupply.toString()
            };
        } catch (error) {
            console.error('Error getting token details:', error);
            return null;
        }
    };

    // Watch for new token creation events
    const watchTokenCreation = (callback) => {
        const unwatch = publicClient.watchContractEvent({
            address: contractAddresses.TokenFactory,
            abi: TokenFactoryABI.abi,
            eventName: 'TokenCreated',
            onLogs: (logs) => {
                callback(logs);
            },
        });

        return unwatch;
    };

    // Get token balance
    const getTokenBalance = async (tokenAddress, walletAddress) => {
        try {
            const balance = await publicClient.readContract({
                address: tokenAddress,
                abi: ERC20TokenABI.abi,
                functionName: 'balanceOf',
                args: [walletAddress],
            });
            return balance.toString();
        } catch (error) {
            console.error('Error getting token balance:', error);
            return '0';
        }
    };

    return {
        createToken,
        getCreatorTokens,
        getTokenDetails,
        watchTokenCreation,
        getTokenBalance,
        isWriteError,
        writeError
    };
};
