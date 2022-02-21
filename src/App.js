import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import HDNFT from './utils/HDNFT.json'

function App() {
	/*
	 * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
	 */
	const [currentAccount, setCurrentAccount] = useState('')

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
		const CONTRACT_ADDRESS = '0x9278421702B82F606A208c9dd53994d54341bFBe'
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
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

	const askToBurn = async userTokenId => {
		const CONTRACT_ADDRESS = '0x9278421702B82F606A208c9dd53994d54341bFBe'
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					HDNFT.abi,
					signer
				)

				console.log('Going to pop wallet now to pay gas...')
				let nftTxn = await connectedContract.transferFrom(
					await signer.getAddress(),
					'0x000000000000000000000000000000000000dEaD',
					userTokenId
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
				{/* burning */}
				<div className='max-w-2xl px-4 py-16 mx-auto text-center sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>Burning</span>
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
							onClick={() => askToBurn(tokenId)}
							className='inline-flex items-center justify-center w-full px-5 py-3 mt-8 text-base font-medium bg-blue-600 border border-transparent rounded-md text-gray-50 hover:bg-blue-800 sm:w-auto'
						>
							Burn
						</button>
					)}
					<br />
					<input
						className='my-1 border border-black'
						value={tokenId}
						onChange={e => setTokenId(e.target.value)}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
