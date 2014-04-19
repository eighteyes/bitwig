////////////////////////////////////////////////////////////////////////////////

load("maschine_constants.js");
load("maschine_color.js");

////////////////////////////////////////////////////////////////////////////////

var PAD_MODE =
{
   SCENE_LAUNCH : 0,
   CLIP_LAUNCH : 1,
   KEYBOARD : 2,
   NOTE_SEQUENCE : 3,
   PAD_MUTE : 5,
   PAD_SOLO : 6,
   PAD_PLAY : 7,
   PAD_SELECT : 8,
   SELECT_SLOT : 9,
   SELECT_TRACK : 11,
   SELECT_SCENE : 12,
   DUPLICATE_SLOT : 13,
   DUPLICATE_TRACK : 14,
   DUPLICATE_SCENE : 15
}

var PAD_MODE_BUTTON_INDEX =
{
   SCENE : 0,
   PATTERN : 1,
   KEYBOARD : 2,
   NAVIGATE : 3,
   DUPLICATE : 4,
   SELECT : 5,
   SOLO : 6,
   MUTE : 7
}

function ccToPadModeButtonIndex(cc)
{
   switch (cc)
   {
      case CC.PAD_MODE.SCENE:
         return PAD_MODE_BUTTON_INDEX.SCENE;

      case CC.PAD_MODE.PATTERN:
         return PAD_MODE_BUTTON_INDEX.PATTERN;

      case CC.PAD_MODE.KEYBOARD:
         return PAD_MODE_BUTTON_INDEX.KEYBOARD;

      case CC.PAD_MODE.NAVIGATE:
         return PAD_MODE_BUTTON_INDEX.NAVIGATE;

      case CC.PAD_MODE.DUPLICATE:
         return PAD_MODE_BUTTON_INDEX.DUPLICATE;

      case CC.PAD_MODE.SELECT:
         return PAD_MODE_BUTTON_INDEX.SELECT;

      case CC.PAD_MODE.SOLO:
         return PAD_MODE_BUTTON_INDEX.SOLO;

      case CC.PAD_MODE.MUTE:
         return PAD_MODE_BUTTON_INDEX.MUTE;
   }

   return -1;
}

////////////////////////////////////////////////////////////////////////////////

function initPadState()
{
   activePadModeToggleStates = null;
   pendingPadModeToggleStates = initArray(0, 8);
   padModePressedStates = initArray(0, 8);

   activeGridPage = null;
   activePadMode = null;

   isPadShiftPressed = false;
   isPadAltPressed = false;

   pendingGroupButtonColors = initArray(COLOR.OFF, 8);
   activeGroupButtonColors = null;

   pendingPadColors = initArray(COLOR.OFF, 16);
   activePadColors = null;
}

////////////////////////////////////////////////////////////////////////////////

function setGroupButtonColor(index, color)
{
   pendingGroupButtonColors[index] = color;
   flushPadButtonColors();
}

function setPadColor(row, column, color)
{
   var key = getPadIndex(row, column);
   pendingPadColors[key] = color;
   flushPadButtonColors();
}

////////////////////////////////////////////////////////////////////////////////

function onUpdateBlinkState()
{
   blinkState += 0.05;

   if (blinkState >= 1e+300)
   {
      blinkState = 0;
   }

   slowBlinkState = 0.5 + 0.5 * Math.cos(4 * blinkState);
   fastBlinkState = 0.5 + 0.5 * Math.cos(16 * blinkState);

   clipPatternGrid.updateGrid();

   if (isConnected)
   {
      host.scheduleTask(onUpdateBlinkState, null, 40);
   }

   flushPadButtonColors();
}

////////////////////////////////////////////////////////////////////////////////

function flushPadButtonColors()
{
   var isInit = (activePadModeToggleStates == null);

   if (isInit)
   {
      activePadModeToggleStates = initArray(0, 8);
      activeGroupButtonColors = initArray(COLOR.OFF, 8);
      activePadColors = initArray(COLOR.OFF, 16);
   }

   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.SCENE, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.PATTERN, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.KEYBOARD, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.NAVIGATE, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.DUPLICATE, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.SELECT, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.SOLO, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO] ? 127 : 0);
   }
   if (isInit || activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE] != pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE])
   {
      activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE] = pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE];
      sendChannelController(CC.PAD_MODE.CHANNEL, CC.PAD_MODE.MUTE, activePadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE] ? 127 : 0);
   }

   var changedCount = 0;

   for(var i = 0; i < 8; i++)
   {
      if (isInit || pendingGroupButtonColors[i] != activeGroupButtonColors[i]) changedCount++;
   }
   for(var i = 0; i < 16; i++)
   {
      if (isInit || pendingPadColors[i] != activePadColors[i]) changedCount++;
   }

   if (changedCount == 0) return;

   for(var i = 0; i < 8; i++)
   {
      if (isInit || pendingGroupButtonColors[i] != activeGroupButtonColors[i])
      {
         activeGroupButtonColors[i] = pendingGroupButtonColors[i];
         var color = activeGroupButtonColors[i];
         var hue = Math.floor(color.hue * 127.0/360.0);
         var saturation = Math.floor(color.saturation * 127.0);
         var brightness = Math.floor(color.brightness * 127.0);
         updatePadColor(CC.GROUP_BUTTON_0 + i, hue, saturation, brightness);
      }
   }
   for(var i = 0; i < 16; i++)
   {
      if (isInit || pendingPadColors[i] != activePadColors[i])
      {
         activePadColors[i] = pendingPadColors[i];
         var color = activePadColors[i];
         var hue = Math.floor(color.hue * 127.0/360.0);
         var saturation = Math.floor((1 - Math.pow(1 - color.saturation, 2)) * 127.0);
         var brightness = Math.floor(color.brightness * 127.0);
         updatePadColor(CC.PAD_0 + i, hue, saturation, brightness);
      }
   }
}

