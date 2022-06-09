// external
import type { NextPage } from 'next';
import Head from 'next/head';

// internal
import { Header } from '../components/Header';

const Home: NextPage = () => {
	return (
		<div className=''>
			<Head>
				<title>Medium 2.0</title>
				<link rel='icon' href='https://cdn-icons-png.flaticon.com/512/5968/5968906.png' />
			</Head>
			<Header />
		</div>
	);
};

export default Home;
