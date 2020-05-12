<template>
  <div id="app" :style="currentLetter? 'overflow: hidden' : ''">
    <transition name="custom-classes-transition"
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown">
      <div class="mini-menu" v-if="showMiniMenu">
          <router-link :to="{name:'home'}">home</router-link>
          <router-link :to="{name:'about'}">about</router-link>
          <router-link :to="{name:'letter-menu'}">letter menu</router-link>
      </div>
    </transition>
    <transition name="custom-classes-transition"
    :enter-active-class="transitionInName"
    :leave-active-class="transitionOutName" mode="out-in">
      <router-view/>
    </transition>
    
    <nav v-if="currentLetter">
      <div class="navigation">
        <router-link :to="{name:'home'}"><img :src="require('./assets/home.png')" alt="home icon" class="lil-icon"></router-link>
        <router-link :to="{name:'about'}" class="text-link">about</router-link>
        <router-link 
        :disabled="currentLetter === 'A'" 
        :event="currentLetter !== 'A' ? 'click' : ''" 
        :style="currentLetter === 'A' ? 'cursor: default' : ''"
        :to="{name:'alphabet-page', params: {letter:previousLetter}}"><img :src="require('./assets/arrow-left.png')" alt="left arrow" class="arrow"></router-link>
        <div class="spacer">
          <div class="current-letter">{{ currentLetter }}</div>
        </div>
        <router-link 
        :disabled="currentLetter === 'Z'" 
        :event="currentLetter !== 'Z' ? 'click' : ''" 
        :style="currentLetter === 'Z' ? 'cursor: default' : ''" 
        :to="{name:'alphabet-page', params: {letter:nextLetter}}"><img :src="require('./assets/arrow-right.png')" alt="right arrow" class="arrow"></router-link>
        <button @click="showInfo = !showInfo" class="info text-link">info</button>
        <router-link :to="{name:'letter-menu'}"><img :src="require('./assets/menu.png')" alt="letter menu icon" class="lil-icon"></router-link>
      </div>
    </nav>
    <transition name="custom-classes-transition"
    enter-active-class="animated fadeInUp"
    leave-active-class="animated fadeOutDown">
    <info-box v-if="currentLetter && showInfo" 
    :citation="citation" 
    v-on:close="showInfo=false"></info-box>
    </transition>
  </div>
</template>
<script>
import * as PIXI from 'pixi.js'
import InfoBox from '@/components/Infobox.vue'

export default {
  name: "App",
  components:{
    InfoBox
  },
  data: function () {
    return {
      alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      currentLetter: this.$route.params.letter,
      letterData: require('./content.json'),
      percentLoaded: 0,
      // 0 - unloaded; 1 - loading; 2 - loaded
      loadingStates: 0,
      showInfo: false,
      showMiniMenu: false,
      transitionInName: 'animated fadeIn',
      transitionOutName:'animated fadeOut',
      letterVisitedCount: 0
    }
  },
  watch: {
    $route(to, from) {

      if (to.params.hasOwnProperty("letter")) {
        this.showMiniMenu = false;
        if (to.params.letter.length == 1 && this.alpha.indexOf(to.params.letter) > -1) {

          this.currentLetter = to.params.letter;
          this.letterVisitedCount ++;
          if (!this.letterObj.loaded) this.loadLetterAssets(this.currentLetter);
          if (this.nextLetter) this.loadLetterAssets(this.nextLetter);
          if (this.previousLetter) this.loadLetterAssets(this.previousLetter);

        } else this.$router.push({name: '404'});

      } else {
        this.currentLetter = null;
        this.showMiniMenu = true;
      }
    }
  },
  mounted() {
    this.letterData.forEach(letter => {
      letter.art.loaded = false;
      letter.art.loading = false;
      });
    this.loadLetterAssets("A");

    if (!this.$route.params.hasOwnProperty("letter")) {
      this.currentLetter = null;
      this.showMiniMenu = true;
    }
  },
  computed: {
    letterObj () {
      if (!this.$route.params.hasOwnProperty("letter")) return null;
      return this.letterData.find(l => l.letter == this.currentLetter);
    },
    citation() {
      if (this.letterObj == null) return null;
      return this.letterObj.citation;
    },
    previousLetter(){
      if (!this.$route.params.hasOwnProperty("letter") || this.currentLetter === "A") return false;
      let idx = this.alpha.indexOf(this.currentLetter);
      return this.alpha.substr(idx - 1, 1);
    },
    nextLetter(){
      if (!this.$route.params.hasOwnProperty("letter") || this.currentLetter === "Z") return false;
      let idx = this.alpha.indexOf(this.currentLetter);
      return this.alpha.substr(idx + 1, 1);
    }
  },
  methods:{
    loadLetterAssets (letter) {
      let lo = this.letterData.find(l=> l.letter == letter);
      if (lo.art.loaded || lo.art.loading) return;
      lo.art.loading = true;
      let loader = new PIXI.Loader();
      loader.baseUrl = './art/';
      //console.log("loading resources for "+letter);
      if (!loader.resources.hasOwnProperty(lo.art.background)) loader.add(lo.art.background);

      lo.art.animatedSprites.forEach((sprite) => {
        if (!loader.resources.hasOwnProperty(sprite.imgPath)) loader.add(sprite.imgPath);
      })
      loader.load((loader, resources) => {
        lo.art.loaded = true;
        lo.art.loading = false;
        lo.art.backgroundTexture = resources[lo.art.background].texture;
        //console.log(resources[lo.art.background].texture);
        lo.art.animatedSprites.forEach( sprite => sprite.texture = resources[sprite.imgPath].texture);
        //console.log("loaded resources for "+letter);
      })
      loader.onError.add((err, wat)=>console.log(err, wat));
    }
  }
}
</script>
<style lang="stylus">

