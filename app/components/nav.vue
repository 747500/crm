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

</style>
