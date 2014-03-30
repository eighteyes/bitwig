var controls, application, transport;
loadAPI(1);

host.defineController("Generic", "TouchOSC Bridge", "1.0", "F2DF83F0-1F3C-4A7D-A40F-17A88F33A084");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["TouchOSC Bridge"], ["TouchOSC Bridge"]);

