/*
*  Play Grid Page
*/

keyboardGrid = new PadGrid("Play");

keyboardGrid.onLeft = function(isPressed)
{
}

keyboardGrid.onRight = function(isPressed)
{
}

keyboardGrid.onUp = function(isPressed)
{
}

keyboardGrid.onDown = function(isPressed)
{
}

keyboardGrid.onGridButton = function(row, column, isButtonPress)
{
}

keyboardGrid.updateCell = function(row, column)
{
   if (activeGridPage != keyboardGrid) return;

   var index = getPadIndex(row, column);
   var velocity = notePressedBuffer16[index];
   var color;

   if (velocity >= 0)
   {
      color = new Color(COLOR.PRESSED_NOTE_KEY.hue, COLOR.PRESSED_NOTE_KEY.saturation, velocity);
   }
   else
   {
      color = COLOR.OFF;
   }

   setPadColor(row, column, color);
}

