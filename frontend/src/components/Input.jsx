const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-white' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-gray-600 bg-opacity-100 rounded-lg border border-gray-600 focus:border-white focus:ring-2 focus:ring-white text-white placeholder-gray-400 transition duration-200'
			/>
		</div>
	);
};
export default Input;
