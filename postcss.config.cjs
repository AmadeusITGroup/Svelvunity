const config = {
	plugins: {
		'postcss-import': {},
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {},
		//But others, like autoprefixer, need to run after,
		autoprefixer: {}
	}
};

module.exports = config;
