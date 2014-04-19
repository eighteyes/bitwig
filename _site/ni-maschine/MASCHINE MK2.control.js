////////////////////////////////////////////////////////////////////////////////

loadAPI(1);

load("maschine_constants.js");
load("maschine_color.js");
load("maschine_display.js");
load("maschine_pads.js");
load("maschine_state.js");
load("maschine_clip_launcher_page.js");
load("maschine_device_parameter_page.js");
load("maschine_device_preset_page.js");
load("maschine_drum_pad_grid.js");
load("maschine_keyboard_grid.js");
load("maschine_note_pattern_grid.js");

////////////////////////////////////////////////////////////////////////////////

host.defineController(VENDOR, MODEL, VERSION, UUID);
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair([IO_PORT_1], [IO_PORT_1]);
host.addDeviceNameBasedDiscoveryPair([IN_PORT_2], [OUT_PORT_2]);
host.addDeviceNameBasedDiscoveryPair([IN_PORT_3], [OUT_PORT_3]);

////////////////////////////////////////////////////////////////////////////////

function exit()
{
   clearDisplay();
   sendSysex(GOODBYE_MESSAGE);
   isConnected = false;
};

function init()
{
   initState();

   noteIn = host.getMidiInPort(0).createNoteInput("Maschine Pads", "80????", "90????", "B001??", "B040??", "D0????", "E0????");

   host.getMidiInPort(0).setMidiCallback(onMidi);
   host.getMidiInPort(0).setSysexCallback(onSysex);

   transport = initTransportSection();
   cursorTrack = createCursorTrackSection();
   cursorDevice = createCursorDeviceSection();
   cursorClip = createCursorClipSection();

   host.scheduleTask(onUpdateBlinkState, null, 40);

   initAutomationRecordPage(transport);

   createTrackBankSections();

   clearDisplay();
   sendSysex(WELCOME_MESSAGE);

   setActiveDisplayPage(isBrowsing ? devicePresetPage : deviceParameterPage);
   setActivePadMode(PAD_MODE.CLIP_LAUNCH);
};

function initTransportSection()
{
   var transport = host.createTransportSection();

   transport.addIsPlayingObserver(function(isPlaying)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.PLAY, isPlaying ? 127 : 0);
   });
   transport.addIsRecordingObserver(function(isRecording)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.REC, isRecording ? 127 : 0);
   });
   transport.addOverdubObserver(function(isEnabled)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.ERASE, isEnabled ? 127 : 0);
   });
   transport.addClickObserver(function(isEnabled)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.METRONOME, isEnabled ? 127 : 0);
   });

   return transport;
};

function createCursorTrackSection()
{
   var cursorTrack = host.createCursorTrackSection(1, 16);
   cursorTrack.addNoteObserver(notePatternGrid.onNotePlay);

//   cursorTrack.getVolume().addNameObserver(8, "", trackPage.paramName.setter(0));
//   cursorTrack.getVolume().addValueDisplayObserver(8, "", trackPage.paramDisplay.setter(0));
//   cursorTrack.getVolume().addValueObserver(12, trackPage.knobLedSetter(0, LED_MODE.FROM_LEFT));
//   cursorTrack.getPan().addNameObserver(8, "", trackPage.paramName.setter(1));
//   cursorTrack.getPan().addValueDisplayObserver(8, "", trackPage.paramDisplay.setter(1));
//   cursorTrack.getPan().addValueObserver(12, trackPage.knobLedSetter(1, LED_MODE.FROM_LEFT));
//   for(var s=0; s<6; s++)
//   {
//      cursorTrack.getSend(s).addNameObserver(8, "", trackPage.paramName.setter(s+2));
//      cursorTrack.getSend(s).addValueDisplayObserver(8, "", trackPage.paramDisplay.setter(s+2));
//      cursorTrack.getSend(s).addValueObserver(12, trackPage.knobLedSetter(s+2, LED_MODE.FROM_LEFT));
//   }

   return cursorTrack;
};

function createCursorClipSection()
{
   var cursorClip = host.createCursorClipSection(16, 1);
   cursorClip.addStepDataObserver(notePatternGrid.onStepExists);
   cursorClip.addPlayingStepObserver(notePatternGrid.onStepPlay);

   return cursorClip;
}

