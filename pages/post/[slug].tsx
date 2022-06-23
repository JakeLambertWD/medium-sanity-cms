import { GetStaticProps } from 'next';
import { Header } from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { PostTypes } from '../../typings';

interface Props {
	post: PostTypes;
}

function Post({ post }: Props) {
	return (
		<main>
			<Header />
		</main>
	);
}

export default Post;

// When exporting a function called getStaticPaths from a page that uses Dynamic Routes, Next.js will statically pre-render all the paths specified by getStaticPaths.
export const getStaticPaths = async () => {
	// query to get the slug of every post
	const query = `
  *[_type == 'post']{
    _id,
    slug {
      current
    }
  }
  `;

	// use the query to fetch these posts
	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: PostTypes) => ({
		params: {
			slug: post.slug.current
		}
	}));

	// return an array of paths
	return {
		paths,
		fallback: 'blocking' // block the page from showing with a 404
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	// query to get all the details from each post via its slug
	const query = `
  *[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug,
    body
  }
  `;

	// the second parameter is injected into the query dynamically
	const post = await sanityClient.fetch(query, {
		slug: params?.slug
	});

	// if no post then return 404 page
	if (!post) {
		return {
			notFound: true
		};
	}

	return {
		props: {
			post
		},
		revalidate: 60 // after 60 seconds, it'll update the old cache (meaning, if there were any updates on the blog, this will display to the user)
	};
};
