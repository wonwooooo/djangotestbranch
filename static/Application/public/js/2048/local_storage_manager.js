window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  var supported = this.localStorageSupported();
  var self = this;
  this.storage = supported ? window.localStorage : window.fakeStorage;
  this.bestScoreKey     = "bestScore";
  this.gameStateKey     = "gameState";
  let csrf_token = $('body').attr('class');
  this.user_mail = sessionStorage.getItem('user_mail'); 
  
  $.post({
    url: "/get_score",
    type: "POST",
    async: false,
    data: {
      user_mail : this.user_mail,
			csrfmiddlewaretoken: csrf_token,
    },
    success: function(dataP){
      if(dataP[0].length!=0) {
        self.bestScore= dataP[0][0][0];
        console.log(self.bestScore);
        self.storage.setItem(self.bestScoreKey,self.bestScore);
      }
      else {
        self.bestScore=0;
      }
      self.storage.setItem(self.bestScoreKey,self.bestScore);
    },
    error: function(){
      conlsole.log("test");
    }
    
  });
  
  //console.log(this.getItem(this.bestScoreKey));
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    //console.log("test");
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    //console.log(2);

    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  console.log(this.storage.getItem(this.bestScoreKey));
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function () {
  //console.log(this.bestScore);
  this.storage.setItem(this.bestScoreKey, this.bestScore);
};

LocalStorageManager.prototype.set_new_BestScore = function (score) {
  //console.log(this.bestScore);
  this.storage.setItem(this.bestScoreKey, score);
};



// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};
