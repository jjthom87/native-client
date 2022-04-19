<template>
  <view class="container">
    <button title="Go to home screen" @press="goToHomeScreen"></button>
    <!-- <button v-bind:onPress="handleBtnClickCount" :title="btnTitle" />
    <text class="text-container">{{btnClickCount}}</text> -->
    <text-input
      class="text-input-container"
      placeholder="Type here to translate!"
      v-bind:onChange="handleInputChange"
    />
    <!-- <text class="text-container">{{changedTextContent}}</text> -->
    <view
      v-for="(result, index) in results"
      :key="index"
      >
        <touchable-opacity>
          <text v-bind:onPress="() => console.log(result)">{{result.description}}</text>
        </touchable-opacity>
    </view>
    <!-- <maps/> -->
    <text class="text-color-primary">Go Fuck Yaself</text>
    <!-- <ul> -->
      <!-- <li class="d-flex justify-content-center" v-for="rec in usersRecs" :key="result.place_id">
        <text>{{rec.place}}</text>
      </li> -->
      <view
        v-for="(rec, index) in usersRecs"
        :key="index"
      >
          <text>{{rec.place}}</text>
      </view>
    <!-- </ul> -->
  </view>
</template>

<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
<script>
    import axios from 'axios';
    import maps from './../react-components/maps.js'

    export default {
      name: 'Search',
      components:{maps},
      data() {
          return {
              usersRecs: [],
              textContent: "",
              btnTitle: "Click Me",
              btnClickCount: 0,
              changedTextContent: "",
              results: []
          }
      },
      props: {
        navigation: {
          type: Object
        }
      },
      mounted() {
        axios.get(`http://localhost:7000/api/user/places`)
            .then(res => {
                this.usersRecs = res.data.usersRecs;
            })
      },
      methods: {
        handleInputChange: async function(e){
          this.changedTextContent=e.nativeEvent.text
          const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'
          const GOOGLE_API_KEY = ''
          const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${this.changedTextContent}`

            try {
              const result = await axios.get(apiUrl)
              if (result) {
                this.results = result.data.predictions
              }
            } catch (e) {
              console.log(e)
            }
        },
        handlePlaceClick: function(result) {
          // this.btnClickCount = this.btnClickCount + 1;
          console.log(result)
        },
        goToHomeScreen() {
          this.navigation.navigate("Home");
        }
      }
    }
</script>
