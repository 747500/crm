<template lang="pug">

	div
		header(class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow")
			span(class="navbar-brand col-md-3 col-lg-2 me-0 px-3") CRM
			//input(class="form-control form-control-dark" type="text" placeholder="Search" aria-label="Search")/
			Accounts(class="navbar-nav px-3")/

		div(class="container-fluid")
			div(class="row")
				nav(id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse")
					div(class="position-sticky pt-3")
						ul(class="nav flex-column")
							li(
								class="mb-1 nav-item"
								v-for="r in $router.options.routes[0].children"
								:key="r.name"
							)
								router-link(class="nav-link" :to="r.path")
									| {{ r.meta.icon }}
									| {{ r.meta.title }}


			main(class="col-md-9 ms-sm-auto col-lg-10 px-md-4")
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
/*
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
*/
</style>
