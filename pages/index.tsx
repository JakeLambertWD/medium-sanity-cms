// external
import type { NextPage } from 'next';
import Head from 'next/head';

// internal
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';

const Home: NextPage = () => {
	return (
		<div className='max-w-8xl mx-auto'>
			<Head>
				<title>Medium 2.0</title>
				<link rel='icon' href='https://cdn-icons-png.flaticon.com/512/5968/5968906.png' />
			</Head>
			<Header />
			<Hero />
		</div>
	);
};

export default Home;
