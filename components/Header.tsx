import Link from 'next/link';

export const Header = () => {
	return (
		<header className='bg-yellow-400 border-b-[1px] border-black'>
			<div className='flex justify-between px-9 py-3 max-w-7xl mx-auto '>
				<Link href='/'>
					<img src='https://miro.medium.com/max/8978/1*s986xIGqhfsN8U--09_AdA.png' className='object-contain cursor-pointer w-52' />
				</Link>
				<div className='flex'>
					<div className='flex hidden md:inline-flex space-x-5 items-center mr-5 '>
						<h3 className='underline'>About</h3>
						<h3>Contact</h3>
						<h3>Follow</h3>
					</div>
					<div className='flex space-x-5 items-center'>
						<h3>Signin</h3>
						<h3 className='bg-black text-white px-3 py-2 rounded-full'>Get started</h3>
					</div>
				</div>
			</div>
		</header>
	);
};
