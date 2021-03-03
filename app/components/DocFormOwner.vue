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
						:disabled="!selected"
						@click="selectedClear"
					) 🗙
					button(
						v-if="false === isOpen"
						class="open"
						@click.prevent="listOpen"
					) &#709;
					button(
						v-if="true === isOpen"
						class="close"
						@click.prevent="listClose"
					) &#708;
			// ︿ ﹀

			div(:class="[ 'list-container', { active: isOpen } ]")
				input(
					ref="filter"
					type="text"
					class="filter"
					:value="search"
					@input="onFilterInput"
					@keydown="onFilterKeydown"
				)/
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
			select: Function,
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

			onFilterInput (event) {
				//console.log('<DocFormOwner.vue> onFilterInput', event)
				this.search = event.target.value
				this.makeSearch()
			},

			onFilterKeydown (event) {
				if ('Escape' === event.key) {
					event.preventDefault()
					this.listClose()
				}
			},

			selectedClear () {
				this.listSelect(null)
			},

			makeSearch () {

				this.$http.post('/doc/s',
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

					if (this.list.length) {
						this.$nextTick(() => {
							//console.log('<DocFormOwner.vue> makeSearch', this)
							this.$refs.filter.focus()
						})
					}
				})
				.catch(err => {
					console.error(err)
				})

			},

			listOpen () {

				this.isOpen = true
				this.makeSearch()
			},

			listClose () {
				this.isOpen = false
				this.list = []
			},

			listSelect(oid) {
				this.selected = oid
				this.$props.select(oid)
				this.listClose()
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
				else
                if ('ArrowDown' === event.key) {
                    event.preventDefault()

                    if (event.target.nextSibling) {
                        event.target.nextSibling.focus()
                    }
                    else {
                        this.$refs.list.firstChild.focus()
                    }
                }
				else
                if ('Home' == event.key) {
                    event.preventDefault()
                    this.$refs.list.firstChild.focus()
                }
				else
                if ('End' == event.key) {
                    event.preventDefault()
                    this.$refs.list.lastChild.focus()
                }
				else
                if ('Enter' == event.key) {
                    event.preventDefault()
					this.listSelect(item._id)
                }
				else
                if ('Tab' === event.key) {
                    event.preventDefault()
                    this.$refs.filter.focus()
                }
				else
				if ('Escape' === event.key) {
					event.preventDefault()
					this.listClose()
				}

            },

            onItemClick (event, item) {
                event.preventDefault()
				this.listSelect(item._id)
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
	width: 100%;
	text-align: center;
	line-height: 3em;
	background-color: transparent;
	margin: 0;
	padding: 0;
	border: none;
}

.doc-form-owner .select .container .controls button.open,button.close {
	transform: scale(2.0,1.0);
}

.doc-form-owner .select .container .controls button:hover:enabled {
	color: darkred;
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

.list-container {
	position: relative;
	height: 0px;
	width: 100%;
	display: none;
}

.list-container.active {
	display: block;
}

.list-container input.filter {
	border: 1px solid var(--border-color);
	margin: 0;
	width: 100%;
}

.list-container .list {
	max-height: 33vh;
	position: absolute;
	left: 0;
	right: 0;
	overflow-y: scroll;
	background-color: #fff;
	border: 1px solid var(--border-color);
	box-shadow: 3px 6px 6px rgba(0, 0, 0, 0.15);
}

.list-container .list > a.item {
	display: block;
	margin: 1px;
	padding: 0;
	border: 1px solid var(--border-color);
}

.list-container .list > a.item.active * {
	background-color: var(--bs-primary);
	color: var(--bs-white);
}

</style>