function createCursorDeviceSection()
{
   cursorDevice = host.createCursorDeviceSection(8);
   cursorDevice.addHasSelectedDeviceObserver(deviceParameterPage.hasContentSetter());
   cursorDevice.addHasSelectedDeviceObserver(devicePresetPage.hasContentSetter());
   cursorDevice.addNameObserver(13, "-", devicePresetPage.deviceName.setter(0));
   cursorDevice.addPresetNameObserver(13, "-", devicePresetPage.presetName.setter(0));
   cursorDevice.addPresetCategoryObserver(13, "-", devicePresetPage.presetCategory.setter(0));
   cursorDevice.addPresetCreatorObserver(13, "-", devicePresetPage.presetCreator.setter(0));
   userControls = host.createUserControlsSection(8);

   for (var p = 0; p < 8; p++)
   {
      var control = userControls.getControl(p);
      control.setIndication(false);
      control.setLabel("Ctrl " + (p + 1));
      control.addNameObserver(6, "", deviceParameterPage.userControlName.setter(p));
      control.addValueDisplayObserver(6, "", deviceParameterPage.userControlValue.setter(p));
//      control.addValueObserver(12, makeIndexedFunction(p, deviceParameterPage.onUserControlValue));

      var macro = cursorDevice.getMacro(p);
      var macroParameter = macro.getAmount();
      macro.addLabelObserver(6, "", deviceParameterPage.macroName.setter(p));
      macroParameter.addValueDisplayObserver(6, "", deviceParameterPage.macroValue.setter(p));
//      macroParameter.addValueObserver(12, makeIndexedFunction(p, deviceParameterPage.onMacroValue));

      var parameter = cursorDevice.getParameter(p);
      parameter.setLabel("P" + (p + 1));
      parameter.addNameObserver(6, "", deviceParameterPage.pageParameterName.setter(p));
      parameter.addValueDisplayObserver(6, "", deviceParameterPage.pageParameterValue.setter(p));
//      parameter.addValueObserver(12, makeIndexedFunction(p, deviceParameterPage.onPageParameterValue));

      var commonParameter = cursorDevice.getCommonParameter(p);
      commonParameter.setLabel("C" + (p + 1));
      commonParameter.addNameObserver(6, "", deviceParameterPage.commonParameterName.setter(p));
      commonParameter.addValueDisplayObserver(6, "", deviceParameterPage.commonParameterValue.setter(p));
//      commonParameter.addValueObserver(12, makeIndexedFunction(p, deviceParameterPage.onCommonParameterValue));

      var envParameter = cursorDevice.getEnvelopeParameter(p);
      envParameter.setLabel("E" + (p + 1));
      envParameter.addNameObserver(6, "", deviceParameterPage.envelopeParameterName.setter(p));
      envParameter.addValueDisplayObserver(6, "", deviceParameterPage.envelopeParameterValue.setter(p));
//      envParameter.addValueObserver(12, makeIndexedFunction(p, deviceParameterPage.onEnvelopeParameterValue));
   }

   drumPadGrid = cursorDevice.createDrumPadGrid(4, 4);
   cursorDrumPad = drumPadGrid.getCursorDrumPad();

   for(var p = 0; p < 16; p++)
   {
      var pad = drumPadGrid.getDrumPad(p);

      pad.addColorObserver(getGridPadColorObserverFunc(p,
         padColorBuffer16,
         [drumPadButtonGrid, keyboardGrid]));

      pad.exists().addValueObserver(getGridPadObserverFunc(p,
         padExistsBuffer16,
         [drumPadButtonGrid]));

      pad.getMute().addValueObserver(getGridPadObserverFunc(p,
         padMuteBuffer16,
         [drumPadButtonGrid]));

      pad.getSolo().addValueObserver(getGridPadObserverFunc(p,
         padSoloBuffer16,
         [drumPadButtonGrid]));

      pad.addVuMeterObserver(7, -1, true, getGridPadObserverFunc(p,
         padMeterBuffer16,
         [drumPadButtonGrid]));
   }

   drumPadGrid.addCanScrollUpObserver(function(canScroll)
   {
      drumPadButtonGrid.setCanScrollUp(canScroll)
   });

   drumPadGrid.addCanScrollDownObserver(function(canScroll)
   {
      drumPadButtonGrid.setCanScrollDown(canScroll)
   });

   deviceParameterPage.updateIndications();

   return cursorDevice;
};

