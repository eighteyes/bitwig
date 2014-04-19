/*
*  NotePattern Grid Page
*/

notePatternGrid = new PadGrid("Note Pattern");

notePatternGrid.key = 36;
notePatternGrid.keyScroll = 36;
notePatternGrid.velocity = 100;
notePatternGrid.velocityStep = 5;
notePatternGrid.stepSet = initArray(false, 32);
notePatternGrid.playingStep = -1;
notePatternGrid.noteOn = initArray(false, 128);

notePatternGrid.setVelocity = function(step)
{
   this.velocityStep = step;

   switch(step)
   {
      case 7:
         this.velocity = 10;
         break;
      case 6:
         this.velocity = 28;
         break;
      case 5:
         this.velocity = 46;
         break;
      case 4:
         this.velocity = 64;
         break;
      case 3:
         this.velocity = 82;
         break;
      case 2:
         this.velocity = 100;
         break;
      case 1:
         this.velocity = 114;
         break;
      case 0:
         this.velocity = 127;
         break;
   }

   cursorTrack.playNote(this.key, this.velocity);
   this.updateGrid();
}

notePatternGrid.onLeft = function(isPressed)
{
}

notePatternGrid.onRight = function(isPressed)
{
}

notePatternGrid.onUp = function(isPressed)
{
   if (activeGridPage != notePatternGrid) return;

   if (isPressed)
   {
      this.keyScroll = Math.min(this.keyScroll + 16, 116);
      this.setCanScrollUp(this.keyScroll < 115);
      this.updateGrid();
   }
}

notePatternGrid.onDown = function(isPressed)
{
   if (activeGridPage != notePatternGrid) return;

   if (isPressed)
   {
      this.keyScroll = Math.max(this.keyScroll - 16, 4);
      this.setCanScrollDown(this.keyScroll > 5);
      this.updateGrid();
   }
}

notePatternGrid.updateCell = function(row, column)
{
   if (activeGridPage != notePatternGrid) return;

   var color = COLOR.OFF;

   if (activePadMode == PAD_MODE.NOTE_SEQUENCE)
   {
      var index = getPadIndex(row, column);

      var isSet = this.stepSet[index];
      var isPlaying = index == this.playingStep;

      color = isSet ?
         (isPlaying ? COLOR.PLAYED_ACTIVE_NOTE_STEP : COLOR.ACTIVE_NOTE_STEP) :
         (isPlaying ? COLOR.PLAYED_INACTIVE_NOTE_STEP : COLOR.INACTIVE_NOTE_STEP);
   }
   else if (activePadMode == PAD_MODE.PAD_SELECT)
   {
      var key = this.gridToKey(row, column);
      var even = ((row + column) & 1) == 0;

      color = (key == this.key) ?
         (even ? COLOR.EVEN_CURSOR_DRUM_PAD : COLOR.ODD_CURSOR_DRUM_PAD) :
         (even ? COLOR.EVEN_DRUM_PAD : COLOR.ODD_DRUM_PAD);

//      if (this.noteOn[key])
//      {
//         color = COLOR.DRUM_PAD_NOTE_ON;
//      }
   }

   setPadColor(row, column, color);
}

notePatternGrid.onGridButton = function(row, column, isButtonPress)
{
   if (!isButtonPress) return;

   if (activePadMode == PAD_MODE.NOTE_SEQUENCE)
   {
      cursorClip.toggleStep(getPadIndex(row, column), 0, this.velocity);
   }
   else if (activePadMode == PAD_MODE.PAD_SELECT)
   {
      var key = this.gridToKey(row, column);
      this.setKey(key);
      cursorTrack.playNote(key, this.velocity);
   }
}

notePatternGrid.gridToKey = function(x, y)
{
   return getPadIndex(x, y) + this.keyScroll;
}

notePatternGrid.setKey = function(key)
{
   notePatternGrid.key = key;
   cursorClip.scrollToKey(key);
   notePatternGrid.updateGrid();
}

notePatternGrid.onStepExists = function(column, row, state)
{
   notePatternGrid.stepSet[column] = state;
   notePatternGrid.updateCell(row, column);
}

notePatternGrid.onStepPlay = function(step)
{
   notePatternGrid.playingStep = step;
   notePatternGrid.updateGrid();
}

notePatternGrid.onNotePlay = function(isOn, key, velocity)
{
   notePatternGrid.noteOn[key] = isOn;
   notePatternGrid.updateGrid();
}

