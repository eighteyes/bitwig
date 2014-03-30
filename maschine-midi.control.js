var controls, application, transport;
loadAPI(1);
load('utils.js');

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

var cc = {};
// load('obs.js');

// [ channel (hex), cc# (int)]
cc[0xb0] = {
  //knob
  updown: [ 14, [ arrowUp, arrowDown ] ],
  leftright: [ 15, [ arrowLeft, arrowRight ] ],

  //buttons
  metro: [ 46, tMetro ],
  loop: [ 47, tLoop ],
  pin: [ 48, tPunchIn ],
  pout: [ 49, tPunchOut ],
  view: [ 50, tView ],
  automation: [ 51, tAutoEditor ],
  editor: [ 52, tNoteEditor ],
  mixer: [ 53, tMixer ],

  gDub: [ 54, tGlobalOverdub],
  gWrite: [ 55, tGlobalAutoWrite],
  gLatch: [56, tGlobalAutoLatch],

  lDub: [ 58, tLaunchOverdub],
  lAuto: [ 59, tLaunchAuto],
  //pads
  arrow: {
    left: [ 78, arrowLeft ],
    down: [ 79, arrowDown ],
    up: [  80, arrowUp ],
    right: [ 81, arrowRight ]
  },
  panel: {
    left: [ 74, panelLeft ],
    down: [ 75, panelDown ],
    up: [  76, panelUp ],
    right: [ 77, panelRight ]
  },
  meta: {
    cut: [ 66, doCut ],
    copy: [ 67, doCopy ],
    paste: [ 68, doPaste ],
    enter: [ 69, doEnter ],
    rename: [ 70, doRename ],
    duplicate: [ 71, doDuplicate ],
    browse: [ 72, tBrowse ],
    exit: [ 73, doExit ]
  },
  transport: {
    restart: [ 104, restart],
    rewind: [105, rewind ],
    ff: [106, ff ],
    play: [ 108, play ],
    rec: [ 109, rec]
  }
};

// cc[0xB0][14] = [tMetro=, 'metro']
var ccs = translateCCObj(cc);
log(ccs[0xb0]);

function translateCCObj( obj ){
  var ts = Object.prototype.toString;
  var entity, type, retObj = {};
  //cycle through channels
  for (var c in obj){
    var array = [];
    //cycle through commands
    for ( var i in obj[c] ){
      // "A" - array, "O" - object
      type = ts.call(obj[c][i])[8];
      entity = obj[c][i];
      // handle nested
      if (type == "O"){
        for (var j in entity){
          control = entity[j][0];
          array[control] = [ entity[j][1], i+":"+j ];
        }
      } else if (type == "A"){
        control = entity[0];
        array[control] = [ entity[1], i ]
      }
    }
    retObj[c] = array;
  }
  return retObj;
}

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
function tLaunchOverdub() { transport.toggleLauncherOverdub();}
function tLaunchAuto() { transport.toggleWriteClipLauncherAutomation();}
function tGlobalOverdub() { transport.toggleOverdub();}
function tGlobalAutoWrite() { transport.toggleWriteArrangerAutomation();}
function tGlobalAutoLatch() { transport.toggleLatchAutomationWriteMode();}
function tGlobalAutoTouch() { transport.setAutomationWriteMote('touch');}
function play() { transport.play(); }
function ff() { transport.fastForward(); }
function restart() { transport.restart(); }
function rewind() { transport.rewind(); }
function rec() { transport.record(); }

function setupMidiIn(onMidi, onSysex) {
  host.getMidiInPort(0).setMidiCallback(onMidi);
  host.getMidiInPort(0).setSysexCallback(onSysex);
  //for pad notes
  host.getMidiInPort(0).createNoteInput('Maschine Pad Midi');
}


function init() {
  setupMidiIn(onMidi, onSysex);

  controls = host.createUserControls(8);
  application = host.createApplication();
  transport = host.createTransport();
//
  // log(controls, application, transport);
  // spy(host, controls, application, transport);
}


function onMidi(status, data1, data2) {
  var fun, msg = '';
   printMidi(status, data1, data2);

  if ( isNoteOn(status) || isKeyPressure(status) ) {
    // note
    msg += 'Note';
  } else if ( isChannelController(status) ) {
    //knob or button
    if ( withinRange(data1, ranges.lowKnob, ranges.highKnob )){
      msg += 'Knob: ' + data2 + ' ';
    } else if ( withinRange(data1, ranges.lowSwitch, ranges.highSwitch ) ) {
      msg += 'Switch: ' ;
    } else if ( withinRange( data1, ranges.lowPad, ranges.highPad )){
      msg += 'Pad: ';
    }

    // status == channel, data == cc
    fun = ccs[status][data1];
    msg += fun[1];

    if (typeof fun[0] == "object"){
      //handle knobs
      fun[0][data2]();
    } else {
      // do the function
      fun[0]();
    }
  }

  log(msg);
}


function onSysex(data) {
  log(data);
}

function exit() {
  log('bye');
}