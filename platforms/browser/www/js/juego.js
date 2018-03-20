var app = {
  inicio: function() {
    DIAMETRO_BOLA = 30;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    fondo = 0;
    paredes = [];
    agujeros = [];
    ganar = 0;
    perder = 0;

    window.screen.orientation.lock('portrait');

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function() {

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#fff';
      
      game.load.image('bola', 'assets/img/ball.png');
      game.load.image('agujero', 'assets/img/hole2.png');
      game.load.image('meta', 'assets/img/goal2.png');      
      game.load.image('paredh', 'assets/img/paredh.png');
      game.load.image('paredv', 'assets/img/paredv.png');
      
      //Cargamos el sonido de los rebotes
      game.load.audio('audio-rebote', ['assets/audio/bounce.ogg', 'assets/audio/bounce.mp3', 'assets/audio/bounce.m4a']);      
    }

    function create() {
      //Iniciamos el nivel del juego
      initLevels();

      //Definimos los agujeros trampa
      //hole = game.add.sprite(192, 180, 'agujero');

      sonido_rebote = game.add.audio('audio-rebote');

      meta = game.add.sprite(88, 322, 'meta');
      //meta.anchor.set(0.5);
      game.physics.arcade.enable(meta, Phaser.Physics.ARCADE);

      bola = game.add.sprite(0, 0, 'bola');      
      bola.anchor.set(0.5);
      game.physics.arcade.enable(bola, Phaser.Physics.ARCADE);
      bola.body.setSize(30, 30);
      //bola.body.bounce.set(0.3, 0.3);
      
      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      //bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
      bola.body.onWorldBounds.add(app.colisionBordes, this);

    }

    function update() {
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      game.physics.arcade.overlap(bola, meta, app.winner, null, this);

      game.physics.arcade.collide(bola, paredes, app.colisionBordes, null, this);
      game.physics.arcade.overlap(bola, agujeros, app.looser, null, this);

      
      if (bola.body.checkWorldBounds()) {
        game.stage.backgroundColor = "ff0000"; // Entonces pone un fondo rojo
      } else {
        game.stage.backgroundColor = "fff"; // De lo contrario pone el fondo naranja
        //game.stage.backgroundColor = '#ffff00';
      }

    }

    function initLevels() {
      paredesData = [
                    { x: 50, y: 0, t: 'v' },
                    /*{ x: 50, y: 108, t: 'h' },*/
                    { x: 0, y: 200, t: 'h' },
                    { x: 128, y: 200, t: 'h' },
                    { x: 224, y: 72, t: 'v' },
                    { x: 224, y: 42, t: 'v' },
                    { x: 150, y: 42, t: 'h' },
                    { x: ancho-32, y: 70, t: 'v' },
                    { x: ancho-32, y: 198, t: 'v' },
                    { x: ancho-32, y: 70, t: 'v' },
                    { x: 224, y: 232, t: 'v' },
                    { x: 256, y: 360, t: 'v' },
                    { x: 150, y: alto-128, t: 'v' },
                    { x: 128, y: 420, t: 'h' },
                    { x: 78, y: 420, t: 'h' },
                    { x: 56, y: 420, t: 'v' },
                    { x: 56, y: 292, t: 'v' },
                    { x: 56, y: 292, t: 'h' },
                  ];
      var newLevel = game.add.group();
      newLevel.enableBody = true;
      newLevel.physicsBodyType = Phaser.Physics.ARCADE;
      for(var e=0; e<paredesData.length; e++) {
        var item = paredesData[e];
        newLevel.create(item.x, item.y, 'pared'+item.t);
        //pared = game.add.sprite(item.x, item.y, 'pared'+item.t); 
      }
      newLevel.setAll('body.immovable', true);
      paredes.push(newLevel);

      //colocamps los agujeros
      agujerosData = [
                      { x: 0, y: 179 },                      
                      { x: 201, y: 179 },
                      { x: 82, y: 87 },
                      { x: 82, y: 0 },
                      { x: ancho-22, y: 0 },
                      { x: 256, y: 73},
                      { x: ancho-54, y: 200 },
                      { x: 256, y: 338 },
                      { x: ancho-22, y: 326 },
                      { x: 288, y: 468 },
                      { x: ancho-22, y: alto-22 },
                      { x: 256, y: 488 },
                      { x: 182, y: alto-22 },
                      { x: 233, y: 452 },
                      { x: 88, y: 452 },
                      { x: 128, y: alto-22 },
                      { x: 61, y: 548 },
                      { x: 0, y: alto-22 },
                      { x: 0, y: 232 },
                      { x: 201, y: 232 },
                      { x: 233, y: 398 },
                      { x: 194, y: 398 },
                      { x: 162, y: 323 },
                      { x: 88, y: 398 },                      
                    ];
      var grupo = game.add.group();
      grupo.enableBody = true;
      for(var h=0; h<agujerosData.length; h++){
        var item = agujerosData[h];
        grupo.create(item.x, item.y, 'agujero');
      }
      agujeros.push(grupo);  
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  colisionBordes: function() {
    /*if(this.audioStatus) {
      this.bounceSound.play();
    }*/
    //alert(app.audioStatus);

    sonido_rebote.play();
  },

  

    

  /*decrementaPuntuacion: function() {
    puntuacion = puntuacion - 1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function() {
    puntuacion = puntuacion + 1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();
    
    if (puntuacion > 0) {
      dificultad = dificultad + 1;
      fondo = fondo + 10;
      game.stage.backgroundColor = '#'+fondo;
    }
  },

  incrementaPuntuacion2: function() {
    puntuacion = puntuacion + 10;
    scoreText.text = puntuacion;

    objetivo2.body.x = app.inicioX();
    objetivo2.body.y = app.inicioY();
    
    if (puntuacion > 0) {
      dificultad = dificultad + 10;
      fondo = fondo + 100;
      game.stage.backgroundColor = '#'+fondo;
    }
  },*/

  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
  },

  inicioY: function() {
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {
    function onError() {
      console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
      //app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, {
      frequency: 10
    });
  },

  /*
  detectaAgitacion: function(datosAceleracion) {
    agitacionX = datosAceleracion.x > 10;
    agitacionY = datosAceleracion.y > 10;
    if (agitacionX || agitacionY) {
      setTimeout(app.recomienza, 1000);
    }
  },
  */

  recomienza: function() {
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion) {
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  },

  winner: function() {
    if(ganar == 0){
      ganar++;
      meta.visible = false;
      alert('Has Ganado!!!');
      app.recomienza();
    }
  },

  looser: function() {
    if(perder == 0){
      perder++;
      //texto = ' vez ';
      //if(perder>1) texto = ' veces.';
      //alert('Has Perdido '+perder+texto);
      // Vibration API
      if("vibrate" in window.navigator) {
        window.navigator.vibrate(300);
      }
      alert('Has Perdido :(');
      app.recomienza();
    }
  }

};

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}

