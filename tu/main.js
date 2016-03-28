var assert = require('assert')
var requirejs = require('requirejs')

describe('States transition', function(){

  var StopGapJs_Sm = requirejs('../sm.js')

  var config = {
    "states" : [
      { "id" : "root_state" },
      { "id" : "second_state" },
      { "id" : "third_state" },
      { "id" : "last_state" }
    ],
    "rootStateId" : "root_state",
    "transitions" : [
      {
        srcStateId : "root_state",
        dstStateId : "second_state",
        type : "simple"
      },
      {
        srcStateId : "second_state",
        dstStateId : "third_state",
        type : "simple"
      },
      {
        srcStateId : "third_state",
        dstStateId : "last_state",
        type : "simple"
      },
      {
        srcStateId : "last_state",
        dstStateId : "root_state",
        type : "final_rewind"
      },
      {
        srcStateId : "third_state",
        dstStateId : "root_state",
        type : "mid_rewind"
      }
    ]
  }
  var stjSm = new StopGapJs_Sm().init(config)
  var curState = stjSm.getCurState()
  var transitions

  it ('Root State (first one) must have "root_state" as id',
    function() {
      console.log(curState)
      assert(curState.id === "root_state")
    }
  )

  it ('.getTransitiona on rootState must give only one transition which is of type "simple"',
    function() {
      transitions = curState.getTransitions()

      assert(typeof curState.getTransitions === "function")
      assert(transitions.simple)
      assert(! transitions.mid_rewind)
      assert(! transitions.final_rewind)
    }
  )

  it ('After first transition, event must been thrown with a simple transition as event detail',
    function(ok) {
      stjSm.addEventListener('transit',
        function(event) {
          assert(event)
          assert(event.type === 'transit')
          assert(event.detail.transition)
          assert(event.detail.transition.type === "simple")
          ok()
        }
      )
      curState = transitions.simple.execute()
    }
  )

  it ('After first transition, current state must be "second_state"',
    function() {
      assert(typeof curState.getTransitions === "function")
      assert(transitions.simple)
      assert(! transitions.mid_rewind)
      assert(! transitions.final_rewind)
    }
  )

})