function initAutomationRecordPage(transport)
{
   transport.addIsWritingClipLauncherAutomationObserver(function(isEnabled)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.WRITE_CLIP_AUTOMATION, isEnabled ? 127 : 0);
   });
   transport.addAutomationOverrideObserver(function(isEnabled)
   {
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.AUTOMATION_OVERRIDE, isEnabled ? 127 : 0);
   });
   transport.addAutomationWriteModeObserver(function(writeMode)
   {
      var isLatch = (writeMode == "latch");
      var isTouch = (writeMode == "touch");
      var isWrite = (writeMode == "write");
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.LATCH_AUTOMATION_MODE, isLatch ? 127 : 0);
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.TOUCH_AUTOMATION_MODE, isTouch ? 127 : 0);
      sendChannelController(CC.TRANSPORT.CHANNEL, CC.TRANSPORT.WRITE_AUTOMATION_MODE, isWrite ? 127 : 0);
   });
};

function createTrackBankSections()
{
   trackBank4 = host.createTrackBankSection(4, 0, 4);
   trackBank8 = host.createTrackBankSection(8, 2, 0);

   for(var t = 0; t < 8; t++)
   {
      var track = trackBank8.getTrack(t);

      track.getVolume().addValueObserver(8, getGridPadObserverFunc(t, trackVolumeBuffer8, []));
      track.getPan().addValueObserver(8, getGridPadObserverFunc(t, trackPanBuffer8, []));
      track.getSend(0).addValueObserver(8, getGridPadObserverFunc(t, trackSendBuffer8[0], []));
      track.getSend(1).addValueObserver(8, getGridPadObserverFunc(t, trackSendBuffer8[1], []));
   }

   for(var t = 0; t < 4; t++)
   {
      var track = trackBank4.getTrack(t);
      var clipLauncher = track.getClipLauncher();

      clipLauncher.addIsSelectedObserver(getGridCellObserverFunc(t, isSlotSelectedBuffer16, [clipPatternGrid]));
      clipLauncher.addHasContentObserver(getGridCellObserverFunc(t, slotHasClipBuffer16, [clipPatternGrid]));
      clipLauncher.addIsPlayingObserver(getGridCellObserverFunc(t, isPlayingBuffer16, [clipPatternGrid]));
      clipLauncher.addIsRecordingObserver(getGridCellObserverFunc(t, isRecordingBuffer16, [clipPatternGrid]));
      clipLauncher.addIsQueuedObserver(getGridCellObserverFunc(t, isQueuedBuffer16, [clipPatternGrid]));
      clipLauncher.addColorObserver(getGridCellColorObserverFunc(t, clipColorBuffer16, [clipPatternGrid]));
   }

   trackBank4.addCanScrollTracksUpObserver(function(canScroll)
   {
      clipPatternGrid.setCanScrollUp(canScroll);
   });

   trackBank4.addCanScrollTracksDownObserver(function(canScroll)
   {
      clipPatternGrid.setCanScrollDown(canScroll);
   });

   trackBank4.addCanScrollScenesUpObserver(function(canScroll)
   {
      clipPatternGrid.setCanScrollLeft(canScroll);
   });

   trackBank4.addCanScrollScenesDownObserver(function(canScroll)
   {
      clipPatternGrid.setCanScrollRight(canScroll);
   });
};

////////////////////////////////////////////////////////////////////////////////

/**
 * Received when a MIDI message arrives at the MIDI in-port assigned to the control surface.
 * @param {MidiMessage} msg
 */
