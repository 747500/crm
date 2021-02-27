<template lang="pug">

	div(class="doc-form-owner")
		label(class="form-label") Собственник
		div(class="select" role="select")

			div(class="container")
				SDoc(
					class="item"
					:oid="selected"
					:key="selected"
				)/
				div(class="controls")
					button(
						class="clear"
						:disabled="!selectedClear"
						@click="selectedClear"
					) 🗙
					button(
						v-if="false === isOpen"
						class="open"
						@click.prevent="listOpen"
					) ﹀
					button(
						v-if="true === isOpen"
						class="close"
						@click.prevent="listClose"
					) ︿

			div(class="list-container" v-if="list.length")
				div(class="list" ref="list")
					a(
						v-for="(item) in list"
						:key="item.title"
						href=""
						class="item"
						@click.prevent="e => onItemClick(e, item)"
						@focus="onItemFocus"
						@blur="onItemBlur"
						@keydown="e => onItemKeydown(e, item)"
					)
						SDoc(:oid="item._id")/

</template>

<script>

	import SDoc from './S/doc.vue'

	export default {

		name: 'DocFormOwner',

		components: {
			SDoc,
		},

		props: {
			oid: String,
			submit: Function,
		},

		data () {
			return {
				selected: null,
				search: '',
				list: [],
				isOpen: false
			}
		},

		created () {

			this.selected = this.$props.oid

		},

		methods: {

			selectedClear () {
				this.selected = null
			},

			listOpen () {

				this.isOpen = true

				this.$http.post('/s',
					{
						q: this.search,
						kind: 'person'
					}
				)
				.then(response => {

					// console.log('* <browser.vue> response:', response)

					//this.total_found = response.body.total_found

					this.list = response.body.result.map(item => {
						return {
							_id: item.oid,
							kind: item.kind,
						}
					})
				})
				.catch(err => {
					console.error(err)
				})

			},

			listClose () {

				this.isOpen = false
				this.list = []

			},

			onItemKeydown (event, item) {

                if ('ArrowUp' === event.key) {
                    event.preventDefault()

                    if (event.target.previousSibling) {
                        event.target.previousSibling.focus()
                    }
                    else {
                        this.$refs.list.lastChild.focus()
                    }
                }

                if ('ArrowDown' === event.key) {
                    event.preventDefault()

                    if (event.target.nextSibling) {
                        event.target.nextSibling.focus()
                    }
                    else {
                        this.$refs.list.firstChild.focus()
                    }
                }

                if ('Home' == event.key) {
                    event.preventDefault()
                    this.$refs.list.firstChild.focus()
                }

                if ('End' == event.key) {
                    event.preventDefault()
                    this.$refs.list.lastChild.focus()
                }

                if ('Enter' == event.key) {
                    event.preventDefault()
                    this.selected = item._id
                }

                if ('Tab' === event.key) {
                    event.preventDefault()
                    this.$refs.input.focus()
                }
            },

            onItemClick (event, item) {
                event.preventDefault()
				this.selected = item._id
				this.listClose()
            },

            onItemBlur (event) {
                event.target.classList.remove('active')
            },

            onItemFocus (event) {
                event.target.classList.add('active')
            },

		}
	}

</script>

<style>

/*
.doc-form-owner {
	height: 6em;
}

.doc-form-owner .select {
}
*/

.doc-form-owner .select {
	width: 100%;
}

.doc-form-owner .select .container {
	border: 1px solid var(--border-color);
	border-radius: 0.25rem;
	display: flex;
	padding: 0;
	margin: 0;
}

.doc-form-owner .select .container .controls {
	width: 2.25rem;
	overflow: hidden;
	flex: initial;
}

.doc-form-owner .select .container .controls button {
	display: block;
	height: 50%;
	text-align: center;
	line-height: 3em;
	background-color: transparent;
	margin: 0;
	padding: 0;
	border: none;
}

/*
.doc-form-owner .select .container .controls a.close {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 0.75rem center;
	background-size: 16px 12px;
}
*/

.doc-form-owner .select .container > .item {
	flex: auto;
	height: 6em;
}

div.list-container {
	height: 1px;
	position: relative;
	width: 100%;
	background-color: red;
}

div.list-container div.list {
	max-height: 33vh;
	position: absolute;
	left: 0;
	right: 0;
	overflow-y: scroll;
	background-color: #fff;
	border: 1px solid var(--border-color);
}

div.list-container .list > a.item {
	display: block;
	margin: 1px;
	padding: 0;
	border: 1px solid var(--border-color);
}

div.list-container .list > a.item.active * {
	background-color: #ff9966;
	font-weight: 700;
}

</style>
