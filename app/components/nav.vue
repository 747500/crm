<template lang="pug">

	div
		Accounts/

		div
			header
				nav
					div(v-for="r in $router.options.routes[0].children" :key="r.name")
						router-link(:to="r.path")
							| {{ r.meta.icon }}
							| {{ r.meta.title }}

					//div
						//SearchDropdown()/

			content
				router-view()/

</template>


<script>

	import Accounts from './Accounts.vue'

	export default {

		name: 'Nav',

		components: {
			Accounts
		},

		data () {
			return {
			}
		},

		watch: {
			'$route' (to, from) {
				document.title = to.meta.title || 'CRM'
			}
	    },

		created () {
		},

		methods: {
		}
	}

</script>

<style>

nav {
	display: flex;
	border-bottom: 1px solid gray;
}

nav > div {
	flex: auto;
	text-align: center;
}

nav a {
	padding: 0.33em 0.33em 0.25em 0.33em;
	display: block;
	text-decoration: none;

	border-radius: 0.5em 0.5em 0 0;
	border: 1px solid transparent;
	border-bottom: 3px solid transparent;
}

nav a:hover {
	background-color: var(--hover-color);
	text-decoration: none;

	border-color: var(--border-color);
	border-bottom-color: var(--hover-color);
}

nav a.router-link-active {
	border-bottom-color: gray;
}

nav a.router-link-active:hover {
	border-bottom-color: gray;
}
</style>
