import React from 'react';
import CreateTokenForm from './components/CreateTokenForm';
import TokenList from './components/TokenList';
import { Web3ModalProvider } from './components/Web3ModalProvider';

// New Header Component
const Header = () => {
    return (
        <header className="bg-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="text-xl font-bold text-white">
                        Token Factory
                    </div>
                    <w3m-button />
                </div>
            </div>
        </header>
    );
};

function App() {
    return (
        <Web3ModalProvider>
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <CreateTokenForm />
                    <TokenList />
                </div>
            </div>
        </Web3ModalProvider>
    );
}

export default App;