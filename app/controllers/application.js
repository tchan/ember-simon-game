import Ember from 'ember';

export default Ember.Controller.extend({
  level: null,

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
  },

  actions: {

    start() {
        // console.log('start button pressed');
        this.set('level', 1);

        let level = this.get('level');
        let gameState = this.get('gameState');
        let sequence = [];
        let colours = gameState.colours;

        //first populate sequence to an array of 20 colours
        for (let i=0 ; i<20; i++) {
          let randomIndex = Math.round(Math.random()*3);
          sequence.push(colours[randomIndex]);
          // console.log(sequence);
        }
        this.set('gameState.sequence', sequence);
        console.log('populated sequence is', gameState.sequence);

        //play first sound of the array and wait for user input
        console.log(sequence[0]);
        let colour = sequence[0];
        this.set(`${colour}Pulse`, true);
        var audio = new Audio(`./${colour}.mp3`)
        audio.play();
        Ember.run.later(this, function() {
            this.set(`${colour}Pulse`, false);
        }, 1080);

    },

    clickButton(colour) {
      console.log('colour is', colour);
      this.set(`${colour}Pulse`, true);
      var audio = new Audio(`./${colour}.mp3`);
      audio.play();
      Ember.run.later(this, function() {
          this.set(`${colour}Pulse`, false);
      }, 1080);
    },

    switchMode() {
      this.toggleProperty('hardMode');
    }
  }
});
