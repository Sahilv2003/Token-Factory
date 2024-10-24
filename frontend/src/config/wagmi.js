
// src/config/wagmi.js
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { supportedChains } from './chains';

export const projectId = 'a961f8e80fd0f10be59f8754f9f2b5e2';

export const metadata = {
    name: 'erc20',
    description: 'create erc20 tokens',
    url: 'https://apecity.fun',
    icons: ['https://yourapp.com/favicon.ico'],
};

// 2. Create wagmiConfig
export const config = defaultWagmiConfig({
    chains: supportedChains,
    projectId,
    metadata
})

