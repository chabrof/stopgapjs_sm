define([], function() {
  "use strict"

  var StopGapJs_Sm = function() {}
  var ClassP = StopGapJs_sm.prototype

  ClassP.init = function(config) {
    var self = this
    this._listenerIdx = 0
    this._listenersByType = {}
    self._statesById = {}

    // Stores states by ref in a hash with .id as key
    config.states.forEach(
      function(state) {
        self._statesById[state.id] = state
      } )

    // Current state
    self._curStateId = config.rootStateId

    // Store transition in a hash with .id as key
    // Store transitions which move from states, in hash with state.id as key
    config.transitions.forEach(
      function(transition) {
        // pre
        console.assert(transition.type, "type of transition must be set in transition object")
        console.assert(transition.srcStateId, "srcStateId must been set in transition object")

        if (! self._states2Trans[transition.srcStateId]) {
          self._statesId2Trans[transition.srcStateId] = {}
        }
        console.assert(self._statesId2Trans[transition.srcStateId][transition.type] === undefined, "only one transition of each type is allowed for one state as source of this transition")
        self._statesId2Trans[transition.srcStateId][transition.type] = transition;
      })
    return this
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
		this._sgjsm._curStateId = this.dstStateId
    var event = new CustomEvent('transit', { "detail" : { "transtion" : this }})
    this._sgjsm.dispatchEvent(event)
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
    listener.arrayIdx = this._listenersByType[type].length - 1
	}

  ClassP.removeEventListener = function(listenerIdx) {
    var listener = this._listeners[listenerIdx] = undefined
    var type = listener.type
    for (var idx = listener.arrayIdx + 1; idx < this._listenersByType[type].length; idx++) {
      console.assert(this._listenersByType[type][idx].arrayIdx >= 0, 'arrayIdx for a listener event must be an integer');
      --(this._listenersByType[type][idx].arrayIdx)
    }
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

  return StopGapJs_sm
})
