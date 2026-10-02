<template lang="pug">

	//	https://itchief.ru/lessons/html-and-css/how-to-create-simple-modal-window-in-css

	div(class="crm-modal")
		div(class="crm-modal-dialog")
			div(class="crm-modal-content")

				div(
					v-if="$slots.title || $listeners.close"
					class="crm-modal-header"
				)
					div(class="crm-modal-title")
						slot(name="title")

					div(class="crm-modal-buttons")
						bsButton(
							v-if="$listeners.close"
							@click.prevent="() => { $emit('close') }"
							class="btn btn-outline-primary"
						) 🗙
						//×


				div(class="crm-modal-body")
					slot

</template>

<style>

.crm-modal {
	position: fixed;
	/* фиксированное положение */
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	/* цвет фона */
	z-index: 1050;
	display: flex;

	/* opacity: 0; */
	/* по умолчанию модальное окно прозрачно */
	/*
	-webkit-transition: opacity 400ms ease-in;
	-moz-transition: opacity 400ms ease-in;
	transition: opacity 400ms ease-in;
	*/
	/* анимация перехода */
	/*pointer-events: none;*/
	/* элемент невидим для событий мыши */
}

.crm-modal-dialog {
	position: relative;
	width: auto;
	margin: auto;
	max-width: 75rem;
	justify-content: space-between;
	align-items: center;
}

.crm-modal-header {
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-webkit-align-items: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: justify;
	-webkit-justify-content: space-between;
	-ms-flex-pack: justify;
	justify-content: space-between;
	padding: 15px;
}

.crm-modal-title {
	margin-top: 0;
	margin-bottom: 0;
	line-height: 1.5;
	font-size: 1.25rem;
	font-weight: 500;
	width: 100%;
	flex: auto;
}

.crm-modal-buttons {
	flex: initial;
}

.crm-modal-body {
	position: relative;
	-webkit-box-flex: 1;
	-webkit-flex: 1 1 auto;
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	padding: 15px;
	overflow: auto;
}

.crm-modal-content {
	position: relative;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	background-color: #fff;
	-webkit-background-clip: padding-box;
	background-clip: padding-box;
	border: 1px solid rgba(0, 0, 0, .2);
	border-radius: .3rem;
	outline: 0;
	height: 100%;
}

</style>

<script>

import bsButton from './bs/Button.vue'

export default {
	name: 'Modal',

	components: {
		bsButton,
	}
}

</script>
