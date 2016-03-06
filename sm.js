define([], function() {
  "use strict"

  var StopGapJs_sm = function() {}
  var ClassP = StopGapJs_sm.prototype

  ClassP.init = function(config) {
    var self = this
    self._statesHash = {}

    // stores states by ref in a hash with .id as key
    config.states.forEach(function(state) {
        self._statesHash[state.id] = state
      })

    // root state
    self._rootStateId = config.rootStateId

    // store transition in a hash with .id as key
    // store transitions which move from states, in hash with state.id as key
    config.transitions.forEach(function(transition) {
        self._transitionsHash[transition.id] = transition
        if (! self._states2Trans[transition.srcStateId]) {
          self._statesId2Trans[transition.srcStateId] = []
        }
        self._statesId2Trans[transition.srcStateId].push(transition.id)
      })
  }

  ClassP.getRootState = function() {
    return this._transitionHash[this._rootStateId];
  }

  ClassP._getAvailableTransIds = function(state) {
  }

  ClassP._injectMethods = function(state) {

  }



  return StopGapJs_sm
})
