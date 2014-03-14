var controls, application, transport;
loadAPI(1);

host.defineController("Generic", "Maschine Midi", "1.0", "E18947B2-AD95-4CA1-9C40-C66DB269A9BA");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine Controller Virtual Input"], ["Maschine Controller Virtual Output"]);

var ranges = {
  lowKnob: 14,
  highKnob: 29,
  lowSwitch: 46,
  highSwitch: 61,
  lowPad: 66,
  highPad: 81
};


// [ channel (hex), cc# (int)]
var cc = {
  metro: [0xB0, 46, tMetro ],
  loop: [0xB0, 47, tLoop ],
  pin: [0xB0, 48, tPunchIn ],
  pout: [0xB0, 49, tPunchOut ],
  view: [0xB0, 50, tView ],
  automation: [0xB0, 51, tAutoEditor ],
  editor: [0xB0, 52, tNoteEditor ],
  mixer: [0xB0, 53, tMixer ],
  arrow: {
    left: [ 0xB0, 78, arrowLeft ],
    down: [ 0xB0, 79, arrowDown ],
    up: [ 0xB0,  80, arrowUp ],
    right: [ 0xB0, 81, arrowRight ]
  },
  panel: {
    left: [ 0xB0, 74, panelLeft ],
    down: [ 0xB0, 75, panelDown ],
    up: [ 0xB0,  76, panelUp ],
    right: [ 0xB0, 77, panelRight ]
  },
  meta: {
    cut: [ 0xb0, 66, doCut ],
    copy: [ 0xb0, 67, doCopy ],
    paste: [ 0xb0, 68, doPaste ],
    enter: [ 0xB0, 69, doEnter ],
    rename: [ 0xb0, 70, doRename ],
    duplicate: [ 0xb0, 71, doDuplicate ],
    browse: [ 0xb0, 72, tBrowse ],
    exit: [ 0xb0, 73, doExit ]
  }
};

function doRename() { application.rename(); }
function doCopy(){ application.copy(); }
function doPaste(){ application.paste(); }
function doCut(){ application.cut(); }
function doDuplicate(){ application.duplicate(); }
function doEnter() { application.enter(); }
function doExit() { application.escape(); }
function tLoop(){ transport.toggleLoop(); }
function tMetro(){ transport.toggleClick(); }
function tPunchIn(){ transport.togglePunchIn(); }
function tPunchOut(){ transport.togglePunchOut(); }
function tBrowse() { alert('b'); application.toggleBrowserVisibility(); }
function tView(){ alert('tab'); application.nextPerspective(); }
function tAutoEditor(){ alert('a'); application.toggleAutomationEditor(); }
function tNoteEditor(){ alert('e'); application.toggleNoteEditor(); }
function tMixer(){ alert('m'); application.toggleMixer(); }
function arrowDown () { application.arrowKeyDown(); }
function arrowLeft () { application.arrowKeyLeft(); }
function arrowRight () { application.arrowKeyRight(); }
function arrowUp () { application.arrowKeyUp(); }
function panelUp () { application.focusPanelAbove(); }
function panelDown () { application.focusPanelBelow(); }
function panelLeft () { application.focusPanelToLeft(); }
function panelRight () { application.focusPanelToRight(); }

function setupMidiIn(onMidi, onSysex) {
  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
  //for pad notes
  host.getMidiInPort(0).createNoteInput('Maschine Pad Midi');
}

function spy(obj){
  for (var j = 0, l = arguments.length; j < l; j++) {
  var a = [];
    log('=== ' + arguments[j] + ' ===');

    for (var i in arguments[j]) {
      a.push(i)
    }
  log(a);
  }
}

function init() {
  setupMidiIn(onMidi, onSysex);

  controls = host.createUserControls(8);
  application = host.createApplication();
  transport = host.createTransport();

  log(controls, application, transport);
  spy(host, controls, application, transport);
}


function onMidi(status, data1, data2) {
  var msg = '';

  if ( isNoteOn(status) || isAfterTouch(status) ) {
    // note
    msg += 'Note';

  } else if ( isChannelController(status) ) {
    //knob or button
    if ( withinRange(data1, ranges.lowKnob, ranges.highKnob )){
      msg += 'Knob: ';
    } else if ( withinRange(data1, ranges.lowSwitch, ranges.highSwitch ) ) {
      msg += 'Switch: ';
      for ( var i in cc ){
        if ( checkControl( cc[i][0], cc[i][1], status, data1 ) ){
          msg += i;
          cc[i][2]();
        }
      }
    } else if ( withinRange( data1, ranges.lowPad, ranges.highPad )){
      msg += 'Pad: ';
      for ( var i in cc ){
        if ( typeof cc[i] === "object" ){
          for (var j in cc[i] ){
            if ( checkControl(cc[i][j][0], cc[i][j][1], status, data1)) {
              msg += i + " | " + j;
              cc[i][j][2]();
            }
          }
        }
      }
    }
  }


  printMidi(status, data1, data2);
  log(msg);
}


//does this match the table
function checkControl(channel, msg, status, data1){
  return ( channel == status.toString(10) && msg == data1 );
}

function log(msg) {
  for (var i = 0, l = arguments.length; i < l; i++) {
    host.println(arguments[i]);
  }
}

function alert(msg) {
  host.showPopupNotification(msg);
}

function onSysex(data) {
  log(data);
}

function exit() {
  log('bye');
}