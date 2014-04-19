////////////////////////////////////////////////////////////////////////////////

function initState()
{
   isConnected = false;

   blinkState = 0;
   fastBlinkState = 0;
   slowBlinkState = 0;

   trackColorBuffer16 = initArray(COLOR.OFF, 16);
   trackExistsBuffer16 = initArray(false, 16);
   trackVolumeBuffer8 = initArray(0, 8);
   trackPanBuffer8 = initArray(0, 8);
   trackSendBuffer8 = new Array(2);
   trackSendBuffer8[0] = initArray(0, 8);
   trackSendBuffer8[1] = initArray(0, 8);
   trackMuteBuffer16 = initArray(false, 16);
   trackSoloBuffer16 = initArray(false, 16);
   trackArmBuffer16 = initArray(false, 16);
   isSlotQueuedForStopBuffer16 = initArray(false, 16);
   isSlotStoppedBuffer16 = initArray(true, 16);
   trackMeterBuffer16 = initArray(0, 16);

   padColorBuffer16 = initArray(COLOR.OFF, 16);
   padExistsBuffer16 = initArray(false, 16);
   padMuteBuffer16 = initArray(false, 16);
   padSoloBuffer16 = initArray(false, 16);
   padMeterBuffer16 = initArray(0, 16);

   sceneExistsBuffer16 = initArray(false, 16);
   sceneHasContentBuffer16 = initArray(false, 16);
   sceneCueBuffer16 = initArray(false, 16);
   sceneLaunchHistoryBuffer16 = initArray(false, 16);

   notePressedBuffer16 = initArray(-1.0, 16);

   isSlotSelectedBuffer16 = initArray(false, 16);
   slotHasClipBuffer16 = initArray(false, 16);
   isPlayingBuffer16 = initArray(false, 16);
   isRecordingBuffer16 = initArray(false, 16);
   isQueuedBuffer16 = initArray(false, 16);
   clipColorBuffer16 = initArray(COLOR.OFF, 16);

   backupGridMode = null;
   shiftBackupGridMode = null;
   altBackupGridMode = null;

   isEditPressed = false;
   isRecordPressed = false;

   isStepMode = false;

   parameterMode = CC.SELECTION.DEVICE_MACROS;
   isBrowsing = false;

   initDisplayState();
   initPadState();
}

////////////////////////////////////////////////////////////////////////////////
