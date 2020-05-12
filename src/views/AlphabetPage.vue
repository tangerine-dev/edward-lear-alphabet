<template>
    <div class="alphabet-page" :class="color" @touchmove="touchmoved" @mousemove="mousemoved" 
        @touchend="resetpt" @touchleave="resetpt" @mouseleave="resetpt">
        <animated-art
        :interaction-pt="interactionPt"
        :pan="pan"
        :art="letterObj.art"></animated-art>
        <poem 
        :color="color"
        :interaction-pt="interactionPt" 
        :letter-poem="letterObj.poem"></poem>
        <div class="blocker" :class="color"></div>

        <transition name="custom-classes-transition"
        enter-active-class="animated fadeInUp"
        leave-active-class="animated fadeOutDown">
            <help-box v-if="showHelp" 
            :mobile-pan="mobilePanMode"
            v-on:close="showHelp = false">
        </help-box>
        </transition>
    </div>
</template>
<script>
import AnimatedArt from '@/components/AnimatedArt.vue'
import Poem from '@/components/Poem.vue'
import HelpBox from '@/components/HelpBox.vue'

export default {
    name:"alphabet-page",
    components: {
        AnimatedArt,
        Poem,
        HelpBox
    },
    data: function () {
        return {
            interactionPt: {x: -10, y: -10},
            pan: 0,
            showHelp: false,
            helpTime: 15000, // milliseconds
            lastPanX: -10,
            mobilePanMode: window.innerWidth <900,
            currentLetter: this.$route.params.letter
        }
    },
    watch:{
        $route(to, from) {
            this.currentLetter = this.$route.params.letter;
            this.lastPanX = -10;

            this.mobilePanMode = window.innerWidth < 900;
        }
    },
    mounted() {
        if (this.$parent.letterVisitedCount < 3) {
            //console.log("So far "+this.$parent.letterVisitedCount);
            this.showHelp = true;
            window.setTimeout(function () {
                this.showHelp = false;}.bind(this), 
                this.helpTime);
        } else this.showHelp = false;
    },
    computed:{
        letterObj(){
            return this.$parent.letterData.find(
                letter => letter.letter === this.currentLetter
            );
        },
        color() {
            if (this.letterObj) return this.letterObj.color;
            return "";
        }
    },
    methods: {
        touchmoved (event) {
            if (window.innerWidth < 900 && event.changedTouches.length > 1) {
                let x=event.changedTouches[0].pageX, y=event.changedTouches[0].pageY;
                let x2=event.changedTouches[1].pageX, y2=event.changedTouches[1].pageY;

                let d = Math.sqrt((x - x2)*(x - x2) + 
                            (y - y2)*(y - y2));
                
                if (d < window.innerWidth * 0.75) {
                    //console.log(event.changedTouches[0], event.changedTouches[1]);
                    
                    if (this.lastPanX < 0) this.lastPanX = x;
                    this.pan = this.lastPanX - x;
                    this.lastPanX = x;
                    //console.log("panning: "+this.pan);
                    return;
                } 
            }

            this.lastPanX = -10;
            this.pan = 0;
            let x=event.changedTouches[0].pageX, y=event.changedTouches[0].pageY;
            if (x > 0 && y > 0) {
                this.interactionPt.x = x;
                this.interactionPt.y = y;
            } else this.interactionPt.x = this.interactionPt.y = -10;
            

        },
        mousemoved: function (event) {
            this.interactionPt.x = event.pageX;
            this.interactionPt.y = event.pageY;
        },
        resetpt: function () {
            this.interactionPt.x = this.interactionPt.y = -10;
        }
    }

}
</script>
<style lang="stylus" scoped>

art-red = #e7b39f
art-purple = #b6a6b0
art-yellow = #e9d7a4
art-blue = #bbd4ce
art-green = #b6b68d

.alphabet-page 
    width 100%
    height 101%
    transition background-color 1s

.blocker
    width 100%
    height 45px
    position absolute
    bottom -4px

    @media (min-width 900px)
        width 650px
        height 80px
        left calc(50% - 325px)


.red
    background-color art-red

.purple
    background-color art-purple

.yellow
    background-color art-yellow

.blue
    background-color art-blue

.green
    background-color art-green

</style>