import Ember from 'ember';

export default Ember.Controller.extend({
  level: null,
  isPulse: false,

  actions: {
    clickBlue() {
      let isPulse = this.get('isPulse');
      this.set('isPulse', true);
      var audio = new Audio('./simonSound1.mp3');
      audio.play();
      Ember.run.later(this, function() {
          this.set("isPulse", false);
      }, 1080);
    }
  }
});
