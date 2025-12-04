export const headerUrl = 'https://alarm.mrjackwills.com'
export const headerImage = 'https://alarm.mrjackwills.com/img/icons/og_pa.png'
export const headerDescription = 'Homepage of push alarm'
export const headerTitle = 'push alarm'

export const openGraphHeaders = [
	{ property: 'og:description', content: headerDescription },
	{ property: 'og:image', content: headerImage },
	{ property: 'og:image:height', content: '630' },
	{ property: 'og:image:width', content: '1200' },
	{ property: 'og:locale', content: 'en_GB' },
	{ property: 'og:logo', content: 'https://alarm.mrjackwills.com/img/icons/android-chrome-512x512.png' },
	{ property: 'og:site_name', content: 'push alarm' },
	{ property: 'og:title', content: headerTitle },
	{ property: 'og:type', content: 'website' },
	{ property: 'og:url', content: headerUrl },
]

export const twitterHeaders = [
	{ name: 'twitter:card', content: 'summary_large_image' },
	{ name: 'twitter:description', content: headerDescription },
	{ name: 'twitter:image', content: headerImage },
	{ name: 'twitter:title', content: headerTitle },
	{ name: 'twitter:url', content: headerUrl },
]

export const headerLinks = [
	{ rel: 'apple-touch-icon', sizes: '180x180', href: '/img/icons/apple-touch-icon.png' },
	{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/icons/favicon-32x32.png' },
	{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/icons/favicon-16x16.png' },
	// Update me
	{ rel: 'mask-icon', href: '/img/icons/safari-pinned-tab.svg', color: '#5bbad5' },
]

export const json_ld = {
	type: 'application/ld+json',
	innerHTML: JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Website',
		name: headerTitle,
		description: headerDescription,
		url: headerUrl,
		creator: {
			'@type': 'Person',
			name: 'Jack Wills',
			url: 'https://www.mrjackwills.com',
			image: 'https://www.mrjackwills.com/img/icons/android-chrome-512x512.png',
			sameAs: [
				'https://twitter.com/mrjackwills',
				'https://github.com/mrjackwills',
				'https://bsky.app/profile/mrjackwills.com',
			],
		},
	}),
}
