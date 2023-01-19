<script lang="ts">
  import Repo from './Repo.vue';
  import axios from 'axios';
  import { getRepos } from './getRepos'
  

  export default {
    components: {
      Repo
    },
    data(){
      return {
        search_query: "",
        repositories: [],
        url: "https://google.com/",
        Timer: {
          msg: "",
          lastUpdate: 0,
          currentTimestamp: 0,
          timeOffsetSeconds: 0,
          getlastUpdate: function(){
            fetch("http://localhost:3000/api/lastsynctime")
            .then(res => res.json())
            .then(data => {
              this.lastUpdate = data.time;
            })
          },
          getCurrentTimestamp: function(){
            setInterval(()=>{
              this.currentTimestamp = (new Date).getTime();
              this.timeOffsetSeconds = Math.round((this.currentTimestamp - this.lastUpdate)/1000);
              if (this.timeOffsetSeconds > 60) {
                this.msg = `${Math.round(this.timeOffsetSeconds/60)} minute(s)`;
              } else {
                this.msg = `${this.timeOffsetSeconds} seconds`;
               }
            },1000)
          },

        }
      }
    },
    methods: {
      getLastRefresh(){
        fetch("http://localhost:3000/api/lastsynctime")
        .then(res => res.json())
        .then(data => console.log(data.time))
      },
      resync(){
        fetch('http://localhost:3000/api/resync');
        document.location.reload();
      },
      open(e){
        if (e.target.parentNode.className == "post"){
          window.open(e.target.parentNode.dataset.url,"_blank").focus();
        }
      },
      requestRepos(){
        fetch('http://localhost:3000/api/repositories')
          .then(res => res.json()).then(data => {
            data.forEach(element => {
              if (element.description == "null") {
                element.description = ""
              }
              this.repositories.push(element)
            });
          })
          .then(()=>{
            this.repositories.sort((a,b)=> b.stars-a.stars)
          });
      
      },
      search(){
        this.repositories = [];
        if (this.search_query == '') {
          this.requestRepos()
          return
        }
        if (!isNaN(Number(this.search_query))){
          fetch(`http://localhost:3000/api/repositories?id=${this.search_query}`)
            .then(res => res.json()).then(data => {
              data.forEach(element => {
                if (element.description == "null") {
                  element.description = ""
                }
                this.repositories.push(element)
              });
            })
            .then(()=>{
              this.repositories.sort((a,b)=> b.stars-a.stars)
            });
        } else {
          fetch(`http://localhost:3000/api/repositories?name=${this.search_query}`)
            .then(res => res.json()).then(data => {
              data.forEach(element => {
                if (element.description == "null") {
                  element.description = ""
                }
                this.repositories.push(element)
              });
            })
            .then(()=>{
              this.repositories.sort((a,b)=> b.stars-a.stars)
            });}
        
    }
    },
    beforeMount(){
      this.requestRepos()
      this.Timer.getlastUpdate();
      this.Timer.getCurrentTimestamp();
    }
  }



</script>

<template>
  <div id="viewbox">
    <h1>Trending <strong>GitHub</strong> repositories</h1>
    <form class="search-box" onsubmit="return false">
      <input v-model="this.search_query" placeholder="Search" type="search" v-on:input="this.search()" required/>
    </form>
    <div id="container">
        <Repo v-for="rep in this.repositories" v-bind:data-url="rep.url" :key="rep.id" :repo="rep" @click="open"/>
    </div>
    <br>
    <h6>updated {{ this.Timer.msg }} ago..</h6>
    <img v-on:click="this.resync" style="width: 2em;height: 2em; cursor: pointer;margin: auto auto;display: block; position: relative;" src="/src/assets/refresh.svg"/>
  </div>
  <br>
</template>

<style scoped>  
  

  body {
    margin: 0 !important;
    min-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1 {
    color: rgb(205, 204, 216);
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    position: relative;
    margin: 0 auto;
    padding: 0.2em;
    font-size: 6vh;
    text-align: center;
    background: #161b22;
    text-shadow: rgba(255, 255, 255, 0.26) 0 0 5px;
    user-select: none;
  }

  h6{
    color: #AAA;
    font-size: 1.5em;
    position: relative;
    right: 0px;
    margin: 0.3em;
    width: 100%;
    text-align: center;
  }

  strong {
    color: white;
    text-shadow: rgba(255, 255, 255, 0.287) 0px 0px 10px;
  }

  #container{
    top:10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    flex-direction: column;
    position: relative;
    min-height: 70vh;
  }

  .search-box {
    align-items: center;
    display: flex;
    height: 4em;
    width: 90%;
    margin: auto auto;
  }
  .search-box input[type="search"] {
    display: block;
    margin: auto auto;
    width: 20%;
    height: 80%;
    position: relative;
    vertical-align: middle;
    border: 3px solid gray;
    border-radius: 10px;
    text-align: center;
    font-size: 2em;
    transition: 0.3s;
  }

  .search-box input[type="search"]:focus{
    width: 100%;
  }
</style>
