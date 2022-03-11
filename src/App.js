import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import HDNFT from './utils/HDNFT.json'

function App() {

	const HD721 = "0x5b8e8028c834Ca6613A7E629A180094DEeA1a9F7"
	/*
	 * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
	 */
	const [currentAccount, setCurrentAccount] = useState('')
	const [remintAddr, setRemintAddr] = useState('')
	const [tokenId, setTokenId] = useState('')

	/*
	 * Gotta make sure this is async.
	 */
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window

		if (!ethereum) {
			console.log('Make sure you have metamask!')
			return
		} else {
			console.log('We have the ethereum object', ethereum)
		}

		/*
		 * Check if we're authorized to access the user's wallet
		 */
		const accounts = await ethereum.request({ method: 'eth_accounts' })

		/*
		 * User can have multiple authorized accounts, we grab the first one if its there!
		 */
		if (accounts.length !== 0) {
			const account = accounts[0]
			console.log('Found an authorized account:', account)
			setCurrentAccount(account)
		} else {
			console.log('No authorized account found')
		}
	}

	/*
	 * Implement your connectWallet method here
	 */
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				alert('Get MetaMask!')
				return
			}

			/*
			 * Fancy method to request access to account.
			 */
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			})

			/*
			 * Boom! This should print out public address once we authorize Metamask.
			 */
			console.log('Connected', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log(error)
		}
	}

	/*
	 * This runs our function when the page loads.
	 */
	useEffect(() => {
		checkIfWalletIsConnected()
	}, [])

	const askContractToMintNft = async () => {

		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					HD721,
					HDNFT.abi,
					signer
				)

				console.log('Going to pop wallet now to pay gas...')
				let nftTxn = await connectedContract.safeMint(
					await signer.getAddress(),
					'token uri goes here'
				)

				console.log('Mining...please wait.')
				await nftTxn.wait()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
				)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	// approve for id of specific existing NFT contract to be allowed to be transferred (burned)
	const setApproval = async (remintAddr) => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					remintAddr,
					HDNFT.abi,
					signer
				)

				console.log('Going to pop wallet now to pay gas...')
				let nftTxn = await connectedContract.approve(
					HD721,
					tokenId
				)

				console.log('Approving for specific NFT...')
				await nftTxn.wait()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
				)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	// transfer to 0x...(burn)
	const askToBurn = async () => {

		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					HD721,
					HDNFT.abi,
					signer
				)

				console.log('Going to pop wallet now to pay gas...')
				let nftTxn = await connectedContract.remint(
					remintAddr,
					await signer.getAddress(),
					tokenId
				)

				console.log('Burning...please wait.')
				await nftTxn.wait()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
				)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='h-screen bg-white'>
			<div>
				{/* minting */}
				<div className='max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>Minting</span>
					</h2>

					{currentAccount === '' ? (
						<button
							onClick={connectWallet}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Connect Wallet
						</button>
					) : (
						<button
							onClick={askContractToMintNft}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Mint
						</button>
					)}
				</div>
				{/* approve for remint */}
				<div className='max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>1. Approve ID within existing contract for reminting</span>
					</h2>
					<div className='mt-10'>
						Contract
						<input
							className='border border-black '
							value={remintAddr}
							onChange={e => setRemintAddr(e.target.value)}
						/>
						<br />
						ID
						<input
							className='border border-black '
							value={tokenId}
							onChange={e => setTokenId(e.target.value)}
						/>
					</div>
					<br />
					{currentAccount === '' ? (
						<button
							onClick={connectWallet}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Connect Wallet
						</button>
					) : (
						<button
							onClick={() => setApproval(remintAddr)}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Transfer
						</button>
					)}


				</div>
				{/* burning */}
				<div className='max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>2. Transfer to 0x... from existing contract (burn existing)</span>
					</h2>
					<div className='mt-10'>
						Contract
						<input
							className='border border-black '
							value={remintAddr}
							onChange={e => setRemintAddr(e.target.value)}
						/>
						<br />
						ID
						<input
							className='border border-black '
							value={tokenId}
							onChange={e => setTokenId(e.target.value)}
						/>
					</div>
					<br />
					{currentAccount === '' ? (
						<button
							onClick={connectWallet}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Connect Wallet
						</button>
					) : (
						<button
							onClick={() => askToBurn(tokenId)}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Burn
						</button>
					)}


				</div>
			</div>
		</div>
	)
}

export default App
