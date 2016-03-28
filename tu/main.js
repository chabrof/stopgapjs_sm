var assert = require('assert')
var requirejs = require('requirejs')

describe('States transition', function(){

  var StopGapJs_Sm = requirejs('sm.js')
  var stjSm = new StopGapJs_Sm().init();

  var config = {
    "states" : [
      { "id" : "root_state" },
      { "id" : "second_state" },
      { "id" : "third_state" },
      { "id" : "last_state" }
    ],
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

  it ('Root State must have "root_state" as id', function(){
    assert();
  });
})
