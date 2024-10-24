
// frontend/src/components/CreateTokenForm.jsx
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTokenFactory } from '../hooks/useTokenFactory';
import ipfsClient from '../hooks/useIPFS';

const CreateTokenForm = () => {
    const { address } = useAccount();
    const { createToken, isWriteError, writeError } = useTokenFactory();


    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const imageAdded = await ipfsClient.add(formData.image);
            const imageURI = imageAdded.path;
            await ipfsClient.pin.add(imageURI);

            const { transactionHash, tokenAddress } = await createToken(
                formData.name,
                formData.symbol,
                imageURI
            );

            // Reset form
            setFormData({ name: '', symbol: '', image: null });
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };


    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Create New Token</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Token Name
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Token Symbol
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={formData.symbol}
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Token Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        required
                    />
                </div>

                {/* {error && (
                    <div className="mb-4 text-red-500 text-sm">
                        {error}
                    </div>
                )} */}

                <button
                    type="submit"
                    disabled={!address || loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Creating...' : 'Create Token'}
                </button>
            </form>
        </div>
    );
};

export default CreateTokenForm;
