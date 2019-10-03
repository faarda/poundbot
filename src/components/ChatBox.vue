<template>
	<div class="chat-box pound-scrollbar" id="mychat-box">
		<div v-for="(chat, id) in chats" class="chat" :class="chat.person == 'bot' ? 'bot-chat' : 'user-chat'" :key="id">
			<div class="bot-img" v-if="chat.person == 'bot' && ( id - 1 >= 0 ? chats[id-1].person !== 'bot' : true )">
                <img src="@/assets/pound-logo.png" alt="">
            </div>
            <div v-if="chat.person == 'bot'" class="bot-message message">
				<div v-if="typeof chat.loading != 'undefined'">
					<img src="@/assets/loading.gif" alt="" width="80px">
				</div>
				<div v-else>
					<span v-html="chat.message"></span>

					<div class="message-list" v-if="chat.list && chat.list.options.length > 0">
						<h4>{{chat.list.title  | capsfirst}}</h4>
						<ul>
							<li v-for="(item, myKey) in chat.list.options" @click="item.command !== '' ? $emit('option-clicked', [item.command, item.text]) : ignore" :key="myKey" v-html="item.text"></li>
						</ul>
					</div>

					<div v-if="chat.weather" class="weather">
						<div class="weather-img">
							<img :src="'http://openweathermap.org/img/w/' + chat.weather.icon + '.png'" alt="">
						</div>
						<h3>{{(chat.weather.temprature - 273.15).toFixed(2)}}&deg;C</h3>
						<p class="weather-summary" style="text-transform: capitalize;">{{chat.weather.description}}</p>
					</div>
				</div>
            </div>
            <div class="user-message message" v-else>
            	{{chat.message}}
            </div>
		</div>	
    </div>
</template>

<script>
	export default{
		name: "chatbox",
		props: {
			chats: {
				required: true,
				type: Array
			}
		},
		updated(){
			let chatBoxEl= document.getElementById("mychat-box");
    		chatBoxEl.scrollTo({
				  top: chatBoxEl.scrollHeight,
				  left: 0,
				  behavior: 'smooth'});
		},
		methods:{
			ignore(){
				// do nothing
			}
		}
	}
</script>