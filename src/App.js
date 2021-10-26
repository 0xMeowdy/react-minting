import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import myEpicNft from './utils/MyEpicNFT.json'

function App() {
	/*
	 * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
	 */
	const [currentAccount, setCurrentAccount] = useState('')

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
		const CONTRACT_ADDRESS = '0x0c6a83bbd35B0642Ab7983e0c1F02E1553836aDE'
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const connectedContract = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicNft.abi,
					signer
				)

				console.log('Going to pop wallet now to pay gas...')
				let nftTxn = await connectedContract.makeAnEpicNFT()

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

	return (
		<div className='bg-green-200 h-screen'>
			<div>
				<div className='max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>React Minting</span>
					</h2>
					<p className='mt-4 text-lg leading-6 text-gray-600'>
						Description of collection goes here.
					</p>
					{currentAccount === '' ? (
						<button
							onClick={connectWallet}
							className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-50 bg-blue-600 hover:bg-blue-800 sm:w-auto'
						>
							Connect Wallet
						</button>
					) : (
						<button
							onClick={askContractToMintNft}
							className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-50 bg-blue-600 hover:bg-blue-800 sm:w-auto'
						>
							Mint
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default App
