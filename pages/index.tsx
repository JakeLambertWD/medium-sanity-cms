// external
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

// internal
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { sanityClient, urlFor } from '../sanity';
import { Post } from '../typings';

// get types from the types file
interface Props {
	posts: [Post];
}

export default function Home({ posts }: Props) {
	return (
		<div className='max-w-8xl mx-auto'>
			<Head>
				<title>Medium 2.0</title>
				<link rel='icon' href='https://cdn-icons-png.flaticon.com/512/5968/5968906.png' />
			</Head>
			<Header />
			<Hero />

			<div>
				{posts.map(post => (
					<Link key={post._id} href={`/post/${post.slug.current}`}>
						<div>{post.mainImage && <img src={urlFor(post.mainImage).url()} alt='' />}</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export const getServerSideProps = async () => {
	const query = `
	*[_type == 'post']{
		_id,
		title,
		author -> {
		 name,
		 image
	},
	description,
	mainImage,
	slug
	}
	`;

	const posts = await sanityClient.fetch(query);

	return {
		props: {
			posts
		}
	};
};
