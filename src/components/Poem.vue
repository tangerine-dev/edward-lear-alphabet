<template>
    <div id="animated-poem" class="poem" @touchstart="md = true" @touchend="md = false" @mousedown="md = true" @mouseleave="md = false" @mouseup="md = false" :class="{open: open}">
        
        <div class="button-holder">
            <button @click="open = !open; resetChars()" class="top-btn"></button>
            <button @click="open = !open" class="corner"></button>
        </div>
        <div class="first-letter" :style="firstLetterStyle">
            <div class="back">
                {{ letterPoem[0] }}
            </div>
            <div class="front">
                {{ letterPoem[0] }}
            </div>
        </div>

    </div>
</template>
<script>
import * as Splitting from 'splitting'

export default {
    props: {
        letterPoem: String,
        interactionPt: Object,
        color: String
    },
    data: function() {
        return {
            splitPoem: [],
            offsetTop: -1,
            interactionDist: Math.ceil(Math.sqrt(window.innerWidth))+2,
            startY: -100,
            startX: -100,
            md: false,
            open: true,
            colors: {
                red : "#e7b39f",
                purple : "#b6a6b0",
                yellow : "#e9d7a4",
                blue : "#bbd4ce",
                green : "#b6b68d",
            }
        }
    },
    watch: {
        letterPoem: function (oldValue, newValue) {
            this.addSplitPoem();

            this.open = true;
        },
        interactionPt: {
            deep: true,

            handler () { this.animateChars(); }
        }
    },
    computed: {
        closeClass: function () {
            return "close "+this.color;
        },
        firstLetterStyle: function() {
            return {
                background: this.colors[this.color]
            }
        }
    },
    mounted: function () {
        //console.log(Splitting)
        this.addSplitPoem();
    },
    methods: {
        animateChars: function () {
            if (this.interactionPt.y - 40 > 0) {
                if (this.startY > 0) {
                    let swipe = this.interactionPt.y - this.startY;
                    let xDist = this.interactionPt.x - this.startX;
                    //console.log(swipe);
                    let range = window.innerWidth < 900 ? 60 : 120;
                    if (swipe > range && xDist < range * 0.5 && this.md == true) {
                        this.open = false;
                    }
                } else {
                    this.startY = this.interactionPt.y;
                    this.startX = this.interactionPt.x;
                }
            } else {
                this.startY = -10;
                this.startX = -10;
            }

            if (this.offsetTop < 0) {
                let div = document.getElementById('animated-poem');
                this.offsetTop = div.offsetTop;
            }
            for (let i = 0; i < this.splitPoem.length; i++) {
                let char = this.splitPoem[i];
                if (char == null || char.offsetParent == null) continue;
                //console.log(this.splitPoem[i].offsetLeft)
                let pos = [char.offsetLeft + char.offsetParent.offsetLeft, char.offsetTop + char.offsetParent.offsetTop];
                let dist = this.distance(...pos, this.interactionPt.x , this.interactionPt.y-40);
                if (dist < this.interactionDist) {
                    char.classList.add("close");
                    char.classList.add(this.color);
                } else {
                    char.classList.remove("close");
                    char.classList.remove(this.color);
                }

            }
        },
        resetChars: function () {
            for (let i = 0; i < this.splitPoem.length; i++) {
                let char = this.splitPoem[i];
                if (char == null || char.offsetParent == null) continue;
                char.classList.remove("close");
                char.classList.remove(this.color);
            }
        },
        addSplitPoem: function () {
            let div = document.getElementById('animated-poem');

            let oldP = document.querySelector(`#animated-poem p`);
            if (oldP != null) {
                div.removeChild(oldP);
            }

            let newP = document.createElement("p");
            let ds = document.createAttribute("data-splitting");
                newP.setAttributeNode(ds);

                newP.innerHTML = this.letterPoem.substring(1);
            
            div.appendChild(newP);

            window.setTimeout(function() {
                this.splitPoem = Splitting({by:"chars"})[0].chars;
                this.splitPoem[0].classList.add("big-letter");

            }.bind(this), 250);

        },
        // Utilities -------------------------------------------
        /**
         * Everyone's favorite distance formula
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2)*(x1 - x2) + 
                            (y1 - y2)*(y1 - y2));
        },
    }
}
</script>
<style lang="stylus">

art-red = #9f6853
art-yellow = #9d884e
art-green = #6e6e47
art-blue = #427166
art-purple = #5c3b50

div.poem
    background-image url(../assets/page-background-inactive.png)
    background-size cover
    background-repeat no-repeat
    background-position-x: 50% 
    position absolute
    bottom 0px
    left calc(50% - 175px)
    touch-action none
    padding 75px 0px
    transform translate(0, 210px)
    transition all 1s
    width 350px 
    height auto 
    font-size 1em
    user-select none
    cursor pointer

    @media (min-width 900px)
        width 640px
        left calc(50% - 320px)
        transform translate(0, 360px)
        font-size 1.5em
        bottom 71px
        padding-top: 123px;
        padding-bottom: 34px;

    div.button-holder
        position relative

        button
            position absolute
            z-index 900
            background transparent

        button.top-btn
            height 76px
            top -65px
            left 0px
            width 100%

            @media (min-width 900px)
                top -100px

        button.corner
            width 57px
            height 61px
            top 0px
            right 13px

            @media (min-width 900px)
                top -20px
                width 95px
                height 95px

    p
        color #2C2E2D
        margin-left 108px
        z-index 800
        font-weight 600
        

        @media (min-width 900px)
            margin-left 185px
            font-size 1.2em

    span.word span 
        transition: all 0.25s
        color #2C2E2D
        display inline-block
        transform translate(0,0)

    span.word span.close
        transform translate(0,-10px)

        @media (min-width 500px)
            transform translate(0,-20px)

    .red
        color art-red !important

    .purple
        color art-purple !important

    .yellow
        color art-yellow !important

    .blue
        color art-blue !important

    .green
        color art-green !important

div.first-letter
    transition background-color 1s
    width 50px
    height 50px
    border 5px solid transparent
    position absolute
    left 35px
    border-image url(../assets/double-border.png) 33% round

    @media (min-width 900px)
        left 56px
        width 95px
        height 95px
        border-width 8px

    div.front, div.back
        font-size 64px
        position absolute
        top -16px
        left: -10px
        width: 70px;
        text-align: center;

        @media (min-width 900px)
            font-size 110px
            top -23px
            width 115px

    div.front
        font-weight: 400;
        color black
        font-family: masqualero-groove, sans-serif;
        font-style: normal;

    div.back
        color white
        font-weight 900


div.poem.open
    background-image url(../assets/page-background.png)
    transform translate(0px, 0)
        
        
</style>