loadAPI(1);
load('utils.js');

host.defineController("Native Instruments", "Maschine Midi In", "1.0", "BD36E28A-BC61-4819-89E0-1B4AF9F231DB");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Controller MIDI input port 0"], ["Maschine Controller MIDI input port 0"]);

function setupMidiIn(onMidi, onSysex) {
  //pass midi in
  var noteInput = host.getMidiInPort(0).createNoteInput('Maschine Midi In');

  // from PianoTEQ
  var input = "Velocity = [0, 48, 57, 65, 108, 127; 0, 32, 64, 96, 127, 127]";

  input = input.replace(/[a-z\]\[=]/ig, '');

  var inputVel = input.split(';')[1].split(',');
  var transVel = input.split(';')[0].split(',');

  inputVel = [ 0, 1, 46, 50, 62, 98, 127]; // x
  transVel = [ 0, 1, 32, 64, 96, 127, 127]; // y

  var output = [];
  for ( slope = 0, i = 0; i < 128; i++){
    //Y = Y1 + ( ( Y2 - Y1) ( X - X1 ) / ( X2 - X1) )
    y = transVel[0] + ( ((transVel[1] - transVel[0]) * ( i - inputVel[0] )) / (inputVel[1]-inputVel[0]) );
    output[i] = Math.min(Math.round(y), 127);
    // debugStr += i + "|" + output[i] + '   ';
    if ( inputVel[1] < i ){
      transVel.shift();
      inputVel.shift();
    }
  }

  // log(debugStr);

  noteInput.setVelocityTranslationTable(output);
}

function init() {
  setupMidiIn(onMidi, onSysex);
}

function onMidi(status, data1, data2) {
  printMidi(status, data1, data2);
  log(data2);
}


function onSysex(data) {
  log(data);
}

function exit() {
  log('bye');
}