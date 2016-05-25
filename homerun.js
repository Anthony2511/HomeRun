( function() {

    "use strict";

    var HomeRun;

    HomeRun = function( oApp ) {
        var game = this,
            Donuts;

        this.app = oApp;
        this.time = {
            "start": null, // temps de départ
            "current": null // temps actuel
        };
        this.background = {  // BACKGROUND
            "frame": {
                "sx": 0, // Position X PHOTOSHOP
                "sy": 0, // Position Y PHOTOSHOP
                "sw": 800, // WIDTH
                "sh": 500, // HEIGHT
                "dx": 0, // Position X dans le jeu
                "dy": 0, // Position Y dans le jeu
                "dw": 800, // taille
                "dh": 500 // taille
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frame );
            }
        };
        this.play = {  // Objets affichés avant le début de la partie
            "frames": {
                "ready" : {
                    "sx": 821, // Position X PHOTOSHOP
                    "sy": 0, // Position Y PHOTOSHOP
                    "sw": 150, // WIDTH
                    "sh": 150, // HEIGHT
                    "dx": game.app.width / 2 -50, // Position X dans le jeu
                    "dy": game.app.height / 2 -50, // Position Y dans le jeu
                    "dw": 100, // taille
                    "dh": 100 // taille
                },
                "title" : {
                    "sx": 821, // Position X PHOTOSHOP
                    "sy": 166, // Position Y PHOTOSHOP
                    "sw": 455, // WIDTH
                    "sh": 150, // HEIGHT
                    "dx": 175, // Position X dans le jeu
                    "dy": 30, // Position Y dans le jeu
                    "dw": 455, // taille
                    "dh": 150 // taille
                }
            },
            "draw": function() {
                game._drawSpriteFromFrame( this.frames.ready );
                game._drawSpriteFromFrame( this.frames.title );
            }
        };
        this.ground = {
            "frame": {
                "sx": 0,
                "sy": 526,
                "sw": 1564,
                "sh": 140,
                "dx": game.app.width - 1564,
                "dy": game.app.height - 137,
                "dw": 1564,
                "dh": 140
            },
            "speed": 2,
            "maxOffset": 1564 - game.app.width,
            "draw": function() {
                game._drawSpriteFromFrame( this.frame );
            },
            "update": function() {
                if ( this.frame.dx <= ( this.maxOffset * -1 ) ) {
                    this.frame.dx = 0;
                }
                this.frame.dx -= this.speed;
                this.draw();
            }
        };
        this.homer = {
           "frames": [
               {
                   "sx": 0,
                   "sy": 684,
                   "sw": 104,
                   "sh": 160
               },
               {
                   "sx": 120,
                   "sy": 684,
                   "sw": 104,
                   "sh": 160
               },
               {
                   "sx": 240,
                   "sy": 684,
                   "sw": 104,
                   "sh": 160
               },
               {
                   "sx": 360,
                   "sy": 684,
                   "sw": 104,
                   "sh": 160
               }
           ],
           "init": function() {
               // reset les propriétés
               this.animation = {
                   "maxSteps": this.frames.length,
                   "step": 0
               };
               this.state = {
                   "speed": 0
               };
               this.score = {};
               this.position = {};
               this.destinationFrame = {
                   "dx": 350,
                   "dy": game.app.height / 2 + 100,
                   "dw": 124,
                   "dh": 180
               };
           },
           "draw": function( iStep ) {
               var oFrom = this.frames[ iStep ],
                   oDest = this.destinationFrame;

               game.app.context.drawImage(
                   game.spriteSheet,
                   oFrom.sx,
                   oFrom.sy,
                   oFrom.sw,
                   oFrom.sh,
                   oDest.dx,
                   oDest.dy,
                   oDest.dw,
                   oDest.dh
               );
           },
           "update": function( oEvent ) {
               // handle event. we ensure that the sended event is the good one.
             if ( oEvent && ( oEvent.type === "click" || ( oEvent.type === "keyup" && oEvent.keyCode === 32 ) ) ) {
                 if ( !this.state.acceleration ) {
                     // since we know that this is the first click/keypress on bird, we can generate tubes here
                     game.started = true;
                     this.state.acceleration = 0.4;
                     this.state.boost = -5;
                 } else {
                     this.state.speed = this.state.boost;
                 }
             }

             // don't update bird if game isn't started
             if ( !game.started ) {
                 return;
             }
           }
       };
       Donuts = function() {

           this.donuts = {
               "frame" : {
                   "sx": 827,
                   "sy": 415,
                   "sw": 70,
                   "sh": 69,
                   "dx": 20,
                   "dy": 100,
                   "dw": 70,
                   "dh": 69
               }
           }
       };
       Donuts.prototype.draw = function() {
            game._drawSpriteFromFrame( this.frame);
        };
        this._drawSpriteFromFrame = function( oFrame ) { // function pour dessiner les sprites
            this.app.context.drawImage(
                this.spriteSheet,
                oFrame.sx,
                oFrame.sy,
                oFrame.sw,
                oFrame.sh,
                oFrame.dx,
                oFrame.dy,
                oFrame.dw,
                oFrame.dh
            );
        };
        this.start = function() {
            if ( !this.eventsSetted ) {
               this.app.canvas.addEventListener( "click", this.homer.update.bind( this.homer ) );
               window.addEventListener( "keyup", this.homer.update.bind( this.homer ) );
               this.eventsSetted = true;
           }
             this.homer.init();
             this.donuts = [];
            // reset some variables
            this.time.start = Date.now();
            // lancer l'animation
            this.animate();


        };
        this.animate = function() {
            this.time.current = Date.now();
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );
            this.app.context.clearRect( 0, 0, this.app.width, this.app.height ); // effacer le canvas qui se répête
            this.background.draw(); // Dessiner le background
            this.ground.update(); //Dessiner et animer la route

            this.donuts.forEach( function( oDonuts ) {
                  oDonuts.draw();
              } );

            if ( this.time.current - this.time.start > 80 ) {
               this.time.start = Date.now();
               ( ++this.homer.animation.step < this.homer.animation.maxSteps ) || ( this.homer.animation.step = 0 );
           }
           this.homer.draw( this.homer.animation.step );
           // Tant que le jeu ne démarre pas on affiche les objets play
           if ( !game.started ) {
               this.play.draw();
           }

        };
        // A FAIRE EN PREMIER
        this.spriteSheet = new Image(); // Charger le sprite.
        this.spriteSheet.addEventListener( "load", this.start.bind( this ) );
        this.spriteSheet.src = "./ressources/sprite2.png";
    };
    window.HomeRun = HomeRun; // accessible depuis l'extérieur
} )();
