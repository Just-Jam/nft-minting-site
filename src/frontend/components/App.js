import { ethers } from 'ethers';
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import './App.css';
import Navigation from './Navbar';
import Home from './Home';

function App() {

  //React database
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})

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
    //loadContracts(signer)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          <Routes>
            <Route path="/" element={
              <Home/>
            } />
          </Routes>
        </div>
      </div>
  </BrowserRouter>
  );
}

export default App;
