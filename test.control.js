loadAPI(1);

host.defineController("Generic", "Maschine Midi", "1.0", "E18947B2-AD95-4CA1-9C40-C66DB269A9BA");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Controller Virtual Input"], ["Maschine Controller Virtual Output"]);

var isEngineOn = false;

function log(msg) {
  for (var i = 0, l = arguments.length; i < l; i++) {
    host.println(arguments[i]);
  }
}

function alert(msg) {
  host.showPopupNotification(msg);
}

function setupMidiIn(onMidi, onSysex) {
  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
  //for pad notes
  host.getMidiInPort(0).createNoteInput('Maschine Pad Midi');
  host.getMidiInPort(1).createNoteInput('Maschine Pad Midi In');
}

function init() {
  setupMidiIn(onMidi, onSysex);

  //host.createRemoteConnection('bitwig socket', 6660);
  //host.connectToRemoteHost('localhost', 6661);
}

function onMidi(status, data1, data2) {
  printMidi(status, data1, data2);

  // is knob section - treat as 16 knobs / buttons
    // which page (channel)
  // is pad (notes handled elsewhere)
  // is other
}


function onSysex(data) {
  log(data);
}

function exit() {
  log('bye');
}