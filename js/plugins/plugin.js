// let's say we keep a namespace which root is 'app'
var app = {};

app.plugin = {
  player: null,
  // possible states for the player
  STATES: { 
    unstarted: -1,
    ended: 0,
    playing: 1,
    paused: 2,
    buffering: 3,
    video_cued: 5
  },
  conf: {
    videoId: 'ZaZ3-k_QuM4',
    userId: '1234',
    tagId: 'userID'
  },
  params: { allowScriptAccess: 'always' },
  atts: { id: 'myytplayer' },
  init: function(player) {
    var ret = false;

    if (typeof player !== 'undefined') {
      // initialize all
      app.plugin.player = player;
      app.plugin.player.addEventListener('onStateChange', 'app.plugin.onPlayerStateChange');

      // tag with the userID
      var tag = document.createElement('input');
      tag.type = 'hidden';
      tag.id = app.plugin.conf.tagId;
      tag.value = app.plugin.conf.userId;
      document.body.appendChild(tag);
      
      ret = true;
    }
    
    return ret;
  },
  /**
     * Callback for any change of state in our player
     *
     * @return Object {userID, videoID, timecode, state}
     */
  onPlayerStateChange: function (newState) {
    if (newState===app.plugin.STATES.playing || newState===app.plugin.STATES.paused) {
      // get the userID from the configuration tag
      var inputUserId = document.getElementById(app.plugin.conf.tagId);
      var userId = (!inputUserId)? null : inputUserId.value;

      // store all the data is necessary to send to backend
      var data = {
        userID: userId,
        videoID: app.plugin.conf.videoId,
        timecode: app.plugin.player.getCurrentTime(),
        action: newState
      };

      data = JSON.stringify(data);

      // logs the data as required
      console.log(data);

      return data;
    }
  }
}; 
