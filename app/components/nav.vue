<template lang="pug">

	div
		header(class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow")
			span(
				class="navbar-brand col-md-3 col-lg-2 me-0 px-3"
			) CRM
			button(
				class="navbar-toggler position-absolute d-md-none collapsed"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#sidebarMenu"
				aria-controls="sidebarMenu"
				aria-expanded="false"
				aria-label="Toggle navigation"
			)
				span(class="navbar-toggler-icon")

			Search(class="w-100")/
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
									span(class="nav-icon") {{ r.meta.icon }}
									span  {{ r.meta.title }}


			main(class="col-md-9 ms-sm-auto col-lg-10 px-md-4")
				router-view()/

</template>


<script>

	import Accounts from './Accounts.vue'
	import Search from './Search.vue'

	export default {

		name: 'Nav',

		components: {
			Search,
			Accounts,
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

.nav-item .nav-link .nav-icon {
	display: inline-block;
	width: 2em;
	text-align: center;
}

.form-control-dark {
    color: #fff;
    background-color: rgba(255, 255, 255, .1);
    border-color: rgba(255, 255, 255, .1);
	border-radius: 0;
}

</style>
