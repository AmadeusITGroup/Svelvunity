const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		backgroundColor: (theme) => ({
			...theme('colors'),
			amadeusblue: '#005eb8',
			amadeusdarkblue: '#004485',
			amadeusgray: '#f2f2f2',
			amadeuslightblue: '#E7F2FA'
		}),
		fontFamily: {
			amadeuslight: ['Amadeus-Light'],
			amadeusthin: ['Amadeus-Thin'],
			amadeusregular: ['Amadeus-Regular'],
			sans: ['Amadeus-Regular', 'Source Sans Pro', 'Calibri', 'sans-serif'],
			body: ['Source Sans Pro', 'Calibri', 'sans-serif']
		},
		extend: {
			colors: {
				amadeusdarkblue: 'var(--amadeus-color-darkblue)',
				amadeusblue: 'var(--amadeus-color-blue)',
				amadeuslightblue: 'var(--amadeus-color-lightblue)',
				amadeuspaleblue: 'var(--amadeus-color-paleblue)',
				amadeuseasternblue: 'var(--amadeus-color-easternblue)',
				amadeuswhite: 'var(--amadeus-color-white)',
				amadeusgrey: 'var(--amadeus-color-grey)',
				amadeuspurple: 'var(--amadeus-color-purple)',
				amadeusred: 'var(--amadeus-color-red)',
				amadeusred800: 'var(--amadeus-color-red-800)',
				amadeuslightred: 'var(--amadeus-color-lightred)',
				amadeuscherry: 'var(--amadeus-color-cherry)',
				amadeusdeeporange: 'var(--amadeus-color-deeporange)',
				amadeusorange: 'var(--amadeus-color-orange)',
				amadeuslightorange: 'var(--amadeus-color-lightorange)',
				amadeusyellow: 'var(--amadeus-color-yellow)',
				amadeusgreen: 'var(--amadeus-color-green)',
				amadeuslightgreen: 'var(--amadeus-color-lightgreen)',
				amadeusblack: 'var(--amadeus-color-black)',
				amadeusgray900: 'var(--amadeus-color-gray-900)',
				amadeusgray800: 'var(--amadeus-color-gray-800)',
				amadeusgray700: 'var(--amadeus-color-gray-700)',
				amadeusgray600: 'var(--amadeus-color-gray-600)',
				amadeusgray500: 'var(--amadeus-color-gray-500)',
				amadeusgray400: 'var(--amadeus-color-gray-400)',
				amadeusgray300: 'var(--amadeus-color-gray-300)',
				amadeusgray200: 'var(--amadeus-color-gray-200)',
				amadeusgray100: 'var(--amadeus-color-gray-100)',
				amadeusgray50: 'var(--amadeus-color-gray-50)'
			}
		}
	},

	plugins: []
};

module.exports = config;