parchment-white = #FFFBEC
links = #DD8B84
img-border = url(assets/double-border.png) 33% round

html, body, #app 
  width: 100%
  height 100%
  margin 0
  background parchment-white
  color black
  font-family: masqualero, sans-serif;
  font-weight: 400;
  font-style: normal;
  user-select none
  --scrollbarBG: parchment-white;
  --thumbBG: lighten(links, 30%)

a
  text-decoration none 
  color links

.mini-menu
  display flex
  justify-content flex-end
  padding 5px

  a
    font-size 1.5em
    padding 0px 10px
    color black

    @media (min-width 700px)
      font-size 1.5em
      padding 7px 20px

    @media (min-width 1025px)
      font-size 2em
      padding 12px 30px

  a.router-link-exact-active
    color links


button 
  touch-action manipulation !important
  background-color black
  border none
  font-size 3em
  font-weight: 400;
  font-family: masqualero-groove, sans-serif;
  font-style: normal;
  color parchment-white

#app
  position relative

div.poem-holder
  position: absolute
  touch-action none
  top: 0px
  left: 0px
  width 100%
  height 100%
  display flex
  flex-direction row
  justify-content center

nav
  position: absolute
  touch-action none
  bottom: 20px
  width 100%
  display flex
  height 30px
  flex-direction row
  justify-content center
  font-size 1em

  @media (min-width 900px)
    height 54px
    font-size 2em
    bottom 32px

  img 
    max-height 40%

    @media (min-width 375px)
      max-height 53%

  img.lil-icon
    max-width 18px

    @media (min-width 900px)
      max-width 24px

  img.arrow
    max-width 51px

    @media (min-width 900px)
      max-width 129px

  div.navigation
    background-color #e7e0d4
    border 2px solid black
    border-radius 30px
    padding 0px 4px
    padding-top 2px
    max-width: 100%;
    width initial
    text-align center

    @media (min-width 900px)
      padding-top 4px
      min-width 773px
      max-width 900px

  a[disabled]
    opacity 0.2

  .text-link
    width 47px
    font-weight 800
    font-size 13px

    @media (min-width 375px)
      font-size 16px

    @media (min-width 900px)
      width 113px
      font-size: 29px;

  a, button
    padding 3px 4px
    color black
    transition opacity 0.5s

    @media (min-width 900px)
      padding 4px 18px

  .current-letter
    height 50px
    width 50px
    top -30px
    font-size 46px
    line-height 48px
    font-weight: 400;
    position absolute
    font-family: masqualero-groove, sans-serif;
    font-style: normal;
    color black
    text-align center
    background-image url(assets/nav-letter-background.png)
    background-size cover
    border-radius 3px
    border none

    @media (min-width 900px)
      height: 92px
      width: 92px
      top -55px
      font-size 87px
      line-height 89px
      

  .spacer
    display inline-block
    position relative
    border none
    width 52px
    border-radius 0px

    @media (min-width 900px)
      width 91px
      
  button 
    background-color transparent 
    border none
    font-size 1em
    font-weight: 400;
    font-family: masqualero, sans-serif;
    font-style: normal;

::-webkit-scrollbar
  width 12px

::-webkit-scrollbar-track
  background-color transparent

::-webkit-scrollbar-thumb
  background-color lighten(links, 30%)
  border 2px double lighten(links, 10%)
  border-radius 10px

.text-left
  text-align left 

.text-right
  text-align right

.text-center
  text-align center
  
</style>
