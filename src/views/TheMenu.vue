<template>
    <div id="lett-menu">
        
        <div class="letters">
            <router-link v-for="letter in letterData" :to="{name:'alphabet-page', params:{letter:letter.letter}}" :key="letter.letter">
                <figure class="letter-btn">
                    <div :style="figureStyle(letter.art.thumbnail)"></div>
                    <h3>{{ letter.letter }}</h3>
                </figure>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: "TheMenu",
    data: function () {
        return {
            letterData: this.$parent.letterData
        }
    },
    mounted: function() {
        this.letterData = this.$parent.letterData;
    },
    methods: {
        figureStyle:function (thumbnail) {
            return {
                backgroundImage: `url("./art/${thumbnail}")`
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
#lett-menu
    height 100%
    padding 1em

    @media (min-width 700px)
        padding 3em

    @media (min-width 1300px)
        padding 3em 5em

.letters
    display flex
    flex-wrap wrap
    max-height 82%
    justify-content center
    @media (min-width 900px)
        margin 8px

    a
        margin 0px


.letter-btn
    width 60px
    height 60px
    position relative
    margin 3px
    display flex
    justify-content center
    align-items center
    border 7px solid transparent
    border-image url(../assets/double-border.png) 33% round
    border-radius 8px

    @media (min-width 400px)
        width 75px
        height 75px
        margin 5px

    @media (min-width 700px)
        width 100px
        height 100px
        border-width 10px
        margin 10px 5px

    @media (min-width 1025px)
        width 140px
        height 140px
        border-width 14px

    @media (min-width 1500px)
        width 175px
        height 175px
        border-width 18px

    div
        background-position 50% 50%
        opacity 0.65
        width 112%  
        height 112%
        left -6%
        top -6%
        background-size cover
        background-repeat no-repeat
        position absolute

    h3
        font-family: masqualero-groove, sans-serif;
        font-size 73px
        position relative
        font-weight 400
        color black 

        @media (min-width 400px)
            font-size 88px

        @media (min-width 700px)
            font-size 113px

        @media (min-width 1025px)
            font-size 150px

        @media (min-width 1500px)
            font-size 210px

</style>