function onMidi(status, data1, data2)
{
   var isButtonPress = data2 > 0;
   var noteOn = isNoteOn(status);
   var noteOff = isNoteOff(status, data2);

   println(data1);

   if (noteOn || noteOff)
   {
      var index = data1 - CC.PAD_0;

      if (noteOff)
      {
//         color = COLOR.OFF;
         notePressedBuffer16[index] = -1.0;
      }
      else
      {
//         color = new Color(COLOR.PRESSED_NOTE_KEY.hue, COLOR.PRESSED_NOTE_KEY.saturation, 0.5 + 0.5 * data2);
         notePressedBuffer16[index] = data2 / 127.0;
      }

      var row = Math.floor(index / 4);
      var column = index % 4;

      if (row < 4 && column < 4)
      {
         activeGridPage.updateCell(row, column);
         activeGridPage.onGridButton(row, column, isButtonPress);
//         setPadColor(row, column, color);
      }
   }
   else if (isChannelController(status))
   {
      var channel = MIDIChannel(status);

      if (channel == 0 && data1 == CC.GROUP.A)
      {
         isPadShiftPressed = isButtonPress;

         if (isButtonPress && (activePadMode == PAD_MODE.NOTE_SEQUENCE || backupGridMode == PAD_MODE.NOTE_SEQUENCE))
         {
            backupGridMode = PAD_MODE.NOTE_SEQUENCE;
            shiftBackupGridMode = activePadMode;
            setActivePadMode(PAD_MODE.PAD_SELECT);
         }
         else if (!isButtonPress && shiftBackupGridMode != null)
         {
            setActivePadMode(shiftBackupGridMode);
            shiftBackupGridMode = null;

            if (!isPadAltPressed)
            {
               backupGridMode = null;
            }
         }
      }
      else if (channel == 0 && data1 == CC.GROUP.E)
      {
         isPadAltPressed = isButtonPress;

         if (isButtonPress && (activePadMode == PAD_MODE.NOTE_SEQUENCE || backupGridMode == PAD_MODE.NOTE_SEQUENCE))
         {
            backupGridMode = PAD_MODE.NOTE_SEQUENCE;
            altBackupGridMode = activePadMode;
            setActivePadMode(PAD_MODE.SELECT_SLOT);
         }
         else if (!isButtonPress && altBackupGridMode != null)
         {
            setActivePadMode(altBackupGridMode);
            altBackupGridMode = null;

            if (!isPadShiftPressed)
            {
               backupGridMode = null;
            }
         }
      }
      else if (channel == CC.GLOBAL.CHANNEL)
      {
         if (isButtonPress && data1 == CC.GLOBAL.STEP)
         {
            isStepMode = true;
            setActivePadMode(PAD_MODE.NOTE_SEQUENCE);
            sendChannelController(channel, CC.GLOBAL.STEP, 127);
            sendChannelController(channel, CC.GLOBAL.CONTROL, 0);
         }
         else if (isButtonPress && data1 == CC.GLOBAL.CONTROL)
         {
            isStepMode = false;
            setActivePadMode(PAD_MODE.PAD_SELECT);
            sendChannelController(channel, CC.GLOBAL.CONTROL, 127);
            sendChannelController(channel, CC.GLOBAL.STEP, 0);
         }
         else if (isButtonPress && data1 == CC.GLOBAL.BROWSE)
         {
            isBrowsing = !isBrowsing;
            setActiveDisplayPage(isBrowsing ? devicePresetPage : deviceParameterPage);
         }
      }
      else if (isButtonPress && channel == CC.SELECTION.CHANNEL)
      {
         switch(data1)
         {
            case CC.SELECTION.CURSOR_TRACK_NEXT:
               cursorTrack.selectNext();
               break;

            case CC.SELECTION.CURSOR_TRACK_PREV:
               cursorTrack.selectPrevious();
               break;

            default:
               activeDisplayPage.onButton(data1, isButtonPress);
         }
      }
      else if (isButtonPress && channel == CC.TRANSPORT.CHANNEL)
      {
         switch(data1)
         {
            case CC.TRANSPORT.RESTART:
               transport.restart();
               break;

            case CC.TRANSPORT.STEP_LEFT:
               transport.rewind();
               break;

            case CC.TRANSPORT.STEP_RIGHT:
               transport.fastForward();
               break;

            case CC.TRANSPORT.GRID:
               transport.toggleClick();
               break;

            case CC.TRANSPORT.PLAY:
               transport.togglePlay();
               break;

            case CC.TRANSPORT.REC:
               transport.record();
               break;

            case CC.TRANSPORT.ERASE:
               transport.toggleOverdub();
               break;

            case CC.TRANSPORT.LATCH_AUTOMATION_MODE:
               transport.toggleLatchAutomationWriteMode();
               break;

            case CC.TRANSPORT.WRITE_CLIP_AUTOMATION:
               transport.toggleWriteClipLauncherAutomation();
               break;

            case CC.TRANSPORT.WRITE_ARRANGER_AUTOMATION:
               transport.toggleWriteArrangerAutomation();
               break;

            case CC.TRANSPORT.AUTOMATION_OVERRIDE:
               transport.resetAutomationOverrides();
               break;

            case CC.TRANSPORT.LOOP:
               transport.toggleLoop();
               break;

            case CC.TRANSPORT.PUNCH_IN:
               transport.togglePunchIn();
               break;

            case CC.TRANSPORT.PUNCH_OUT:
               transport.togglePunchOut();
               break;

            case CC.TRANSPORT.METRONOME:
               transport.toggleClick();
               break;

            case CC.TRANSPORT.METRONOME_TICKS:
               transport.toggleMetronomeTicks();
               transport.toggleMetronomeTicks();
               break;
         }
      }
      else if (channel == CC.PAD_MODE.CHANNEL)
      {
         if (isButtonPress)
         {
            var padMode = getPadMode(data1, isButtonPress, isPadShiftPressed, isPadAltPressed);
            setActivePadMode(padMode);
         }

         padModePressedStates[ccToPadModeButtonIndex(data1)] = isButtonPress;
      }
      else if (channel == 0)
      {
         if (data1 == CC.GROUP_BUTTON_0 + 5)
         {
            activeGridPage.onLeft(isButtonPress);
         }
         if (data1 == CC.GROUP_BUTTON_0 + 7)
         {
            activeGridPage.onRight(isButtonPress);
         }
         if (data1 == CC.GROUP_BUTTON_0 + 2)
         {
            activeGridPage.onUp(isButtonPress);
         }
         if (data1 == CC.GROUP_BUTTON_0 + 6)
         {
            activeGridPage.onDown(isButtonPress);
         }
         else if (data1 >= CC.CURSOR_DEVICE.PARAMETER_1 && data1 <= (CC.CURSOR_DEVICE.PARAMETER_8))
         {
            // VPots
            var relativeRange = isPadShiftPressed ? 1000 : 200;
            var delta = data2;
            if (delta > 64)
            {
               delta = (-1) * (delta - 64);
            }

            var index = data1 - CC.CURSOR_DEVICE.PARAMETER_1;
            activeDisplayPage.onEncoder(index, delta, relativeRange);
         }
      }
   }

   flushPadButtonColors();
};

