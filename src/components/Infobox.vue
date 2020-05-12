<template>
    <div class="info-box">
        <button class="info-close" @click="$emit('close')"><img src="../assets/close.png" alt="close button"></button>
        <p class="citation"><strong>{{ citation.title }}</strong>, <em>{{ citation.artist }}</em>. {{ citation.year }}, {{ citation.culture }}. Source: <a :href="citation.permalink" :title="citation.source" target="_blank">{{ citation.source }}</a> </p>
        <p>{{ citation.blurb}}</p>
    </div>
</template>
<script>
export default {
    name: "InfoBox",
    props: {
        citation: Object,
    }
}
</script>
<style lang="stylus" scoped>
div.info-box
    background rgba(0,0,0,0.65)
    padding 10px
    position absolute
    top: 0px
    right 0px

    @media (min-width 900px)
        width 500px
        font-size 1.4em
        padding 30px
        top auto
        bottom 113px

    button 
        background-color transparent 
        width 40px

        img 
            max-width 100%

    p
        color #FFFBEC

p.citation
    font-size 1.1em

</style>
