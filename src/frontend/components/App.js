import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import './App.css';
import Navigation from './Navbar';
import Home from './Home';

import NFTAbi from '../contractsData/InspiroNFT.json'
import NFTaddress from '../contractsData/InspiroNFT-address.json'
import { EtherscanProvider } from '@ethersproject/providers';

const fromWei = (num) => ethers.utils.formatEther(num)

function App() {

    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState("Not loaded")
    const [nft, setNFT] = useState({})
    const [nftRead, setNFTRead] = useState({})

    //Metamask login/connect
    const web3Handler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0])
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        })

        window.ethereum.on('accountsChanged', async function (accounts) {
            setAccount(accounts[0])
            await web3Handler()
        })
        loadContracts(signer)
    }

    const loadContracts = async (signer) => {
        const nft = new ethers.Contract(NFTaddress.address, NFTAbi.abi, signer)
        setNFT(nft)
        const tokenCount = await nft.tokenCount()
    }

    const loadContractsWOSigner = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const nftRead = new ethers.Contract(NFTaddress.address, NFTAbi.abi, provider)
        setNFTRead(nftRead)
    }

    useEffect(() => {
        loadContractsWOSigner()
        setLoading("Loaded")
    },[])

    return (
        <BrowserRouter>
            <div className="App">
                <>
                    <Navigation web3Handler={web3Handler} account={account} />
                </>
                <div>
                    <Routes>
                        <Route path="/" element={
                            <Home nft={nft} nftRead={nftRead} account={account}/>
                        } />
                    </Routes>
                </div>
                {loading}
            </div>
      </BrowserRouter>
    );
}

export default App;