function onSysex(data)
{
};

function onObserver(index, message)
{
};

function flush()
{
   flushDisplay();
   flushPadButtonColors();
};

////////////////////////////////////////////////////////////////////////////////

function setActiveDisplayPage(page)
{
   if (activeDisplayPage != page)
   {
      activeDisplayPage = page;
      page.sendDataToDevice();
      sendChannelController(CC.GLOBAL.CHANNEL, CC.GLOBAL.BROWSE, isBrowsing ? 127 : 0);
   }
};

function setActiveGridPage(page)
{
   if (page != activeGridPage)
   {
      println(page.toString());
      activeGridPage = page;
      activeGridPage.onSetActivePage();
   }
};

function setActivePadMode(padMode)
{
   if (activePadMode != padMode)
   {
      activePadMode = padMode;
      updatePadModeButtonStates(padMode);
      setActiveGridPage(getGridPage(padMode));
      activeGridPage.updateGrid();
   }
};

////////////////////////////////////////////////////////////////////////////////

function getGridPage(padMode)
{
   switch(padMode)
   {
      case PAD_MODE.SCENE_LAUNCH:
         return clipPatternGrid;

      case PAD_MODE.CLIP_LAUNCH:
         return clipPatternGrid;

      case PAD_MODE.KEYBOARD:
         return keyboardGrid;

      case PAD_MODE.NOTE_SEQUENCE:
         return notePatternGrid;

      case PAD_MODE.PAD_MUTE:
         return drumPadButtonGrid;

      case PAD_MODE.PAD_SOLO:
         return drumPadButtonGrid;

      case PAD_MODE.PAD_PLAY:
         return drumPadButtonGrid;

      case PAD_MODE.PAD_SELECT:
         return drumPadButtonGrid;

      case PAD_MODE.SELECT_SLOT:
         return clipPatternGrid;

      case PAD_MODE.SELECT_TRACK:
         return drumPadButtonGrid;

      case PAD_MODE.SELECT_SCENE:
         return clipPatternGrid;

      case PAD_MODE.DUPLICATE_SLOT:
         return clipPatternGrid;

      case PAD_MODE.DUPLICATE_TRACK:
         return drumPadButtonGrid;

      case PAD_MODE.DUPLICATE_SCENE:
         return clipPatternGrid;
   }
}

////////////////////////////////////////////////////////////////////////////////
