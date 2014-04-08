loadAPI(1);
load('utils.js');

host.defineController("Generic", "Maschine Midi In", "1.0", "BD36E28A-BC61-4819-89E0-1B4AF9F231DB");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Controller MIDI input port 0"], ["Maschine Controller MIDI input port 0"]);


function setupMidiIn(onMidi, onSysex) {
  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
  //pass midi in
  host.getMidiInPort(0).createNoteInput('Maschine Midi In');
}

function init() {
  setupMidiIn(onMidi, onSysex);
}

function onMidi(status, data1, data2) {
  printMidi(status, data1, data2);
}


function onSysex(data) {
  log(data);
}

function exit() {
  log('bye');
}