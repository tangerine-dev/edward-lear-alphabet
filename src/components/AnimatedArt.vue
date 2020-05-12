<template>
    <div class="art-canvas" id="art-canvas">
        <div v-if="loading" class="loading" >
            <img :src="require('../assets/hourglass.png')" alt="hourglass">
        </div>
    </div>
</template>
<script>
import * as PIXI from 'pixi.js'

export default {
    props: {
        art: Object,
        interactionPt: Object,
        pan: Number
    },
    data: function () {
        return {
            scale: 1,
            parentDiv: null,
            width: 0, height: 0,
            app: null,
            activeSprites: [],
            frame: 0,
            loading: true,
            panOffset: 0,
            panChange: 0,
            artWidthOverflow: 0
        }
    },
    computed: {
        interactionDistance: function () {
            let multiplier = this.width < 850 ? 1.7 : 1;
            return Math.min(this.width, this.height) * 0.2 * multiplier;
        },
        transformedPt: function() {
            let pt = {
                x: this.interactionPt.x - 0.5 *(window.innerWidth - this.width),
                y: this.interactionPt.y
            }

            if (pt.x > this.width) pt = {x: -10, y: -10};

            return pt;
        }
    },
    watch: {
        pan: function (newVal) {
            if (this.artWidthOverflow < 1) {
                this.panOffset = 0;
                this.panChange = 0;
                return;
            }
            let po = this.panOffset - newVal * 2.2;
            this.panChange = this.panOffset * 1.0;
            this.panOffset = Math.min(0, Math.max(po, -1 * this.artWidthOverflow));
            this.panChange -= this.panOffset;
        },
        art: function (newValue) {
            if (this.app == null) return;

            // Check if it's loaded, if not, keep pinging it until it's done
            //console.log("We ready?", newValue.loaded, newValue.loading);
            if (newValue.loaded == true) this.resetArt();
            else {
                //console.log("Not loaded yet!");
                this.loading = true;
                window.setTimeout(this.waitForLoad, 500);
                }
        }
    },
    mounted: function () {
        //console.log("We ready?", this.art.loaded, this.art.loading);
        // This all has to be timeouts because the DOM element has to be ready to make the app, and we also have to have all the sprites ready to show the animation
        if (this.art.loaded == true) window.setTimeout(this.createPixiApp, 200);
        else window.setTimeout(this.waitForCreate, 500);

        window.addEventListener('resize', this.resizeApp);
        
    },
    methods: {
        waitForLoad() {
            this.loading = true;
            //console.log("Checking if loaded!");
            if (this.art.loaded) this.resetArt();
            else window.setTimeout(this.waitForLoad, 500);
        },
        waitForCreate() {
            this.loading = true;
            //console.log("Checking if loaded!");
            if (this.art.loaded) this.createPixiApp();
            else window.setTimeout(this.waitForCreate, 500);
        },
        resetArt() {
            this.loading = false;
            //console.log("Updated art", this.art);
            this.frame = 0;
            this.animatedSprites = [];
            this.resizeApp();
            this.loadSprites();
        },
        createPixiApp: function () {
            this.loading = false;
            //console.log("creating pixi app", this.art)
            this.scaleCanvas(this.art);
            
            this.app = new PIXI.Application({width: this.width, height: this.height});

            this.parentDiv = document.getElementById("art-canvas");
            this.parentDiv.appendChild(this.app.view);

            this.app.ticker.add(this.onFrame);

            if (this.art != null) this.loadSprites();
        },
        resizeApp: function () {
            this.scaleCanvas(this.art);

            if (this.app != null) {
                this.app.renderer.resize(this.width, this.height);

                for (let i = 0; i < this.activeSprites.length; i++) {
                    let sprite = this.activeSprites[i];
                    sprite.scale.set(this.scale);

                    // Check if it's a bezier rope sprite.
                    if (typeof(sprite.points) === "undefined") {

                        sprite.x = sprite.home.x * this.scale + this.panOffset;
                        sprite.y = sprite.home.y * this.scale;
                    }
                }
            }
        },
        scaleCanvas: function (art) {
            let buffer = window.innerWidth < 900 ? 80 : 160;
            let winWidth = window.innerWidth - 10;
            let winHeight = window.innerHeight - buffer;


            let artWidth = art != null?  art.backgroundTexture.width : winWidth;
            let artHeight = art != null? art.backgroundTexture.height : winHeight;

            let winAspect = winWidth / winHeight;
            let artAspect = artWidth / artHeight;

            if (winWidth < 900 && artAspect > winAspect) {
                //console.log("Mobile pan mode! ", winAspect, artAspect);
                this.scale = winHeight/artHeight;
                this.width = winWidth;
                this.height = winHeight;

                this.artWidthOverflow = this.scale * artWidth - this.width;
                this.panOffset = this.artWidthOverflow * -0.5;
            } else {

                this.scale = Math.min(winWidth/artWidth, winHeight/artHeight);
                this.width = artWidth * this.scale;
                this.height = artHeight * this.scale;
                this.panOffset = 0;
                this.artWidthOverflow = 0;
            }

        },
        loadSprites: function () {
            if (this.art == null || typeof(this.art) === "undefined") return;
            if (this.width < 1) this.scaleCanvas();

            let backgroundSprite = new PIXI.Sprite(this.art.backgroundTexture);
                backgroundSprite.scale.set(this.scale);
            backgroundSprite.home = {x: 0, y: 0};
            backgroundSprite.interact = sprite => this.mask(sprite);
            this.activeSprites.push(backgroundSprite);
            

            this.app.stage.addChild(backgroundSprite);

            for (let i = 0; i < this.art.animatedSprites.length; i++) {
                let component = this.art.animatedSprites[i];
                let aniSprite = new PIXI.Sprite(component.texture);
                aniSprite.x = component.location.x * this.scale + this.panOffset;
                aniSprite.y = component.location.y * this.scale;
                aniSprite.home = component.location;
                aniSprite.scale.set(this.scale);
                switch(component.behavior) {
                    case "spin":
                        aniSprite.anchor.set(0.5);
                        aniSprite.speed = component.speed;

                        aniSprite.interact = sprite => this.spin(sprite);
                        break;
                    
                    case "teeter":
                        aniSprite.anchor.set(0.5);
                        aniSprite.speed = component.speed;
                        aniSprite.baseSpeed = component.speed;
                        aniSprite.locOffset = component.distance;
                        aniSprite.angle = component.angle;
                        aniSprite.offset = component.offset;
                        aniSprite.distance = component.distance;
                        
                        aniSprite.interact = sprite => this.teeter(sprite);
                        break;

                    case "swing":
                        aniSprite.anchor.set(...component.anchor);
                        aniSprite.speed = component.speed;
                        aniSprite.baseSpeed = component.speed;
                        aniSprite.angleRange = component.angleRange;
                        aniSprite.interact = sprite => this.swing(sprite);
                        break;

                    case "spring":
                        aniSprite.anchor.set(0.5);
                        aniSprite.speed = component.speed;
                        aniSprite.damping = component.damping;
                        aniSprite.leash = component.leash;
                        aniSprite.vx = 0;
                        aniSprite.vy = 0;
                        aniSprite.interact = sprite => this.spring(sprite);
                        break;

                    case "flip":
                        aniSprite.anchor.set(0);
                        aniSprite.interact = sprite => this.flip(sprite);
                        if (typeof(component.toFollow) != "undefined") {
                            aniSprite.toFollow = component.toFollow;
                        } else aniSprite.toFollow = null;
                        aniSprite.flipX = component.flipX;
                        aniSprite.rightImg = component.rightImg;

                        break;

                    case "flip-y":
                        aniSprite.anchor.set(0);
                        aniSprite.interact = sprite => this.flipY(sprite);
                        if (typeof(component.toFollow) != "undefined") {
                            aniSprite.toFollow = component.toFollow;
                        } else aniSprite.toFollow = null;
                        aniSprite.flipY = component.flipY;
                        aniSprite.topImg = component.topImg;

                        break;

                    case "particle":
                        aniSprite.interact = sprite => this.particle(sprite);
                        aniSprite.angle = component.angle;
                        aniSprite.baseLocation = component.location;
                        aniSprite.distance = component.distance;
                        aniSprite.spread = component.spread;
                        aniSprite.speed = component.speed * (Math.random() * component.spread + 1 - component.spread * 0.5);
                        aniSprite.vx = aniSprite.speed * Math.cos(component.angle);
                        aniSprite.vy = aniSprite.speed * Math.sin(component.angle);
                        aniSprite.started = false;
                        for(let i = 0; i < component.count; i++) {
                            this.addParticle(component.texture, component.location,component.startRadius, component.distance, component.spread, component.angle, component.speed);
                        }

                        break;
                    
                    case "bezier-rope":
                        // We're actually going to dispose of the anisprite because we need to make a different kind of sprite for this to work, and I'm lazy. 
                        aniSprite.interact = sprite => this.mask(sprite);
                        aniSprite.alpha = 0;
                        aniSprite.x = -1000;
                        aniSprite.y = -1000;

                        let points = [];
                        for (let p = 0; p < component.points; p++) {
                            let t = p / (component.points-1);
                            let nextP = this.getBezierPoint(t, component.control);
                            points.push(new PIXI.Point(nextP.x , nextP.y));
                        }

                        // Now we need to make the rope sprite
                        let ropeSprite = new PIXI.SimpleRope(component.texture, points);
                            //ropeSprite.x = component.location.x;
                            //ropeSprite.y = component.location.y;
                            ropeSprite.scale.set(this.scale);
                            ropeSprite.points = points;
                            ropeSprite.control = component.control; 

                            ropeSprite.interact = sprite => this.bezier(sprite);
                            this.app.stage.addChild(ropeSprite);
                            this.activeSprites.push(ropeSprite);
                        break;

                    case "random-follow":
                        aniSprite.anchor.set(0.5);
                        aniSprite.bounds = component.bounds;
                        aniSprite.baseSpeed = component.speed;
                        aniSprite.targetPt = {
                            x: component.location.x * this.scale,
                            y: component.location.y * this.scale
                        };
                        aniSprite.interact = sprite => this.randomFollow(sprite);
                        break;

                    case "watch":
                        aniSprite.anchor.set(0.5);
                        aniSprite.tether = component.tether;
                        aniSprite.interact = sprite => this.watch(sprite);
                        break;

                    case "point":
                        aniSprite.anchor.set(0, 0.5);
                        aniSprite.angleRange = component.angleRange;
                        aniSprite.targetAngle = Math.min(...component.angleRange) + 0.5 * (Math.max(...component.angleRange) - Math.min(...component.angleRange));
                        aniSprite.interact = sprite => this.point(sprite);
                        aniSprite.speed = 0.006;
                        break;

                    case "path-follow":
                        aniSprite.anchor.set(0.5);
                        aniSprite.points = component.points;
                        aniSprite.targetPt = component.location;
                        aniSprite.easing = Math.random() * 0.6 + 0.1;
                        aniSprite.pathLength = this.distance(component.points[0].x, component.points[0].y, component.points[1].x, component.points[1].y);
                        aniSprite.interact = sprite => this.pathFollow(sprite);
                        break;
                    
                    case "mask":
                        // This actually does nothing but be there
                        aniSprite.anchor.set(0);
                        aniSprite.interact = sprite => this.mask(sprite);
                        break;
                }
                this.app.stage.addChild(aniSprite);
                this.activeSprites.push(aniSprite);
            }

            if (typeof(this.art.masks) === "undefined") return;
            for (let i = 0; i < this.art.masks.length; i++){
                let maskComponent = this.art.masks[i];
                let maskSprite = new PIXI.Sprite(maskComponent.texture);
                maskSprite.x = maskComponent.location.x * this.scale + this.panOffset;
                maskSprite.y = maskComponent.location.y * this.scale;
                maskSprite.scale.set(this.scale);
                this.app.stage.addChild(maskSprite);
            }
        },
        addParticle: function (texture, baseLocation, startRadius, distance, spread, angle, speed) {
            let particle = new PIXI.Sprite(texture);
                particle.scale.set(this.scale);
                particle.anchor.set(0.5);
                particle.started = false;
                particle.baseLocation = baseLocation;
                particle.spread = spread;
                particle.speed = speed * (Math.random() * spread + 1 - spread * 0.5);
                particle.angle = angle * (Math.random() * spread + 1 - spread * 0.5);
                particle.distance = distance * (Math.random() * spread + 1 - spread * 0.5);

            let particlePts = this.getParticlePoints(baseLocation, startRadius, particle.angle, particle.distance, particle.speed);

            particle.startX = particlePts.startX * this.scale;
            particle.startY = particlePts.startY * this.scale;
            particle.home = {
                x: particle.startX,
                y: particle.startY
            };
            particle.x = particle.startX + this.panOffset;
            particle.y = particle.startY;
            particle.vx = particlePts.vx * this.scale;
            particle.vy = particlePts.vy * this.scale;

            particle.interact = sprite => this.particle(sprite);

            //console.log("adding particle ",particle.vx, particle.vy)

            this.app.stage.addChild(particle);
            this.activeSprites.push(particle);
        },
        getParticlePoints: function (baseLocation, startRadius, angle, distance, speed) {
            let bx = baseLocation.x + 2 * (Math.random() - 0.5) * startRadius;
            let by = baseLocation.y + 2 * (Math.random() - 0.5) * startRadius;

            let bvx = Math.cos(angle) * speed;
            let bvy = Math.sin(angle) * speed;

            return {
                startX: bx,
                startY: by,
                vx: bvx,
                vy: bvy
            }

        },
        resetPixiApp: function () {
            this.app.stage.children = [];
            this.activeSprites = [];
        },

        onFrame:function () {
            this.frame += 0.1;
            this.activeSprites.forEach(sprite=>sprite.interact(sprite));
            this.panChange = 0;
        },

        // Interaction functions
        spin: function(sprite) {
            if (!this.shouldRelax(sprite)) {
                var multiplier = this.transformedPt.x > sprite.x ? -1 : 1;
                sprite.rotation += multiplier * sprite.speed;
            } else if ( Math.abs(sprite.rotation) > 0.01) {
                sprite.rotation -= sprite.rotation / 20;
            }
            sprite.x = sprite.home.x * this.scale + this.panOffset;
        },
        teeter: function (sprite) {

            let dis = this.distance(this.transformedPt.x, this.transformedPt.y, sprite.x, sprite.y);
            let damping = sprite.baseSpeed * 0.7;
            let offsetDis = 0;

            if (this.transformedPt.x < 0 && Math.abs(sprite.speed) < 0.00001) {
                if (Math.random() < 0.001) {
                    //console.log("speed boost!");
                    sprite.speed = sprite.baseSpeed * 0.5;
                }
            } else if (dis < this.interactionDistance) {
                let angle = Math.atan2(this.transformedPt.y - sprite.y,
                                    this.transformedPt.x - sprite.x);
                if (angle > Math.PI) angle -= 2 * Math.PI;

                if (Math.abs(angle - sprite.angle) < Math.PI * 0.5) offsetDis = this.scale * sprite.distance;
                else if (Math.abs(angle - sprite.angle) > Math.PI * 1.5) offsetDis = -this.scale * sprite.distance;
                damping = sprite.baseSpeed * 0.4;
            }

            sprite.speed += this.updateVelocity(sprite.locOffset, offsetDis, sprite.speed, sprite.baseSpeed, damping);
            sprite.locOffset -= sprite.speed;

            //console.log(offsetDis, sprite.distance);
            let offsetX = Math.cos(sprite.angle) * sprite.locOffset;
            let offsetY = Math.sin(sprite.angle) * sprite.locOffset;
            
            sprite.x = (sprite.home.x  + offsetX) * this.scale + this.panOffset;
            sprite.y = (sprite.home.y + offsetY) * this.scale;
        },
        swing: function (sprite) {
            let spread = sprite.angleRange[1] - sprite.angleRange[0];

            // set the target angle to the midpoint for now
            let targetAngle = sprite.angleRange[0] + 0.5 * spread;
            let dis = this.distance(this.transformedPt.x, this.transformedPt.y, sprite.x, sprite.y);
            let damping = sprite.baseSpeed * 0.5;

            if (this.transformedPt.x < 0 && Math.abs(sprite.speed) < 0.00001) {
                if (Math.random() < 0.001) {
                    //console.log("speed boost!");
                    sprite.speed = sprite.baseSpeed * 0.5;
                }
            } else if (dis < Math.max(sprite.width * 0.3, this.interactionDistance)) {
                let angle = Math.atan2(this.transformedPt.y - sprite.y,
                                    this.transformedPt.x - sprite.x);
                if (angle > Math.PI) angle -= 2 * Math.PI;

                if (angle > 0) targetAngle = Math.min(angle, sprite.angleRange[1]);
                else targetAngle = Math.max(angle, sprite.angleRange[0]);
                damping = sprite.baseSpeed * 0.3;
            }

            sprite.speed += this.updateVelocity(sprite.rotation, targetAngle, sprite.speed, sprite.baseSpeed, damping);
            sprite.rotation -= sprite.speed;
            sprite.x = sprite.home.x * this.scale + this.panOffset;

        },
        spring: function (sprite) {
            var goalPt = null;
            if (this.shouldRelax(sprite)) goalPt = {
                x: sprite.home.x * this.scale + this.panOffset,
                y: sprite.home.y * this.scale
            }
            else {
                let a = Math.atan2((sprite.home.y * this.scale - this.transformedPt.y), 
                        (sprite.home.x * this.scale - this.transformedPt.x));
                
                goalPt = {
                    x: this.scale * (sprite.home.x +  sprite.leash * Math.cos(a)) + this.panOffset,
                    y: this.scale * (sprite.home.y +  sprite.leash * Math.sin(a))
                }
            } 

            if (this.transformedPt.x < 0 && Math.abs(sprite.speed) < 0.00001) {
                if (Math.random() < 0.001) {
                    //console.log("speed boost!");
                    sprite.vx = sprite.speed * 0.5;
                    sprite.vy = sprite.speed * 0.5;
                }
            }

            let damping = sprite.damping;

            if (this.distance(sprite.x, sprite.y, goalPt.x, goalPt.y) > sprite.leash) damping *= 8;

            sprite.vx += this.updateVelocity(sprite.x, goalPt.x, sprite.vx, sprite.speed, damping);       
            sprite.vy += this.updateVelocity(sprite.y, goalPt.y, sprite.vy, sprite.speed, damping);
            
            sprite.x -= sprite.vx;
            sprite.y -= sprite.vy;
        },
        particle: function (sprite) {

            let vx = sprite.vx;
            let vy = sprite.vy;
            let dis = this.distance(this.transformedPt.x, this.transformedPt.y, sprite.x, sprite.y);
            let tid = 2 * this.interactionDistance;

            if (dis < tid) {
                let disMod = 1.5 + 1.6*(dis - tid)/tid;
                let a = Math.atan2(this.transformedPt.y - sprite.y, this.transformedPt.x - sprite.x);
                vx -= disMod * Math.cos(a);
                vy -= disMod * Math.sin(a);
            }

            if (sprite.started) {
                sprite.x += vx - this.panChange;
                sprite.y += vy;
            } else {
                // We don't want them to all start at the same time
                sprite.started = Math.random() < 0.01;
                sprite.x -= this.panChange;
            }


            let travelled = this.distance(sprite.x, sprite.y, sprite.baseLocation.x * this.scale + this.panOffset, sprite.baseLocation.y * this.scale);

            if (travelled > sprite.distance){
                sprite.scale.set(this.scale);
                sprite.x = sprite.baseLocation.x * this.scale + this.panOffset;
                sprite.y = sprite.baseLocation.y * this.scale;
            } else if (travelled > sprite.distance * 0.85) {
                //console.log("scaling down", travelled)
                sprite.scale.set(sprite.scale.x * 0.9);
            } 
        },
        flip: function (sprite) {
            
            let rightOf = this.transformedPt.x >= sprite.flipX * this.scale + this.panOffset;
            //console.log(sprite.toFollow);
            if (sprite.toFollow != null) {
                rightOf = this.activeSprites[sprite.toFollow].x >= sprite.flipX * this.scale + this.panOffset;
            }
            if (rightOf == sprite.rightImg) sprite.alpha = 1;
            else sprite.alpha = 0;

            sprite.x = sprite.home.x * this.scale + this.panOffset;
            
        },
        flipY: function(sprite) {
            let above = this.transformedPt.y > 0 && this.transformedPt.y <= sprite.flipY * this.scale;
            //console.log(sprite.toFollow);
            if (sprite.toFollow != null) {
                above = this.activeSprites[sprite.toFollow].y >= sprite.flipY * this.scale;
            }
            if (above == sprite.topImg) sprite.alpha = 1;
            else sprite.alpha = 0;
            sprite.x = sprite.home.x * this.scale + this.panOffset;
        },
        mask: function (sprite) {
            // All this does is update the offset of the sprite if necessary
            sprite.x = sprite.home.x * this.scale + this.panOffset;
        },
        bezier: function (sprite) {
            //console.log("bezier!", sprite);
            // Modulate all four points
            let ctrlMod = {
                "a1": this.getModifiedPoint(sprite.control.a1),
                "h1": this.getModifiedPoint(sprite.control.h1),
                "h2": this.getModifiedPoint(sprite.control.h2),
                "a2": this.getModifiedPoint(sprite.control.a2)
            }

            for (let p = 0; p < sprite.points.length; p++) {
                let pt = this.getBezierPoint(p/(sprite.points.length-1), ctrlMod);
                sprite.points[p].x = pt.x;
                sprite.points[p].y = pt.y;
            }

            sprite.x = this.panOffset;
        },
        randomFollow: function (sprite) {
            if (this.transformedPt.x > 0) {
                let followPt = { 
                    x: this.transformedPt.x,
                    y:  Math.min(this.transformedPt.y, sprite.bounds.y + sprite.bounds.height * this.scale)}
                sprite.targetPt = followPt;
                let stp = this.speedToPoint(sprite.baseSpeed, followPt, sprite.x, sprite.y);

                sprite.vx = stp.vx;
                sprite.vy = stp.vy;
            } else if (this.distance(sprite.x, sprite.y, sprite.targetPt.x, sprite.targetPt.y) < 10 || !this.boundsContainPoint(sprite.bounds, sprite.x, sprite.y)) {

                this.reorientToBoundsPoint(sprite);
            }

            if (sprite.vx > 0) sprite.scale.set(this.scale);
            else sprite.scale.set(this.scale * -1, this.scale);
            //console.log(sprite.targetPt);

            sprite.x += sprite.vx;
            sprite.y += sprite.vy;
        },
        watch:function (sprite) {
            let targetPt = {
                x: sprite.home.x * this.scale + this.panOffset,
                y: sprite.home.y * this.scale
            };
            if (this.transformedPt.x > 0) {
                let d = this.distance(this.transformedPt.x, this.transformedPt.y, sprite.home.x + this.panOffset, sprite.home.y);
                let move = Math.min(d, sprite.tether);
                let angle = Math.atan2(this.transformedPt.y - sprite.home.y, this.transformedPt.x - sprite.home.x - this.panOffset);

                //console.log(angle);

                targetPt.x += this.scale * move * Math.cos(angle);
                targetPt.y += this.scale * move * Math.sin(angle);
                //console.log(move, targetPt);
            }

            if (Math.abs(sprite.x - targetPt.x) > 0.1 || Math.abs(sprite.y - targetPt.y) > 0.1) {
                sprite.x += (targetPt.x - sprite.x) * 0.5;
                sprite.y += (targetPt.y - sprite.y) * 0.5;
            }
        },
        point: function(sprite){
            if (this.transformedPt.x >= 0) {
                sprite.targetAngle = Math.atan2(this.transformedPt.y - sprite.y, this.transformedPt.x - sprite.x);
                //console.log(sprite.targetAngle);

                if (sprite.targetAngle > 0) sprite.targetAngle = Math.min(sprite.targetAngle, sprite.angleRange[1]);
                else sprite.targetAngle = Math.max(sprite.targetAngle, sprite.angleRange[0]);
            } else {
                if (Math.random() < 0.01) {
                    let spread = Math.max(...sprite.angleRange) - Math.min(...sprite.angleRange)
                    sprite.targetAngle = Math.min(...sprite.angleRange) + Math.random() * spread;
                }
            }

            sprite.speed += this.updateVelocity(sprite.rotation, sprite.targetAngle, sprite.speed, 0.008, 0.05);

            sprite.rotation -= sprite.speed;
            sprite.x = sprite.home.x * this.scale + this.panOffset;

        },

        pathFollow: function (sprite) {

            if (this.shouldRelax(sprite, sprite.pathLength * this.scale * 0.7)) sprite.alpha = 0;
            else {
                sprite.alpha = 1;
                let targetPt = {
                    x: Math.max(Math.min(this.scale * sprite.points[1].x + this.panOffset, this.transformedPt.x),this.scale * sprite.points[0].x + this.panOffset),
                    y: Math.max(Math.min(this.scale * sprite.points[1].y, this.transformedPt.y),this.scale * sprite.points[0].y)
                }

                //console.log(targetPt);

                if (Math.abs(sprite.x - targetPt.x) > 0.1 || Math.abs(sprite.y - targetPt.y) > 0.1) {
                sprite.x += (targetPt.x - sprite.x) * sprite.easing;
                sprite.y += (targetPt.y - sprite.y) * sprite.easing;
            }
            }
        },
        

        // Utilities -------------------------------------------
        shouldRelax: function (sprite, dist) {
            if (typeof(dist) === "undefined") dist = this.interactionDistance;

            // I chained together two ternary operators... not sure if good or bad.
            return this.transformedPt.x < -1 ? true : 
                this.distance(this.transformedPt.x, this.transformedPt.y, sprite.x, sprite.y) > dist ? true : false;
            
        },

        reorientToBoundsPoint: function (sprite) {
            let pt = {
                x: sprite.bounds.x + Math.random() * sprite.bounds.width + this.panOffset,
                y: sprite.bounds.y + Math.random() * sprite.bounds.height
            }

            sprite.targetPt = pt;
            let stp = this.speedToPoint(sprite.baseSpeed, pt, sprite.x, sprite.y);

            sprite.vx = stp.vx;
            sprite.vy = stp.vy;
        },

        boundsContainPoint: function (bounds, x, y) {
            if (x < bounds.x || y < bounds.y) return false;
            if (x > bounds.x + bounds.width || y > bounds.y + bounds.height) return false;
            
            return true;
        },

        speedToPoint: function (baseSpeed, point, startX, startY) {
            let a = Math.atan2(point.y - startY,
                point.x - startX);
            let updateSpeed = baseSpeed * (0.8 + Math.random() * 0.4);
            let d = this.distance(point.x, point.y, startX, startY);
            if (d > this.width * 0.5) updateSpeed *= 2.5;
            else if (d > this.width * 0.2) updateSpeed *= 1.5;

            return {
                vx: updateSpeed * Math.cos(a),
                vy: updateSpeed * Math.sin(a)
            }
        },

        /**
         * Everyone's favorite distance formula
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2)*(x1 - x2) + 
                            (y1 - y2)*(y1 - y2));
        },

        /**
         * The standard damped oscillation formula
         */
        updateVelocity: function(j, targetJ, vJ, k, dampCoeff) {
            var spring = k * (j - targetJ);
            var damp = -dampCoeff * vJ;
            return spring + damp;
        },

        getModifiedPoint: function (startingControlPt) {
            let newPt = {
                x: startingControlPt.distance > 0 ? startingControlPt.x + startingControlPt.distance * Math.cos(startingControlPt.angle) * Math.sin(this.frame * startingControlPt.speed):startingControlPt.x,
                y: startingControlPt.distance > 0 ? startingControlPt.y + startingControlPt.distance * Math.sin(startingControlPt.angle) * Math.sin(this.frame * startingControlPt.speed):startingControlPt.y,
            };

            if (startingControlPt.distance < 1) return newPt; 

            let dist = this.distance(newPt.x, newPt.y, this.transformedPt.x * (1/this.scale), this.transformedPt.y* (1/this.scale));
            let id = 3 * this.interactionDistance;

            if (dist > id) return newPt;

            let angle = Math.atan2(newPt.y - this.transformedPt.y, newPt.x - this.transformedPt.x);

            let distMod = (id - dist)/id;
            distMod *= distMod;


            newPt.x += distMod * startingControlPt.distance * Math.cos(angle + Math.PI/2);
            newPt.y -= distMod * startingControlPt.distance * Math.sin(angle + Math.PI/2);
            
            return newPt
        },

        getBezierPoint: function(t, bezier) {
            let pt = {x: 0, y: 0};
            pt.x = ((1 - t) * (1 - t) * (1 - t)) * bezier.a2.x
                + 3 * ((1 - t) * (1 - t)) * t * bezier.h2.x
                + 3 * (1 - t) * (t * t) * bezier.h1.x
                + (t * t * t) * bezier.a1.x;

            pt.y = ((1 - t) * (1 - t) * (1 - t)) * bezier.a2.y
                + 3 * ((1 - t) * (1 - t)) * t * bezier.h2.y
                + 3 * (1 - t) * (t * t) * bezier.h1.y
                + (t * t * t) * bezier.a1.y;

            return pt;
        }

    }
}
</script>
<style lang="stylus">
@keyframes spin
    0%
        transform rotate(0deg)

    40%
        transform rotate(180deg)
    
    50%
        transform rotate(180deg)

    90%
        transform rotate(360deg)

    100%
        transform rotate(360deg)


.art-canvas
    position absolute
    top 0
    left 0
    width 100%
    display flex
    flex-direction row
    justify-content center

    @media (min-width: 900px)
        padding-top: 19px

    @media (min-width: 1500px)
        padding-top: 30px

    canvas
        border 7px solid transparent
        border-image url(../assets/double-border.png) 33% round
        border-radius 10px

.loading 
    display flex
    justify-content center
    align-items center
    position absolute
    width 100%
    height 600px


    img
        max-width 50%
        margin-top 20px
        animation spin 3s infinite

</style>