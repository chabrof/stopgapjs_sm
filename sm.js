if (typeof define !== 'function') { var define = require('amdefine')(module); } // we are using amdefine in order to use requirejs

define([], function() {
  "use strict"

  var StopGapJs_Sm = function() {}
  var ClassP = StopGapJs_Sm.prototype

  ClassP.init = function(config) {
    var self = this
    self._listenersByType = {}
    self._statesById = {}
    self._transitionsByStateId = {}
    self._listeners = []
    // Stores states by ref in a hash with .id as key
    config.states.forEach(
      function(state) {
        self._statesById[state.id] = state
        self._injectMethodsIntoState(state)
      } )

    // Current state
    console.assert(self._statesById[config.rootStateId], 'rootStateId does not exist in states')
    self._curStateId = config.rootStateId

    // Store transition in a hash with .id as key
    // Store transitions which move from states, in hash with state.id as key
    config.transitions.forEach(
      function(transition) {
        // pre
        console.assert(transition.type, "type of transition must be set in transition object")
        console.assert(transition.srcStateId, "srcStateId must been set in transition object")

        self._injectMethodsIntoTrans(transition)
        if (! self._transitionsByStateId[transition.srcStateId]) {
          self._transitionsByStateId[transition.srcStateId] = {}
        }
        console.assert(self._transitionsByStateId[transition.srcStateId][transition.type] === undefined, "only one transition of each type is allowed for one state as source of this transition")
        self._transitionsByStateId[transition.srcStateId][transition.type] = transition;
      })
    return this
  }

  ClassP.getCurState = function() {
    return this._statesById[this._curStateId]
  }

  var State_getAvailableTrans = function() {
    return this._sgjsm._transitionsByStateId[this.id]
  }

  ClassP._injectMethodsIntoState = function(state) {
    state._sgjsm = this
    state.getTransitions = State_getAvailableTrans
  }

  var Transition_execute = function() {
    // pre
    console.assert(this._sgjsm.getCurState().id === this.srcStateId,
      'You can not execute a transition whom source state is not the cur state of the state machine')

    this._sgjsm._curStateId = this.dstStateId
    var event = (typeof CustomEvent !== 'undefined' ? new CustomEvent('transit', { "detail" : { "transtion" : this }}) :
    { "type" : "transit", "detail" : { "transition" : this }})

    this._sgjsm.dispatchEvent(event)
    return this._sgjsm.getCurState()
  }

  ClassP._injectMethodsIntoTrans = function(transition) {
    transition._sgjsm = this;
    transition.execute = Transition_execute;
  }

  ClassP.addEventListener = function(type, cbk) {
    // pre
    console.assert(
      typeof type === "string" && typeof cbk === "function" && type && cbk,
      "Arg 'Type' (string) of event must be given, as well as cbk (function)" )


    var listener = {
      type  : type,
      cbk   : cbk
    }
    this._listeners.push(listener)
    if (! this._listenersByType[type]) {
      this._listenersByType[type] = []
    }
    this._listenersByType[type].push(listener)
    listener.arrayIdx = this._listenersByType[type].length - 1
    return this._listeners.length - 1
  }

  ClassP.removeEventListener = function(listenerIdx) {
    // pre
    console.assert(  listenerIdx !== undefined && listenerIdx !== null && listenerIdx >= 0,
                    "listenerIdx must be a not null integer")

    var listener = this._listeners[listenerIdx]

    console.assert(listener, "listener (" + listenerIdx + ") must be a not null, maybe you have removed the listener twice", this._listeners)

    var type = listener.type
    this._listenersByType[type].splice(listener.arrayIdx, 1)
    for (var idx = listener.arrayIdx + 1; idx < this._listenersByType[type].length; idx++) {
      console.assert(this._listenersByType[type][idx].arrayIdx >= 0, 'arrayIdx for a listener event must be an integer');
      --(this._listenersByType[type][idx].arrayIdx)
    }
    this._listeners[listenerIdx] = undefined
  }

  /*event = new CustomEvent(type, { "detail" : { "exec" : true, "after" : true }})
    self.dispatchEvent(event)
  */
  ClassP.dispatchEvent = function(event) {
    var listeners = this._listenersByType[event.type]

    if (listeners) {
      for (var ct = 0; ct < listeners.length; ct++) {
        console.assert(listeners[ct].cbk, 'cbk is not defined for listener')
        listeners[ct].cbk(event)
      }
    }
  }

  return StopGapJs_Sm
})
