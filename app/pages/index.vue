<template>
	<v-container class='fill-height' fluid>
		<Authed v-if='authenticated' />
		<Login v-else />
	</v-container>
</template>

<script setup lang="ts">

const authenticated = computed(() => userModule().authenticated)

</script>
