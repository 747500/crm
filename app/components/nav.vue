<template>

	<div>
		<header>
			<nav>
				<div v-for="r in $router.options.routes[0].children" :key="r.name">
					<router-link :to="r.path">{{ r.title }}</router-link>
				</div>
			</nav>
		</header>

		<content>
			<router-view></router-view>
		</content>

	</div>

</template>


<script>

export default {

	name: 'Nav',

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
}

nav a:hover {
	/*
	F7DB15
	*/
	background-color: #FEFCAE;
	border-radius: 0.5em 0.5em 0 0;
	border-bottom: 3px solid #FEFCAE;
	text-decoration: none;
}

nav a.router-link-active {
	border-bottom: 3px solid gray;
}

</style>
