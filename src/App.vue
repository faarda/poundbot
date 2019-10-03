<template>
  <div id="app" style="height: 100%;">
    <router-view/>
  </div>
</template>

<script>
  export default{
    created(){

    },
    mounted(){
      feather.replace();
        navigator.permissions.query({name:'geolocation'})
        .then((result) => {
          if(result.state == 'granted'){
            this.getLocation();
          }else if (result.state == 'prompt') {
            alert("Please enable location visibility, this would allow me to accurately state where you currently are and give you weather forcasts");
            this.getLocation();
          }
        });
      
    },
    methods:{
      getLocation(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.getPosition, this.userError);
        } else { 
          alert("Geolocation is not supported by this browser.");
        }
      },
      getPosition(position){
        window.myLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          place: ""
        }

        this.getPlace();
      },
      getPlace(){
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${myLocation.lon},${myLocation.lat}.json?access_token=pk.eyJ1IjoiZmFhcmRhIiwiYSI6ImNrMTl5Z2JmbjA3dWwzZHBhd3R4aW9seDYifQ.E4r2RwW3GWuW4pWJgCfEgg`)
          .then(data => {
            myLocation.place = data.data.features[1].place_name;
          }).catch(err => function(){
            alert("Please check your internet connection");
          });
      },
      userError(error){
         switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("You denied the request for Geolocation.")
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
        }
      }
    }
  }
</script>