////////////////////////////////////////////////////////////////////////////////

function PadGrid(name)
{
   this.name = name;
   this.canScrollLeft = false;
   this.canScrollRight = false;
   this.canScrollUp = false;
   this.canScrollDown = false;
};

PadGrid.prototype.toString = function()
{
   return this.name;
}

PadGrid.prototype.onSetActivePage = function()
{
   this.clear();
   this.onSetCurrent();
}

PadGrid.prototype.clear = function()
{
   for(var i = 0; i < 8; i++)
   {
      pendingGroupButtonColors[i] = COLOR.OFF;
   }
   for(var i = 0; i < 16; i++)
   {
      pendingPadColors[i] = COLOR.OFF;
   }

   flushPadButtonColors();
};

PadGrid.prototype.updateGrid = function()
{
   for(var row = 0; row < 4; row++)
   {
      this.updateRow(row);
   }
}

PadGrid.prototype.updateRow = function(row)
{
   if (activeGridPage != this) return;

   for(var col = 0; col < 4; col++)
   {
      this.updateCell(row, col);
   }
}

PadGrid.prototype.updateColumn = function(col)
{
   if (activeGridPage != this) return;

   for(var row = 0; row < 4; row++)
   {
      this.updateCell(row, col);
   }
}

PadGrid.prototype.updateCell = function(row, col)
{
   if (activeGridPage != this) return;

   setPadColor(row, col, COLOR.OFF);
}

