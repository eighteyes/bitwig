/*
*  Single Value Track Button Grid Page
*/

drumPadButtonGrid = new PadGrid("Drum Pads");

drumPadButtonGrid.onLeft = function(isPressed)
{
   if (isPressed) drumPadGrid.scrollTracksUp();
}

drumPadButtonGrid.onRight = function(isPressed)
{
   if (isPressed) drumPadGrid.scrollTracksDown();
}

drumPadButtonGrid.onUp = function(isPressed)
{
   if (isPressed) drumPadGrid.scrollTracksUp();
}

drumPadButtonGrid.onDown = function(isPressed)
{
   if (isPressed) drumPadGrid.scrollTracksDown();
}

drumPadButtonGrid.onGridButton = function(row, column, isButtonPress)
{
   if (!isButtonPress) return;

   var pad = drumPadGrid.getDrumPad(getPadIndex(row, column));

   if (activePadMode == PAD_MODE.PAD_MUTE)
   {
      pad.getMute().toggle();
   }
   else if (activePadMode == PAD_MODE.PAD_SOLO)
   {
      pad.getSolo().toggle();
   }
   else if (activePadMode == PAD_MODE.PAD_PLAY)
   {
      pad.playNote(100);
   }
   else if (activePadMode == PAD_MODE.PAD_SELECT)
   {
      pad.select();
   }
}

drumPadButtonGrid.updateCell = function(row, column)
{
   if (activeGridPage != drumPadButtonGrid) return;

   var color = COLOR.OFF;
   var index = getPadIndex(row, column);
   var darkenFactor = COLOR.UNSELECTED_TOGGLE_BRIGHTNESS_FACTOR;

   if (!padExistsBuffer16[index])
   {
      color = COLOR.OFF;
   }
   else if (activePadMode == PAD_MODE.PAD_MUTE)
   {
      color = COLOR.MUTE;

      if (!padMuteBuffer16[index])
      {
         color = new Color(color.hue, color.saturation, color.brightness * darkenFactor);
      }
   }
   else if (activePadMode == PAD_MODE.PAD_SOLO)
   {
      color = COLOR.SOLO;

      if (!padSoloBuffer16[index])
      {
         color = new Color(color.hue, color.saturation, color.brightness * darkenFactor);
      }
   }
   else if (activePadMode == PAD_MODE.PAD_PLAY)
   {
      color = COLOR.OFF;

      if (padExistsBuffer16[index] && padColorBuffer16[index])
      {
         color = padColorBuffer16[index];
      }
   }
   else if (activePadMode == PAD_MODE.PAD_SELECT)
   {
      color = COLOR.OFF;

      if (padExistsBuffer16[index] && padColorBuffer16[index])
      {
         color = padColorBuffer16[index];
      }
   }

   setPadColor(row, column, color);
}

