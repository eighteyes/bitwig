var midi = require('midi');

var input = new midi.input();
var output = new midi.output();

var tx = 0;

console.log('Inputs');
for ( var i = 0, l = input.getPortCount(); i<l; i++ )
{
  console.log(input.getPortName(i));
  var realInput = new midi.input();
  realInput.openPort(i);
  realInput.on('message', poop);
}

console.log('Outputs');
for ( var i = 0, l = output.getPortCount(); i<l; i++ )
{
  console.log(output.getPortName(i));
  // var realOutput = new midi.output();
  // realOutput.openPort(i);
  // realOutput.on('message', poop);
}

function poop(t, m) {
  var tr = Math.round(t*1000);
  tx += tr;
console.log(t, m);
console.log(  "(" + tr + ") : " +
    (m[0]).toString(16)+" "+(m[1]).toString(16)+" "+(m[2]).toString(16), m
    );
};

// var out = new midi.output();

// out.openPort(0);
// out.sendMessage([176,22,1]);
// out.closePort();


// input.closePort();
