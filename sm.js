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
				//self.
      })

    // root state
    self._curStateId = config.rootStateId

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

  ClassP.getCurState = function() {
    return this._statesHash[this._curStateId]
  }

  var State_getAvailableTrans = function() {
		return this._sgjsm._statesId2Trans[this._curStateId]
  }

  ClassP._injectMethodsIntoState = function(state) {
		state._sgjsm = this;
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
		if (typeof type === "string" && typeof cbk === "function" && type && cbk) {
			this._listenerId++

			var listener = {
				type 	: type,
				cbk 	: cbk
			}

			if (! this._listenersHash[type]) {
				this._listenersHash[type] = {}
			}
			this._listenersHash[type][this.listenerId] = listener
		} else {
			throw "not valid EventListener adding"
		}
	}

	/*event = new CustomEvent(attribName, { "detail" : { "exec" : true, "after" : true }})
                  self.dispatchEvent(event)
								*/
	ClassP.dispatchEvent = function(type, obj) {

		if (this._listenersHash[type]) {
			for (var i in this._listenersHash[eventName]) {
				console.assert(i.cbk, 'cbk is not define for listener')
				i.cbk(type, obj);
			}
		}
	}

  return StopGapJs_sm
})
