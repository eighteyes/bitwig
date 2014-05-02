// how do channel routing - not tested

loadAPI(1);
load('utils.js');

host.defineController("generic", "DEMO", "1.0", "A4C87CFD-F815-4E8C-99EC-FAB179481FF7");
host.defineMidiPorts(4, 1);
host.addDeviceNameBasedDiscoveryPair(["Keyboard Input"], ["Keyboard Output"]);

function init() {
    host.getMidiInPort(0).createNoteInput('Channel 1');
    host.getMidiInPort(1).createNoteInput('Channel 2');
    host.getMidiInPort(2).createNoteInput('Channel 3');
    host.getMidiInPort(3).createNoteInput('Channel 4');
}