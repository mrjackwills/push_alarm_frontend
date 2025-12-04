<template>
	<v-app id='app_back' class='ma-0 pa-0' :class='firefox'>
		<v-main class='ma-0 pa-0'>
			<v-progress-linear
				:active='true'
				aria-label='loading progress bar'
				bg-opacity='0'
				class='mb-n1'
				color='error'
				:indeterminate='loading'
				top
			/>
			<NuxtPage />
			<SnackBar />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { env } from '@/utils/env'
import { headerLinks, json_ld, openGraphHeaders, twitterHeaders } from '@/utils/header'
import { FIREFOX_CSS_NAME } from './types'
const { $pwa } = useNuxtApp()

const route = useRoute()
const browserStore = browserModule()

const title = computed(() => browserStore.title)
const loading = computed(() => loadingModule().loading)

const description = computed(() => browserStore.description)

/// Check if running as PWA
function isPwa () {
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches
	const isIOSStandalone = 'standalone' in window.navigator && window.navigator.standalone
	const isTWA = document.referrer.startsWith('android-app://')
	return isStandalone || isIOSStandalone || isTWA
}

function setVhUnit () {
	document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px')
}

/// Probbaly overkill
function remove_firefox_css () {
	include_firefox_css.value = false
	const styleTags = document.head.querySelectorAll('style')

	for (const tag of styleTags) {
		if (tag.innerHTML.includes(FIREFOX_CSS_NAME)) {
			tag.remove()
		}
	}
}

/// Install PWA
async function _pwa_install () {
	if ($pwa?.swActivated) {
		await $pwa.install()
	}
}

const include_firefox_css = ref(true)
const firefox = computed(() => {
	return include_firefox_css.value ? FIREFOX_CSS_NAME : ''
})

onMounted((): void => {
	if (isPwa()) {
		setVhUnit()
		window.addEventListener('resize', setVhUnit)
	}
	remove_firefox_css()
})

const prefix = 'push alarm'

useHead({
	title: () => {
		return title.value ? `${prefix} - ${title.value}` : prefix
	},

	meta: [
		{
			name: `description`,
			content: (): string => {
				return description.value ? `${prefix} - ${description.value}` : `${prefix} - a foolproof way to wake up in the morning`
			},
		},
		{ name: 'theme-color', content: '#4f00cf' },
		...openGraphHeaders,
		...twitterHeaders,
	],
	link: () => [
		{
			rel: 'canonical',
			href: `${env.domain}${route?.path}`,
		},
		...headerLinks,
	],

	script: [
		json_ld,

	],
})

</script>
