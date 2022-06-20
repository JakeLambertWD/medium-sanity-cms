export const Hero = () => {
	return (
		<div className='flex justify-between items-center bg-yellow-400 border-b-[1px] border-black'>
			<div className='px-10 lg:px-32 py-5 space-y-3'>
				<h1 className='text-8xl font-serif max-w-xl'>Stay Curious</h1>
				<h2 className='text-2xl'>Discover stories, thinking, and expertise from writers on any topic.</h2>
			</div>
			<img className='hidden md:inline-flex h-32 lg:h-full' src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png' alt='' />
		</div>
	);
};