PadGrid.prototype.onSetCurrent = function()
{
   setGroupButtonColor(0, COLOR.PAD_SHIFT_MODIFIER);
   setGroupButtonColor(1, COLOR.PAD_PAGE_MODIFIER);
   setGroupButtonColor(2, this.canScrollUp ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   setGroupButtonColor(3, COLOR.PAD_HOME_MODIFIER);
   setGroupButtonColor(4, COLOR.PAD_ALT_MODIFIER);
   setGroupButtonColor(5, this.canScrollLeft ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   setGroupButtonColor(6, this.canScrollDown ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   setGroupButtonColor(7, this.canScrollRight ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
};

PadGrid.prototype.setCanScrollLeft = function(canScroll)
{
   if (this == activeGridPage) setGroupButtonColor(5, canScroll ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   this.canScrollLeft = canScroll;
};

PadGrid.prototype.setCanScrollRight = function(canScroll)
{
   if (this == activeGridPage) setGroupButtonColor(7, canScroll ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   this.canScrollRight = canScroll;
};

PadGrid.prototype.setCanScrollUp = function(canScroll)
{
   if (this == activeGridPage) setGroupButtonColor(2, canScroll ? Color.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   this.canScrollUp = canScroll;
};

PadGrid.prototype.setCanScrollDown = function(canScroll)
{
   if (this == activeGridPage) setGroupButtonColor(6, canScroll ? COLOR.PAD_ARROW_KEY_ENABLED : COLOR.PAD_ARROW_KEY_DISABLED);
   this.canScrollDown = canScroll;
};

////////////////////////////////////////////////////////////////////////////////

function getGridPadObserverFunc(index, varToStore, gridPages)
{
   return function(value)
   {
      varToStore[index] = value;
      gridPages.map(function(page) { page.updateGrid(); });
   }
};

function getGridPadColorObserverFunc(index, varToStore, gridPages)
{
   return function(hue, saturation, brightness)
   {
      varToStore[index] = new Color(hue, saturation, brightness);
      gridPages.map(function(page) { page.updateGrid(); });
   }
};

function getGridCellObserverFunc(row, varToStore, gridPages)
{
   return function(col, value)
   {
      varToStore[getPadIndex(row, col)] = value;
      gridPages.map(function(page) { page.updateCell(row, col); });
   }
};

function getGridCellColorObserverFunc(row, varToStore, gridPages)
{
   return function(col, hue, saturation, brightness)
   {
      varToStore[getPadIndex(row, col)] = new Color(hue, saturation, brightness);
      gridPages.map(function(page) { page.updateCell(row, col); });
   }
};

////////////////////////////////////////////////////////////////////////////////

function getPadIndex(row, column)
{
   return row * 4 + column;
}

function getPadMode(cc, isButtonPress, isShiftPressed, isAltPressed)
{
   if (isButtonPress && cc == CC.PAD_MODE.SCENE)
   {
      return PAD_MODE.SCENE_LAUNCH;
   }
   else if (cc == CC.PAD_MODE.SCENE)
   {
      return PAD_MODE.CLIP_LAUNCH;
   }
   else if (cc == CC.PAD_MODE.PATTERN)
   {
      return PAD_MODE.CLIP_LAUNCH;
   }
   else if (cc == CC.PAD_MODE.KEYBOARD)
   {
      if (isButtonPress)
      {
         return PAD_MODE.PAD_SELECT;
      }
      else if (isStepMode)
      {
         return PAD_MODE.NOTE_SEQUENCE;
      }
      else
      {
         return PAD_MODE.PAD_SELECT;
      }
   }
   else if (cc == CC.PAD_MODE.NAVIGATE)
   {
      if (isShiftPressed || isAltPressed)
      {
         return PAD_MODE.PAD_SELECT;
      }
      else
      {
         return PAD_MODE.NOTE_SEQUENCE;
      }
   }
   else if (cc == CC.PAD_MODE.DUPLICATE)
   {
      return PAD_MODE.PAD_SELECT;
   }
   else if (cc == CC.PAD_MODE.SELECT)
   {
      return PAD_MODE.PAD_SELECT;
   }
   else if (cc == CC.PAD_MODE.MUTE)
   {
      return PAD_MODE.PAD_MUTE;
   }
   else if (cc == CC.PAD_MODE.SOLO)
   {
      return PAD_MODE.PAD_SOLO;
   }

   return null;
}

function getPadModeCC(padMode)
{
   switch(padMode)
   {
      case PAD_MODE.SCENE_LAUNCH:
         return CC.PAD_MODE.SCENE;

      case PAD_MODE.CLIP_LAUNCH:
         return CC.PAD_MODE.PATTERN;

      case PAD_MODE.KEYBOARD:
         return CC.PAD_MODE.KEYBOARD;

      case PAD_MODE.NOTE_SEQUENCE:
         return CC.PAD_MODE.NAVIGATE;

      case PAD_MODE.PAD_MUTE:
         return CC.PAD_MODE.MUTE;

      case PAD_MODE.PAD_SOLO:
         return CC.PAD_MODE.SOLO;

      case PAD_MODE.PAD_PLAY:
         return CC.PAD_MODE.KEYBOARD;

      case PAD_MODE.PAD_SELECT:
         return CC.PAD_MODE.SELECT;

      case PAD_MODE.SELECT_SLOT:
         return CC.PAD_MODE.SELECT;

      case PAD_MODE.SELECT_TRACK:
         return CC.PAD_MODE.SELECT;

      case PAD_MODE.SELECT_SCENE:
         return CC.PAD_MODE.SELECT;

      case PAD_MODE.DUPLICATE_SLOT:
         return CC.PAD_MODE.DUPLICATE;

      case PAD_MODE.DUPLICATE_TRACK:
         return CC.PAD_MODE.DUPLICATE;

      case PAD_MODE.DUPLICATE_SCENE:
         return CC.PAD_MODE.DUPLICATE;
   }
}

function updatePadModeButtonStates(padMode)
{
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO] = false;
   pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE] = false;

   switch(padMode)
   {
      case PAD_MODE.SCENE_LAUNCH:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE] = true;
         break;

      case PAD_MODE.CLIP_LAUNCH:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN] = true;
         break;

      case PAD_MODE.KEYBOARD:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] = true;
         break;

      case PAD_MODE.NOTE_SEQUENCE:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE] = true;
         break;

      case PAD_MODE.PAD_MUTE:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE] = true;
         break;

      case PAD_MODE.PAD_SOLO:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO] = true;
         break;

      case PAD_MODE.PAD_PLAY:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD] = true;
         break;

      case PAD_MODE.PAD_SELECT:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = true;
         break;

      case PAD_MODE.SELECT_SLOT:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = true;
         break;

      case PAD_MODE.SELECT_TRACK:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = true;
         break;

      case PAD_MODE.SELECT_SCENE:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT] = true;
         break;

      case PAD_MODE.DUPLICATE_SLOT:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] = true;
         break;

      case PAD_MODE.DUPLICATE_TRACK:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] = true;
         break;

      case PAD_MODE.DUPLICATE_SCENE:
         pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE] = true;
         break;
   }
}

function printPadModeButtonStates()
{
   println("Pad Mode Button States ... scene: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SCENE]
      + ", pattern: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.PATTERN]
      + ", padMode: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.KEYBOARD]
      + ", navigate: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.NAVIGATE]
      + ", duplicate: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.DUPLICATE]
      + ", select: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SELECT]
      + ", solo: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.SOLO]
      + ", mute: " + pendingPadModeToggleStates[PAD_MODE_BUTTON_INDEX.MUTE]);
}
////////////////////////////////////////////////////////////////////////////////
