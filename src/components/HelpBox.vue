<template>
    <div class="help-holder">
        <div class="help-content"  @mousedown="$emit('close')"  @touchstart="$emit('close')" >
            <table>
                <tr v-show="mobilePan">
                    <td>
                        <div>
                            <img :src="require('../assets/arrows.png')" alt="left and right arrows" >
                            <img :src="require('../assets/two-fingers.png')" alt="hand with two fingers up." id="pan-hint">
                        </div>
                    </td>
                    <td>Use two fingers to pan the image back and forth.</td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <img :src="require('../assets/circle.png')" alt="small circle" id="circle">
                            <img :src="require('../assets/one-finger.png')" alt="hand with index finger up" class="pt-target" id="tap-hint">
                        </div>
                    </td>
                    <td>Tap <span v-show="!mobilePan">or mouse over </span>to make things move!</td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <img :src="require('../assets/page-outline.png')" alt="outline of poem" >
                            <img :src="require('../assets/one-finger.png')" alt="hand with two fingers up." id="poem-hint">
                        </div>
                    </td>
                    <td>Swipe down or tap the top of the poem to close it.</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    name: "help",
    props: {
        mobilePan: Boolean
    }
}
</script>
<style lang="stylus" scoped>
@keyframes pan
    0%
        transform translateX(20%)

    40%
        transform translateX(60%)

    50%
        transform translateX(60%)

    90%
        transform translateX(20%)

@keyframes swipe
    0%
        transform translate(50%,20%)

    60%
        transform translate(50%,60%)

    70%
        transform translate(50%,60%)

    90%
        transform translate(50%,20%)

@keyframes tap
    0%
        transform translate(20%, 20%)

    40%
        transform translate(60%, 60%)

    50%
        transform translate(60%, 60%)

    90%
        transform translate(20%, 20%)

@keyframes interact 
    0%
        transform scale(1.5, 1.5) translate(5px,-5px)
        
    5%
        transform scale(1.5, 1.5) translate(-3px,3px)

    10%
        transform scale(1.5, 1.5) translate(0px,0px)

    40%
        transform scale(1,1) translate(0px,0px)

    85%
        transform scale(1,1) translate(0px,0px)

    90%
        transform translate(5px,-5px) scale(1.5, 1.5)

    95%
        transform scale(1.5, 1.5) translate(-5px,5px)



div.help-holder
    position absolute
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    color #fffbec

div.help-content
    background rgba(0,0,0,0.65)
    padding 10px
    margin 20px
    text-align center

    button 
        background-color transparent 
        width 40px

        img 
            max-width 100%

table
    max-width 600px
    text-align left
    font-size 1.5em

    div
        width 60px
        height 60px
        margin-right 10px
        position relative

    td 
        padding 10px

        img 
            position absolute
            max-width 70%

    #circle
        max-width 30%
        transform scale(1.5, 1.5) translate(5px,-5px)
        animation interact 4s ease 1s infinite

    #pan-hint
        transform translateX(20%)
        animation pan 5s ease 1s infinite

    #tap-hint
        transform translate(20%, 20%)
        animation tap 4s ease 1s infinite

    #poem-hint
        animation swipe 3.5s ease 1s infinite
        transform translate(50%,20%)
</style>