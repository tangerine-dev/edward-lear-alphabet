<template>
    <div class="the-fo">
        <h1>Oops! We've wandered away!</h1>
        <p>I don't know what page you're looking for, but please enjoy this other Edward Lear limerick.</p>
        <p class="limerick" v-html="randomLimerick">

        </p>
        <p><em>Thanks to <a href="https://www.nonsenselit.org/Lear/BoN/bon010.html">NonsenseLit.org</a></em></p>
        
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            limericks: [
                "There was an Old Man with a beard,<br>Who said, 'It is just as I feared!<br>Two Owls and a Hen,<br>Four Larks and a Wren,<br>Have all built their nests in my beard!'",
                "There was a Young Lady of Ryde,<br>Whose shoe-strings were seldom untied.<br>She purchased some clogs,<br>And some small spotted dogs,<br>And frequently walked about Ryde.",
                "There was an Old Man with a nose,<br>Who said, 'If you choose to suppose,<br>That my nose is too long,<br>You are certainly wrong!'<br>That remarkable Man with a nose.",
                "There was an Old Man on a hill,<br>Who seldom, if ever, stood still;<br>He ran up and down,<br>In his Grandmother's gown,<br>Which adorned that Old Man on a hill.",
                "There was a Young Lady whose bonnet,<br>Came untied when the birds sate upon it;<br>But she said: 'I don't care!<br>All the birds in the air<br>Are welcome to sit on my bonnet!'",
                "There was a Young Person of Smyrna,<br>Whose Grandmother threatened to burn her;<br>But she seized on the cat,<br>And said, 'Granny, burn that!<br>You incongruous Old Woman of Smyrna!'",
                "There was an Old Person of Chili,<br>Whose conduct was painful and silly,<br>He sate on the stairs,<br>Eating apples and pears,<br>That imprudent Old Person of Chili.",
                "There was an Old Man with a gong,<br>Who bumped at it all day long;<br>But they called out, 'O law!<br>You're a horrid old bore!'<br>So they smashed that Old Man with a gong.",
                "There was an Old Lady of Chertsey,<br>Who made a remarkable curtsey;<br>She twirled round and round,<br>Till she sunk underground,<br>Which distressed all the people of Chertsey.",
                "There was an Old Man in a tree,<br>Who was horribly bored by a Bee;<br>When they said, 'Does it buzz?'<br>He replied, 'Yes, it does!'<br>'It's a regular brute of a Bee!'"
            ]
        }
    },
    computed: {
        randomLimerick() {
            let rand = Math.floor(Math.random() * this.limericks.length);
            return this.limericks[rand];
        }
    }
}
</script>
<style lang="stylus" scoped>
.the-fo
    max-width 1000px
    margin 0px auto
    font-size 1.4em

    a
        padding 0px 10px
</style>
