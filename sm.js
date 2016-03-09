define([], function() {
  "use strict"

  var StopGapJs_sm = function() {}
  var ClassP = StopGapJs_sm.prototype

  ClassP.init = function(config) {
    var self = this
    this._listenerIdx = 0
    this._listenersByType = {}
    self._statesById = {}

    // Stores states by ref in a hash with .id as key
    config.states.forEach(function(state) {
        self._statesById[state.id] = state
				//self.
      })

    // Current state
    self._curStateId = config.rootStateId

    // Store transition in a hash with .id as key
    // Store transitions which move from states, in hash with state.id as key
    config.transitions.forEach(function(transition) {
        self._transitionsH[transition.id] = transition
        if (! self._states2Trans[transition.srcStateId]) {
          self._statesId2Trans[transition.srcStateId] = []
        }
        self._statesId2Trans[transition.srcStateId].push(transition.id)
      })
  }

  ClassP.getCurState = function() {
    return this._statesById[this._curStateId]
  }

  var State_getAvailableTrans = function() {
		return this._sgjsm._statesId2Trans[this._curStateId]
  }

  ClassP._injectMethodsIntoState = function(state) {
		state._sgjsm = this
		state.getAvailableTrans = State_getAvailableTrans
  }

	var Transition_execute = function() {
		this._curStateId = this.dstStateId
	}

	ClassP._injectMethodsIntoTrans = function(transition) {
		transition._sgjsm = this;
		transition.execute = Transition_execute;
  }

	ClassP.addEventListener = function(type, cbk) {
    // pre
		console.assert(typeof type === "string" && typeof cbk === "function" && type && cbk, "Arg 'Type' (string) of event must be given, as well as cbk (function)") {

    this._listenerIdx++

		var listener = {
			type 	: type,
			cbk 	: cbk
		}
    this._listeners[this._listenerIdx] = listener
		if (! this._listenersByType[type]) {
			this._listenersByType[type] = {}
		}
		this._listenersByType[type].push(listener)
    listener.arrayIdx = this._listenersByType[type].length
	}


  ClassP.removeEventListener = function(listenerIdx) {

    this._listeners[listenerIdx] = undefined
  }

	/*event = new CustomEvent(attribName, { "detail" : { "exec" : true, "after" : true }})
                  self.dispatchEvent(event)
								*/
	ClassP.dispatchEvent = function(event) {
    var listeners = this._listenersByType[event.type]

		if (listeners) {
			for (var ct = 0; ct < listeners.length; ct++) {
				console.assert(listeners[ct].cbk, 'cbk is not define for listener')
				listeners[ct].cbk(event)
			}
		}
	}

  return StopGapJs_sm
})
