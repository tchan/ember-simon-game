import Ember from 'ember';

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),

  gameState: {
      sequence: null,
      userInput: [],
      hardMode: false,
      colours: ['blue', 'red', 'yellow', 'green'],
      bluePulse: false,
      redPulse: false,
      yellowPulse: false,
      greenPulse: false,
      hasStarted: false,
      level: null
  },

  actions: {

    start() {
        let gameState = this.get('gameState');
        this.set('gameState.level', 1);
        let sequence = [];
        let colours = gameState.colours;

        //first populate sequence to an array of 20 colours
        for (let i=0 ; i<20; i++) {
          let randomIndex = Math.round(Math.random()*3);
          sequence.push(colours[randomIndex]);
        }
        this.set('gameState.sequence', sequence);
        this.set('gameState.hasStarted', true);

        //play first sound of the array and wait for user input
        let colour = sequence[0];
        this.set(`gameState.${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`)
        audio.play();
        Ember.run.later(this, function() {
            this.set(`gameState.${colour}Pulse`, false);
        }, 1080);
    },


    clickButton(colour) {
      let hasStarted = this.get('gameState.hasStarted');
      let level = this.get('gameState.level');
      let hardMode = this.get('gameState.hardMode');

      //playing around
      if (!hasStarted) {
        this.set(`gameState.${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`);
        audio.play();
        Ember.run.later(this, function() {
            this.set(`gameState.${colour}Pulse`, false);
        }, 1080);
      }
      else if (hasStarted) {
        let userInput = this.get('gameState.userInput');
        let sequence = this.get('gameState.sequence');
        let wasCorrect = null;

        this.set(`gameState.${colour}Pulse`, true);
        let audio = new Audio(`./${colour}.mp3`);
        audio.play();
        Ember.run.later(this, function() {
            this.set(`gameState.${colour}Pulse`, false);
        }, 1080);

        userInput.push(colour);

        for (let i=0; i<userInput.length; i++) {
          if (userInput[i] !== sequence[i]) {
            //reset userInput if incorrect
            this.set('gameState.userInput', []);

            //restart sequence
            if (!hardMode) {
              let flashMessages = this.get('flashMessages');
              flashMessages.info('Restarting!');
              let time = 1080;
              for (let i=0; i<level; i++) {
                time = time+1250;
                Ember.run.later(this, function () {
                  this.set(`gameState.${sequence[i]}Pulse`, true);
                  var audio = new Audio(`./${sequence[i]}.mp3`)
                  audio.play();
                  Ember.run.later(this, function() {
                      this.set(`gameState.${sequence[i]}Pulse`, false);
                  }, 1080);
                }, time);
              }
            }

            else {
              this.set('gameState.hasStarted', false);
              alert("You have lost, condolences.");
            }

          }
        }

        //check if correct
        if (userInput.length === level) {
          let count = 0;
          for (let i=0; i<level; i++) {
            count +=1;
            if (count === level) {
              if (count === 20) {
                alert('You won!');
                this.set('gameState.userInput', []);
                this.set('gameState.level', ':)');
                return;
              }
              wasCorrect = true;
            }

          }
        }

        // level increases
        // sounds play increases by 1
        //reset user input
        if (wasCorrect) {
          wasCorrect = false;
          level +=1;
          //reinitialze for next turn
          this.set('gameState.level', level);
          this.set('gameState.userInput', []);
          let time = 1080;
          //play next sequence
          for (let i=0; i<level; i++) {
            time = time+1250;
            Ember.run.later(this, function () {
              this.set(`gameState.${sequence[i]}Pulse`, true);
              var audio = new Audio(`./${sequence[i]}.mp3`)
              audio.play();
              Ember.run.later(this, function() {
                  this.set(`gameState.${sequence[i]}Pulse`, false);
              }, 1080);
            }, time);
          }
        }
      }
    },

    switchMode() {
      this.toggleProperty('gameState.hardMode');
    }
  }
});
