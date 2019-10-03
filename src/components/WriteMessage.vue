<template>
    <div class="write-message">
        <div class="suggestions" v-if="expecting !== 'name'">
            <!-- <span class="suggestion">Basic arithmetic</span> -->
            <span class="suggestion" @click="$emit('today-in-history')">Today in history</span>
            <span class="suggestion" @click="$emit('number-facts')">Number facts</span>
        </div>
        <div class="form-input">
            <form action="" @submit.prevent="newMessage">
                <input type="text" placeholder="Say something" v-model="message">
                <button class="btn btn-round"><span data-feather="send"></span></button>
            </form>                  
        </div>
    </div>
</template>

<script>
	export default{
		name: "writeMessage",
		props:{
			expecting: String
		},
		data: function(){
			return {
				message: ""
			}
		},
		methods:{
			newMessage(){
				this.$emit('new-message', this.message);
				this.message = "";
			}
		},
		mounted(){
			feather.replace ();
		}
	}
</script>