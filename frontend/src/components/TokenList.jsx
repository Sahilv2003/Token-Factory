// frontend/src/components/TokenList.jsx (continued from previous response)
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useTokenFactory } from '../hooks/useTokenFactory';
import { createIpfsUrlFromContentHash } from '../utils/formats';
import { Copy } from 'lucide-react';

const AddressDisplay = ({ address }) => {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(address);
            // You could add a toast notification here if you want
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <span>Address: {address.slice(0, 6)}...{address.slice(-4)}</span>
            <button
                onClick={copyToClipboard}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy address"
            >
                <Copy size={16} />
            </button>
        </div>
    );
};

const TokenList = () => {
    const { address } = useAccount();

    const tokenFactory = useTokenFactory();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTokens = async () => {
            if (!address) return;
            // Only set loading true on initial fetch, not during polling
            if (tokens.length === 0) {
                setLoading(true);
            }
            try {
                const tokenAddresses = await tokenFactory.getCreatorTokens(address);
                const tokenDetails = await Promise.all(
                    tokenAddresses.map(addr => tokenFactory.getTokenDetails(addr))
                );
                setTokens(tokenDetails);
            } catch (error) {
                console.error('Error fetching tokens:', error);
            }
            setLoading(false);
        };

        fetchTokens();
        const intervalId = setInterval(fetchTokens, 10000);

        return () => clearInterval(intervalId);
    }, [address]);

    if (loading) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Tokens</h2>
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!address) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Tokens</h2>
                <div className="text-center">Please connect your wallet to view tokens</div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Tokens</h2>
            {tokens.length === 0 ? (
                <div className="text-center">No tokens created yet</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tokens.map((token) => (
                        <div key={token.address} className="bg-white p-4 rounded-lg shadow">
                            <img
                                src={createIpfsUrlFromContentHash(token.imageUrl)}
                                alt={token.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-bold">{token.name}</h3>
                            <p className="text-gray-600">{token.symbol}</p>
                            <AddressDisplay address={token.address} />

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TokenList;
