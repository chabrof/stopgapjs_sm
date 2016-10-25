var assert = require('assert')
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['require', '../sm.js'], // here we get the requirejs object in order to set the cur path to the path of this top level file
  function (requirejs, StopGapJs_Sm) {

    describe('States transition', function() {
      var stjSm, curState, eventListenerId
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
      stjSm = new StopGapJs_Sm().init(config)

      describe('Root State', function() {
        curState = stjSm.getCurState()
        it ('it must have "root_state" as id',
          function() {
            assert(curState.id === "root_state")
          }
        )
        it ('.getTransitiona must give only one transition which is of type "simple"',
          function() {
            var transitions = curState.getTransitions()

            assert(typeof curState.getTransitions === "function")
            assert(transitions['simple'])
            assert(! transitions['mid_rewind'])
            assert(! transitions['final_rewind'])
          }
        )
      })

      describe('After First transition', function() {
        var transitions

        before(function() {
          transitions = curState.getTransitions()
        })

        it ('Event must been thrown with a simple transition as event detail',
          function(ok) {

            eventListenerId = stjSm.addEventListener('transit',
              function(event) {
                stjSm.removeEventListener(eventListenerId)
                assert(event)
                assert(event.type === 'transit')
                assert(event.detail.transition)
                assert(event.detail.transition.type === "simple")
                ok()
              }
            )
            curState = transitions.simple.execute()
            transitions = curState.getTransitions()
          }
        )

        it ('Current state must be "second_state" whith only one next transitin of type simple',
          function() {
            assert(typeof curState.getTransitions === "function")
            assert(curState.id === "second_state");
            assert(transitions['simple'])
            assert(! transitions['mid_rewind'])
            assert(! transitions['final_rewind'])
          }
        )
      });

      describe('After second transition', function() {
        it ('Current state must be "third_state" whith two availables transitions',
          function() {
            var transitions = curState.getTransitions()
            curState = transitions['simple'].execute()
            transitions = curState.getTransitions()

            assert(curState.id === "third_state");
            assert(typeof curState.getTransitions === "function")
            assert(transitions['simple'])
            assert(transitions['mid_rewind'])
            assert(! transitions.final_rewind)
          }
        )
      })
    })
  })
