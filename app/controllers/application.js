import Ember from 'ember';

export default Ember.Controller.extend({
  level: null,
  bluePulse: false,
  redPulse: false,
  yellowPulse: false,
  greenPulse: false,

  actions: {
    clickButton(colour) {
      console.log('colour is', colour);
      this.set(`${colour}Pulse`, true);
      var audio = new Audio(`./${colour}.mp3`);
      audio.play();
      Ember.run.later(this, function() {
          this.set(`${colour}Pulse`, false);
      }, 1080);
    }
  }
});
