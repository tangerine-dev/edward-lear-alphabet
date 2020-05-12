<template>
    <div class="dedication">
        <h1>About</h1>
        <div class="img">
            <img src="../assets/Edward_Lear_self-caricature.png" alt="Edward Lear Self-Caricature">
            <em>A Self-Caricature by Lear, 1870, via the <a href="https://brbl-dl.library.yale.edu/vufind/Record/3446944?image_id=1381087">Beinecke Library</a></em>
        </div>
        <p>Edward Lear was a British poet who lived from 1812 - 1888.  He is known for his clever limericks and multitudes of alphabet poems, most of which he animated himself.  If you're interested, you can see his illustrations for this poem <a href="https://www.gutenberg.org/files/13650/13650-h/13650-h.htm#a2">here</a>.</p>
        <p>One of my main pieces of inspiration for this project was <a href="https://www.amazon.com/Edward-Lear-Alphabet/dp/0060281138">this book</a> which we borrowed from the library and then subsequently purchased.  Reading it brought back memories of my mother reading me the poem as a child, and my greatest hope is that this animation might create memories for another generation of children.</p>
        <h2>This work is dedicated to</h2>
        <ul>
            <li>The healthcare workers, first responders, delivery workers, and grocery store employees who put their lives at risk so those of us with non-essential jobs can stay home.</li>
            <li>All those who have lost their jobs during the Coronavirus pandemic.</li>
            <li>All the brand new homeschooling parents in the world who never thought this was something they'd wind up doing.</li>
            <li>The Coronavirus victims and their families.</li>
        </ul>
        <h2>Image Sources</h2>
        <ul>
            <li>The <a href="https://www.metmuseum.org/art/collection" target="_blank" title="The Met's Open Access Collection">Metropolitan Museum of Art</a>.  May they pull through this disaster and live to keep protecting and sharing great art.</li>
            <li>The <a href="https://publicdomainreview.org/" target="_blank" title="The Public Domain Review">Public Domain Review</a></li>
            <li>The <a href="https://www.nga.gov/" target="_blank" title="The National Gallery of Art">National Gallery of Art</a></li>
            <li>The <a href="https://www.biodiversitylibrary.org" target="_blank" title="The Biodiversity Heritage Library">Biodiversity Heritage Library</a></li>
            <li>The <a href="https://www.rijksmuseum.nl/en" target="_blank" title="The Rijksmuseum">Rijksmuseum</a></li>
            <li>The <a href="https://collection.barnesfoundation.org/" target="_blank" title="The Barnes Foundation">Barnes Foundation</a></li>
            <li>The <a href="https://archive.org/" target="_blank" title="The Internet Archive">Internet Archive</a></li>
        </ul>
        <h2>Credits</h2>
        <ul>
            <li>UI Design- <a href="https://bbanditt.com/" target="_blank" title="Haley's portfolio">Hakey Wakefield</a></li>
            <li>Development and Animation - <a href="http://tangerinedev.com" target="_blank" title="Simone's website">Simone Seagle</a></li>
            <li>Framework - <a href="https://vuejs.org/" target="_blank" title="Use Vue. It's my favorite.">Vue.js</a></li>
            <li>Poetry splitting - <a href="https://splitting.js.org/" target="_blank" title="Splitting JS.">Splitting.js</a></li>
            <li>Transitions - <a href="https://animate.style/" target="_blank" title="Animate.css - for those of us who are too lazy to write them ourselves">Animate.css</a></li>
            <li>Font- <a href="https://fonts.adobe.com/fonts/masqualero" target="_blank">Masqualero</a>, from Adobe Fonts</li>
        </ul>
        <p>May we all emerge from this stronger than we ever knew we could be.</p>
    </div>
</template>
<style lang="stylus" scoped>
div.dedication
    max-width 1000px
    margin 0px auto
    font-size 1.2em
    padding 10px

    .img 
        float: right;
        max-width: 50%;
        padding 10px
        font-size 0.8em

        @media (min-width 900px)
            max-width 41%
            padding 25px

        img 
            max-width 100%

    @media (min-width 700px)
        padding 1em 4em
</style>