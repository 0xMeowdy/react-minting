import { useEffect } from 'react'

function App() {
	const checkIfWalletIsConnected = () => {
		/*
		 * First make sure we have access to window.ethereum
		 */
		const { ethereum } = window

		if (!ethereum) {
			console.log('Make sure you have metamask!')
			return
		} else {
			console.log('We have the ethereum object', ethereum)
		}
	}

	/*
	 * This runs our function when the page loads.
	 */
	useEffect(() => {
		checkIfWalletIsConnected()
	}, [])

	return (
		<div>
			<div>
				<div className='max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-extrabold text-blue-700 sm:text-4xl'>
						<span className='block'>React Minting</span>
					</h2>
					<p className='mt-4 text-lg leading-6 text-gray-600'>
						Description of collection goes here.
					</p>
					<button className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-50 bg-blue-600 hover:bg-blue-800 sm:w-auto'>
						Mint
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
