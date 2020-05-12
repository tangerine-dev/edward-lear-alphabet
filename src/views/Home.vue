<template>
  <div class="home">
    <h1 class="text-left title">AN</h1>
    <table class="name-letters">
      <tr>
        <td class="letter" :style="animationOffset(idx)" v-for="(letter, idx) in firstName" :key="'fn'+idx" >
            <div class="semi" :style="figureStyle(letter.art.thumbnail)"></div>
            <h3>{{ letter.letter }}</h3>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td class="letter" :style="animationOffset(idx + 6)" v-for="(letter, idx) in lastName" :key="'fn'+idx" >
            <div class="semi" :style="figureStyle(letter.art.thumbnail)"></div>
            <h3>{{ letter.letter }}</h3>
        </td>
      </tr>
    </table>
    <h1 class="text-right title">ALPHABET</h1>

    <p>Explore this charming poem written by Edward Lear in 1871 repurposed with animated public domain artwork.<br/> <br/>Mouse over or tap to interact with the art. Start with <strong>A</strong>, or skip around using the letter menu.</p>
    <h2><router-link :to="{name:'alphabet-page', params: {letter:'A'}}">start</router-link></h2>

  </div>
</template>

<script>
// @ is an alias to /src
import ProgressBar from '@/components/ProgressBar.vue'

export default {
  name: 'home',
  components: {
    ProgressBar
  },
  data () {
    return {
      firstName: [],
      lastName: [],
    }
  },
  mounted () {
    let letterData = this.$parent.letterData;

    let fn = "EDWARD", ln = "LEAR";
    for (let i = 0; i < fn.length; i++) {
      let lt = letterData.find(l => l.letter == fn[i]);
      this.firstName.push(lt);
    }

    for (let i = 0; i < ln.length; i++) {
      let lt = letterData.find(l => l.letter == ln[i]);
      this.lastName.push(lt);
    }
  },
    methods: {
        figureStyle:function (thumbnail) {
            return {
                backgroundImage: `url("./art/${thumbnail}")`,

            }
        },
        animationOffset: function(idx) {
          return {
            animationDelay: 3 + idx * 0.15 + 's'
          }
        }
    }
}
</script>

<style lang="stylus" scoped>

@keyframes letterBounce 
  0%
    transform translateY(0px)

  5%
    transform translateY(-20px)
  
  10%
    transform translateY(0px)

@keyframes anBounce 
  0%
    transform translateX(0px)

  5%
    transform translateX(20px)
  
  10%
    transform translateX(0px)

@keyframes alphaBounce 
  0%
    transform translateX(0px)

  5%
    transform translateX(-20px)
  
  10%
    transform translateX(0px)


div.home
  display flex
  flex-direction column
  justify-content space-around
  align-content center
  align-items center
  padding 10px
  max-width: 900px;
  margin: 0px auto;

  .title, .name-letters
    width 100%
    margin 5px 20px

    @media (min-width 700px)
      margin 10px 30px

  h1
    font-weight: 900;
    font-size 2.5em

    @media (min-width 700px)
      font-size 4em


  h1.text-left
    animation anBounce 10s 2.1s infinite


  h1.text-right
    margin-right 14px
    animation alphaBounce 10s 5.7s infinite

    @media (min-width 1025px)
      margin-right -8.3%

  h2 a
    border 5px solid transparent
    border-image url(../assets/double-border.png) 33% round
    font-family masqualero, sans-serif
    font-weight 900 
    font-size 1.5em
    padding 0px 10px

    @media (min-width 700px)
      font-size 2em
      padding 4px 15px
      border-width 10px

  p
    padding 1em
    max-width 800px
    margin 22px 0

    @media (min-width 700px)
      font-size 1.5em

.name-letters
  border-spacing 7px

  td
    width 16%

  td.letter
    border 5px solid transparent
    position relative
    height 47px
    background #FFFBEC
    border-image url(../assets/double-border.png) 33% round
    animation letterBounce 10s infinite

    @media (min-width 500px)
      border-width 7px

    @media (min-width 700px)
      border-width 10px
      height 91px

    @media (min-width 1300px)
      border-width 13px
      height 110px

    div.semi
      background-size cover
      background-position center
      background-repeat no-repeat
      position absolute
      top: -3px
      left: -3px
      width calc(100% + 6px)
      height calc(100% + 6px)
      opacity 0.65

    h3
      font-weight: 400;
      font-family: masqualero-groove, sans-serif;
      font-size: 54px;
      width: 110%;
      left: -5%;
      top: -13px;
      font-style: normal;
      position absolute
      text-align center
      margin 0px

      @media (min-width 700px)
        font-size 120px
        top -31px

      @media (min-width 1300px)
        font-size 150px
        top -39px


a
  touch-action manipulation !important
  text-decoration none
  font-size 3em
  font-weight: 400;
  font-family: masqualero-groove, sans-serif;
  font-style: normal;
  color #2D1F05

div.extra
  h3
    display inline
    padding 0 1em
    
</style>
