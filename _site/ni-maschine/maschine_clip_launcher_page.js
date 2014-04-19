/*
*  CLIP PATTERN PAGE
*/

clipPatternGrid = new PadGrid("Clip Pattern");

clipPatternGrid.onLeft = function(isPressed)
{
   if (isPressed) trackBank4.scrollScenesUp();
}

clipPatternGrid.onRight = function(isPressed)
{
   if (isPressed) trackBank4.scrollScenesDown();
}

clipPatternGrid.onUp = function(isPressed)
{
   if (isPressed) trackBank4.scrollTracksUp();
}

clipPatternGrid.onDown = function(isPressed)
{
   if (isPressed) trackBank4.scrollTracksDown();
}

clipPatternGrid.onGridButton = function(row, column, isButtonPress)
{
   if (!isButtonPress) return;

   var i = getPadIndex(column, row);
   var track = trackBank4.getTrack(row);

   if (activePadMode == PAD_MODE.SELECT_SLOT)
   {
      if (isPadShiftPressed)
      {
         track.getClipLauncher().select(column);
      }
      else
      {
         track.getClipLauncher().showInEditor(column);
      }
   }
   else if (activePadMode == PAD_MODE.DUPLICATE_SLOT)
   {
      // TODO
   }
   else if (activePadMode == PAD_MODE.CLIP_LAUNCH)
   {
      if (isPadAltPressed)
      {
         track.getClipLauncher().record(column);
      }
      else if (isPadShiftPressed)
      {
         track.getClipLauncher().showInEditor(column);
      }
      else if (slotHasClipBuffer16[i] || trackArmBuffer16[row])
      {
         track.getClipLauncher().launch(column);
      }
      else
      {
         track.getClipLauncher().stop();
      }
   }
}

clipPatternGrid.updateCell = function(scene, track)
{
   if (activeGridPage != clipPatternGrid) return;

   var i = getPadIndex(scene, track);
   var darkenFactor = COLOR.UNSELECTED_TOGGLE_BRIGHTNESS_FACTOR;

   var clipColor = clipColorBuffer16[i];
   var color;

   if (slotHasClipBuffer16[i])
   {
      color = clipColorBuffer16[i];

      if (activePadMode == PAD_MODE.SELECT_SLOT)
      {
         if (isSlotSelectedBuffer16[i])
         {
            color = clipColor;
         }
         else
         {
            color = new Color(clipColor.hue, clipColor.saturation, clipColor.brightness * darkenFactor);
         }
      }
      else if (activePadMode == PAD_MODE.CLIP_LAUNCH)
      {
         color = trackArmBuffer16[track] ? COLOR.ARM : COLOR.OFF;

         if (isQueuedBuffer16[i])
         {
            color = new Color(clipColor.hue, clipColor.saturation, 0.2 + clipColor.brightness * fastBlinkState * 0.8);
         }
         else if (isRecordingBuffer16[i])
         {
            color = new Color(0, 1.0 - slowBlinkState * 0.4, 1);
         }
         else if (isPlayingBuffer16[i])
         {
            color = clipColor;
         }
         else
         {
            color = new Color(clipColor.hue, clipColor.saturation, clipColor.brightness * darkenFactor);
         }
      }
   }
   else if (isQueuedBuffer16[i])
   {
      color = new Color(0, 0, 0.2 * fastBlinkState);
   }
   else
   {
      color = COLOR.EMPTY_SLOT;
   }

   setPadColor(scene, track, color);
}

