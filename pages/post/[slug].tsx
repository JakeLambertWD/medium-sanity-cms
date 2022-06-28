import { useState } from 'react';
import { GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Header } from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { PostTypes } from '../../typings';

interface Props {
	post: PostTypes;
}

interface IFormInput {
	_id: string;
	name: string;
	email: string;
	comment: string;
}

function Post({ post }: Props) {
	const [submitted, setSubmitted] = useState(false);

	// destructure from react-hook-form
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IFormInput>();

	const onSubmit: SubmitHandler<IFormInput> = data => {
		fetch('/api/createComment', {
			method: 'POST',
			body: JSON.stringify(data)
		})
			.then(() => setSubmitted(true))
			.catch(error => setSubmitted(false));
	};

	return (
		<main>
			<Header />

			<img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()!} alt='' />

			<article className='max-w-3xl mx-auto p-5'>
				<h1 className='mt-10 mb-3 text-3xl'>{post.title}</h1>
				<h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>

				<div className='items-center flex space-x-2'>
					<img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()!} alt='' />
					<p className='font-extralight text-sm'>
						Blog post by <span className='text-green-600'>{post.author.name}</span> - published at {new Date(post._createdAt).toLocaleString()}
					</p>
				</div>

				<div className='mt-10'>
					<PortableText
						className=''
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
						content={post.body}
						serializers={{
							normal: (props: any) => <p className='text-md text-base mb-6' {...props} />,
							h1: (props: any) => <h1 className='text-2xl font-bold my-5' {...props} />,
							h2: (props: any) => <h1 className='text-xl font-bold my-5' {...props} />,
							li: ({ children }: any) => <li className='ml-4 list-disc'>{children}</li>,
							link: ({ children, href }: any) => (
								<a className='text-blue-500 hover:underline' href={href}>
									{children}
								</a>
							)
						}}
					/>
				</div>
			</article>

			<hr className='max-w-lg mx-auto my-5 border border-yellow-500' />

			{submitted ? (
				<div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
					<h3 className='text-3xl font-bold'>Thankyou for submitting your comment!</h3>
					<p>Once it has been approved, it will display below</p>
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>
					<h3>Enjoyed this article?</h3>
					<h4 className='text-3xl font-bold'>Leave a comment below!</h4>
					<hr className='py-3 mt-2' />

					<input {...register('_id')} type='hidden' name='_id' value={post._id} />

					<label className='block mb-5'>
						<span className='text-gray-700'>Name</span>
						<input
							{...register('name', { required: true })}
							className='shadow border rounded py-2 px-3 mt-1 block w-full focus:outline-yellow-500'
							type='text'
							placeholder='Write here..'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>Email</span>
						<input
							{...register('email', { required: true })}
							className='shadow border rounded py-2 px-3 mt-1 block w-full focus:outline-yellow-500'
							type='email'
							placeholder='Write here..'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>Comment</span>
						<textarea
							{...register('comment', { required: true })}
							className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full focus:outline-yellow-500'
							rows={8}
							placeholder='Write here..'
						/>
					</label>

					{/* Error will return when field validation fails */}
					<div>
						{errors.name && <span className='text-red-500 block mb-2'>Name required!</span>}
						{errors.email && <span className='text-red-500 block mb-2'>Email required!</span>}
						{errors.comment && <span className='text-red-500 block mb-2'>Comment required!</span>}
					</div>

					<input
						type='submit'
						className='bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
					/>
				</form>
			)}

			{/* Comments */}
			<div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
				<h3 className='text-4xl'>Comments</h3>
				<hr className='pb-2' />

				{post.comments.map(comment => (
					<div key={comment._id}>
						<p>
							<span className='text-yellow-500'>{comment.name}: </span>
							{comment.comment}
						</p>
					</div>
				))}
			</div>
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
		'comments': *[ _type == "comment" && approved == true && post._ref == ^._id],
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
