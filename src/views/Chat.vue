<template>
	<div style="height: 100%;">
        <chat-box :chats="chats" @option-clicked="takeCommand($event)"></chat-box>
        <write-message @new-message="newUserMessage($event)" @today-in-history="todayInHistory" @number-facts="numberFacts" :expecting="expecting"></write-message>
    </div>
</template>

<script>
// @ is an alias to /src

import writeMessage from "@/components/WriteMessage.vue";
import chatBox from "@/components/ChatBox.vue";

export default {
  name: 'chat',
  components: {
    writeMessage,
    chatBox
  },
  data: function(){
    return {
        chats: [],
        expecting: "",
        userName: "",
        defaultOptionsList: {
            title: "You can try",
            options: [
                {
                    text: "Tell me a joke",
                    command: "tell-joke"
                },
                {
                    text: "What is the time?",
                    command: "tell-time"
                },
                {
                    text: "What is the weather like?",
                    command: "tell-weather"
                },
                {
                    text: "Where am i?",
                    command: "tell-location"
                }
            ]
        }
    }
  },
  created(){
    this.expecting = "name";
    this.showLoading();
    this.showMessage({
        person: "bot",
        message: `Good ${this.greetTime}, i’m pound bot. <br>
        I can help you out with so many things, but first what’s your name`
    });
  },
  methods:{
    newUserMessage(message, handle = true){
        this.chats.push({
            person: "user",
            message: message
        });

        if(handle){
            this.handleResponses(message);
        }
    },
    handleResponses(message){
        if(this.expecting == "name"){
            this.userName = message.trim();
            this.showMessage({
                person: "bot",
                message: `Welcome, ${this.userName} <br>
                What would you like to do?`,
                list: this.defaultOptionsList
            });
            this.expecting = "any";

            return;
        }

        if(this.searchString(message, "the time")){
            this.showTime();
            return;
        }else if(this.searchString(message, "time")){
            this.showTime(false);
            return;
        }

        if(this.searchString(message, "location") || this.searchString(message, "where am i")){
            this.showPlace();
            return;
        }else if(this.searchString(message, "place")){
            this.showPlace(false);
            return;
        }

        if(this.searchString(message, "weather")){
            this.showWeather();
            return;
        }else if(this.searchString(message, "temprature")){
            this.showWeather(false);
            return;
        }

        if(this.searchString(message, "joke")){
            this.showJoke();
            return;
        }

        if(this.searchString(message, "history") || this.searchString(message, "tih")){
            this.getHistory();
            return;
        }

        if(this.searchString(message, "number fact") || this.searchString(message, "nf")){
            let cleanMessage = message.trim();
            let strArray = cleanMessage.split(" ");

            let proposedNumber;

            proposedNumber = Number(strArray[strArray.length - 1]);
            if(isNaN(proposedNumber)){
                if(this.searchString(message, "number fact")){
                    proposedNumber = Number(cleanMessage.replace("number fact", ""));
                }else{
                    proposedNumber = Number(cleanMessage.replace("nf", ""));
                }
            }

            if(!isNaN(proposedNumber)){
                this.getFact(proposedNumber);
            }else{
                this.showMessage({
                    person: 'bot',
                    message: `The command "${cleanMessage}" should be followed by a number`
                });
            }
            return;
        }

        this.lost();
    },
    showLoading(){
        this.chats.push({
            person: 'bot',
            loading: true
        });
    },
    showMessage(message){
        setTimeout(()=>{
            if(this.chats.length > 0 && this.chats[this.chats.length - 1].loading){
                this.chats.pop();
            }
            this.chats.push(message);
        }, 1000)
    },
    takeCommand(command){
        this.newUserMessage(command[1], false);
        if(command[0] == "tell-joke"){
            this.showJoke();
        }else if(command[0] == "tell-time"){
            this.showTime();
        }else if(command[0] == "tell-weather"){
            this.showWeather();
        }else if(command[0] == "tell-location"){
            this.showPlace();
        }
    },
    searchString(haystack, needle){
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    },

    createMessage(string, sure = true){
        if(!sure){
            this.showMessage({
                message: "I'm not sure what you meant but, " + string,
                person: "bot"
            })
        }else{
            this.showMessage({
                person: "bot",
                message: string
            });
        }
    },
    lost(){
        this.showMessage({
            person: "bot",
            message: "Sorry i don't understand what that meant",
            list: this.defaultOptionsList
        });
    },
    noNetwork(){
        this.showMessage({
            person: "bot",
            message: "There seems to be a problem with your internet connection, please connect and refresh this page"
        });
    },
    noLocation(){
        this.showMessage({
            person: "bot",
            message: "Sorry i currently don't have access to your location, you can enable it manually then refresh the page."
        });
    },
    showTime(sure = true){
        let time = new Date(Date.now());

        let hours = time.getHours();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        let botDate = hours + ":" + time.getMinutes() + " " + ampm;

        this.createMessage("the time is <b>" + botDate + "</b>", sure);
    },
    showWeather(sure = true){
        this.showLoading();
        if(typeof myLocation == 'undefined'){
            this.noLocation();
        }else{
            axios.get(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${myLocation.lat}&lon=${myLocation.lon}&appid=39944fe43f1decded72ef1c7fbb68547`)
                .then(data => {
                    console.log(data.data);
                    let weather = data.data.weather[0];
                    weather.temprature = data.data.main.temp;
                    this.createMessage("here's the weather for <b>" + myLocation.place + "</b>.", sure);
                    this.showMessage({
                        person: "bot",
                        message: "",
                        weather: weather
                    })
                }).catch(err => {
                    this.noNetwork();
                });
        }
    },
    showJoke(){
        this.showLoading();
        axios.get("https://api.icndb.com/jokes/random")
            .then(data => {
                // console.log(data);
                let joke = data.data.value.joke;
                this.createMessage(joke);
            }).catch(err => {
 
                this.noNetwork();
            });
    },
    showPlace(sure = true){
        this.showLoading();
        if(typeof myLocation == 'undefined'){
            this.noLocation();
        }else{
            this.createMessage("You're currently at <b>" + myLocation.place + "</b>", sure);
        }
    },
    todayInHistory(){
        this.newUserMessage("Today in history", false);
        this.showLoading();
        this.showMessage({
            person: 'bot',
            message: "I can tell you about something that happened today, in history. <br> To request an historical event for today just type \"today in history\" or \"tih\" for short"
        });
        setTimeout(() => {
            this.getHistory();
        }, 1000);

    },
    numberFacts(){
        this.newUserMessage("Number facts", false);
        this.showLoading();
        this.showMessage({
            person: 'bot',
            message: "I can tell you an interesting fact for any number you give me. <br> To get started just type \"number fact\" or \"nf\" followed by any number. <br> For example \"number fact 1\" "
        });  
    },
    getHistory(){
        this.showLoading();
        axios.get("https://cors-anywhere.herokuapp.com/https://history.muffinlabs.com/date")
            .then(data => {
                let events = data.data.data.Events;
                let selectedEvent = this.getRandom(events);
                let linkArray = [];
                selectedEvent.links.forEach(link => {
                    linkArray.push({
                        text: `<a href="${link.link}" target="_blank" rel="noopener noreferrer">${link.title}</a>`,
                        command: ""
                    });
                });
                this.showMessage({
                    person: "bot",
                    message: `<b> ${data.data.date} ${selectedEvent.year} </b>, ${selectedEvent.text}`,
                    list: {
                        title: "You can checkout",
                        options: linkArray
                    }
                });
            }).catch(err => { 
                this.noNetwork();
            });
    },
    getFact(num){
        this.showLoading();
        axios.get(`https://cors-anywhere.herokuapp.com/http://numbersapi.com/${num}`)
            .then(data => {
                let fact = data.data;
                this.showMessage({
                    person: 'bot',
                    message: fact.replace(num, `<b>${num}</b>`)
                });
            })
            .catch(err => {
                this.noNetwork();
            });
    },
    getRandom(items){
        return items[Math.floor(Math.random()*items.length)];
    }
  },
  computed:{
      greetTime(){
        let time = new Date(Date.now());

        let hours = time.getHours();

        if(hours >= 0 && hours < 12){
            return "morning";
        }else if(hours >= 12 && hours < 16){
            return "afternoon";
        }else{
            return "evening";
        }
      }
  }
}
</script>