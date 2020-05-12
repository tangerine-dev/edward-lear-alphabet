<template>
    <div id="loader">
        <svg class="loading">
            <rect v-for="n in numTicks" :x="getX(n)" :y="height * 0.03" :height="height * 0.9" :width="tickWidth" :key="n" :class="{ full:n<=fullestTick}"></rect>
        </svg>
    </div>
</template>
<script>
export default {
    props: {
        percentLoaded: {
            type: Number,
            default: 0
        }
    },
    data: function () {
        return {
            width: 0,
            height: 0,
            buffer: 0,
            numTicks: 20
        }  
    },
    computed: {
        tickWidth: function () {
            return this.width/this.numTicks * 0.9;
        },
        fullestTick: function () {
            return Math.ceil(this.percentLoaded/100 * this.numTicks);
        }
    },
    mounted: function() {
        setTimeout(this.getWidth(), 250);
    },
    methods: {
        getWidth: function () {
            let div = document.getElementById("loader");
            //console.log(div);
            this.width = div.offsetWidth;
            this.height = div.offsetHeight;
            this.buffer = this.width/this.numTicks*0.1;
        },
        getX: function(n) {
            return this.buffer * 0.5 + (n-1) * this.width / this.numTicks;
        }
    }
}
</script>
<style lang="stylus" scoped>
div.loader
    position relative

svg.loading 
    border 1px solid white
    position relative
    width 100%

    rect
        fill black 
        stroke-wdith: 2
        stroke: white

    rect.full
        fill white
</style>