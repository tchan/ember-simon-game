import Ember from 'ember';

export default Ember.Controller.extend({

  //classes for the pulse animation
  bluePulse: false,
  redPulse: false,
  yellowPulse: false,
  greenPulse: false,

  hardMode: false,

  gameState: {
      //sequence eg ['B', 'R', 'Y', 'G' ...]
      // B: blue, R: Red, Y: Yellow, G: Green
      sequence: [],
      colours: ['blue', 'red', 'yellow', 'green'],
      userInput: [],
      hasStarted: false,
      level: null
  },

  actions: {

    start() {
        // console.log('start button pressed');

        let gameState = this.get('gameState');
        let level = gameState.level
        let sequence = [];
        let colours = gameState.colours;

        //first populate sequence to an array of 20 colours
        for (let i=0 ; i<20; i++) {
          let randomIndex = Math.round(Math.random()*3);
          sequence.push(colours[randomIndex]);
          // console.log(sequence);
        }
        this.set('gameState.sequence', sequence);
        this.set('gameState.hasStarted', true);
        this.set('gameState.level', 1);
        console.log('populated sequence is', gameState.sequence);

        //play first sound of the array and wait for user input
        // console.log(sequence[0]);
        let colour = sequence[0];
        this.set(`${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`)
        audio.play();
        Ember.run.later(this, function() {
            this.set(`${colour}Pulse`, false);
        }, 1080);
    },


    clickButton(colour) {
      let hasStarted = this.get('gameState.hasStarted');
      let level = this.get('gameState.level');
      //
      //playing around
      if (!hasStarted) {
        this.set(`${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`);
        audio.play();
        Ember.run.later(this, function() {
            this.set(`${colour}Pulse`, false);
        }, 1080);
      }
      else if (hasStarted) {
        // console.log('hasStarted')
        let userInput = this.get('gameState.userInput');
        let sequence = this.get('gameState.sequence');
        let wasCorrect = null;

        this.set(`${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`);
        audio.play();
        Ember.run.later(this, function() {
            this.set(`${colour}Pulse`, false);
        }, 1080);

        userInput.push(colour);
        console.log('userInput', userInput);

        for (let i=0; i<userInput.length; i++) {
          if (userInput[i] !== sequence[i]) {
            console.log('you lose, game restarting');
            this.set('gameState.userInput', []);
            return ;
            //restart code
          }
        }

        //check if correct
        if (userInput.length === level) {
          let count = 0;
          console.log('level is ', level);
          for (let i=0; i<level; i++) {
            // console.log('colour', userInput[i], sequence[i]);
            // console.log('i', i);
            if (userInput[i] !== sequence[i]) {
              console.log('you lose, game restarting');
              this.set('gameState.userInput', []);
              return ;
              //restart code
            }
            else {

              count +=1;
              if (count === level) {
                // console.log('all correct');
                // console.log('count is', count);
                wasCorrect = true;
              }
              // level increases
              // sounds play increases by 1
              //reset user input

            }
          }
        }


        if (wasCorrect) {
          // console.log('wasCorrect');
          wasCorrect = false;
          level +=1;
          this.set('gameState.level', level);
          this.set('gameState.userInput', []);
          // console.log('updated level', this.get('gameState.level'));
          let time = 1080;
          //play next sequence
          for (let i=0; i<level; i++) {
            time = time+1250;
            Ember.run.later(this, function () {
              // console.log(i);
              this.set(`${sequence[i]}Pulse`, true);
              var audio = new Audio(`./${sequence[i]}.mp3`)
              audio.play();
              Ember.run.later(this, function() {
                  this.set(`${sequence[i]}Pulse`, false);
              }, 1080);
            }, time);
          }
        }

      }


    },

    switchMode() {
      this.toggleProperty('hardMode');
    }
  }
});
