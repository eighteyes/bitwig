////////////////////////////////////////////////////////////////////////////////

load("maschine_constants.js");

////////////////////////////////////////////////////////////////////////////////

var NUM_DISPLAYS = 2;
var DISPLAY_WIDTH = 28;
var NUM_COLUMNS = 8;
var NUM_ROWS = 2;
var COLUMN_WIDTH = 7;
var COLUMN_GAP = 1;
var TOTAL_DISPLAY_SIZE = DISPLAY_WIDTH * NUM_DISPLAYS * NUM_ROWS;

////////////////////////////////////////////////////////////////////////////////

function initDisplayState()
{
   activeDisplayPage = null;

   pendingDisplayText = initArray(32, TOTAL_DISPLAY_SIZE);
   activeDisplayText = initArray(0, TOTAL_DISPLAY_SIZE);

   activeDisplayToggleStates = null;
   pendingDisplayToggleStates = initArray(0, 8);
   padModeDisplayPressedStates = initArray(0, 8);
}

////////////////////////////////////////////////////////////////////////////////

function printTextBuffers()
{
   println("active = " + activeDisplayText.toString());
   println("pending = " + pendingDisplayText.toString());
};

function calculateTextBufferOffset(display, row, pos)
{
   var offset;

   if (row == 1)
   {
      offset = (row + display + 1) * DISPLAY_WIDTH;
   }
   else
   {
      offset = display * DISPLAY_WIDTH;
   }

   return offset + pos;
};

function dataAsHex(display, row, pos, length)
{
   var result = "";
   var offset = calculateTextBufferOffset(display, row, pos);

   for(i=0; i<length; i++)
   {
      result += uint7ToHex(pendingDisplayText[offset + i]);
   }

   return result;
};

function clearDisplay()
{
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_MACROS, 0);
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS, 0);
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.COMMON_DEVICE_PARAMETERS, 0);
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.USER_CONTROLS, 0);
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_PARAMETER_PAGE_NEXT, 0);
   sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_PARAMETER_PAGE_PREV, 0);

   for(var i = 0; i < TOTAL_DISPLAY_SIZE; i++)
   {
      pendingDisplayText[i] = 32;
   }
};

function updateDisplayColumn(row, column, text, numColumns, columnWidth)
{
   var display = 0;
   var forcedText = text.forceLength(columnWidth - 1);
   var rowOffset = row * (DISPLAY_WIDTH * 2);
   var columnOffset = column * columnWidth;

   for (var i = 0; i < columnWidth - 1; i++)
   {
      pendingDisplayText[rowOffset + columnOffset + i] = forcedText.charCodeAt(i);
   }
};

function updateDisplayCentered(display, row, text)
{
   var len = text.length;
   var pos = Math.round((DISPLAY_WIDTH - len) / 2);
   var offset = calculateTextBufferOffset(display, row, pos);

   for(var i=0; i<len; i++)
   {
      pendingDisplayText[offset + i] = text.charCodeAt(i);
   }
};

function updateDisplay(display, row, pos, text, length)
{
   var forcedText = text.forceLength(length);
   var offset = calculateTextBufferOffset(display, row, pos);

   for(var i=0; i<length; i++)
   {
      pendingDisplayText[offset + i] = forcedText.charCodeAt(i);
   }
};

function flushDisplay()
{
   flushRow(0, 0);
   flushRow(0, 1);
   flushRow(1, 0);
   flushRow(1, 1);
};

function flushDisplayButtons()
{
}

function flushRow(display, row)
{
//   for(var i = 0; i < 112; i++)
//   {
//      sendSysex(SYSEX_HEADER + " 12 " + uint7ToHex(i) + uint7ToHex(i%28+50) + " F7");
//   }

   var first = DISPLAY_WIDTH;
   var last = -1;
   var offset = calculateTextBufferOffset(display, row, 0);

   for(var i = 0; i < DISPLAY_WIDTH; i++)
   {
      if (pendingDisplayText[offset + i] != activeDisplayText[offset + i])
      {
         first = Math.min(first, i);
         last = Math.max(last, i);
      }
   }

   if (last >= first)
   {
      var len = last - first + 1;
      sendSysex(SYSEX_HEADER + " 12 " + uint7ToHex(offset + first) + dataAsHex(display, row, first, len) + " F7");
   }

   for(var i = 0; i < DISPLAY_WIDTH; i++)
   {
      activeDisplayText[offset + i] = pendingDisplayText[offset + i];
   }
};

////////////////////////////////////////////////////////////////////////////////

/*
 * Page Class
 */
function Page(name, channel)
{
   this.name = name;
   this.channel = channel;
   this.hasContent = true;
   this.encoderValues = initArray(0.0, PAGE_CONTROL_COUNT);
};

Page.prototype.sendVpotToDevice = function (index)
{
//   println("index: " + index);
//
//   if (!this.hasContent)
//   {
//      sendChannelController(0, CC.CURSOR_DEVICE.PARAMETER_1 + index, 0);
//   }
//   else
//   {
//      sendChannelController(0, CC.CURSOR_DEVICE.PARAMETER_1 + index, this.encoderValues[index]);
//   }
};

Page.prototype.onParameterValue = function(index, value)
{
   var mode = 0;
   var indicator = 0;
   var t = (Math.round(value) + 1) | (mode << 4) | (indicator << 6);
   this.encoderValues[+index] = t;
   this.sendVpotToDevice(+index);
};

Page.prototype.sendDataToDevice = function()
{
   for(var i = 0; i < 8; i++)
   {
      this.sendVpotToDevice(i);
   }

   clearDisplay();

   if (!this.hasContent)
   {
      this.showNoContentMessage();
   }
   else
   {
      this.sendDisplays();
   }
};

Page.prototype.hasContentSetter = function()
{
   var obj = this;

   return function(hasContent)
   {
      if (obj.hasContent != hasContent)
      {
         obj.hasContent = hasContent;

         obj.sendDataToDevice();
      }
   };
};

////////////////////////////////////////////////////////////////////////////////

/* Class representing a display element on a specific page, which allows it to be buffered or sent to the display
 directly, depending on the active page. */

function BufferedDisplayElement(page, row, numColumns, columnWidth, columnOffset)
{
   this.page = page;
   this.row = row;
   this.numColumns = numColumns;
   this.columnWidth = columnWidth;
   this.columnOffset = columnOffset;
   this.values = [];

   for (var i = 0; i < this.numColumns; i++)
   {
      this.values[i] = "P";
   }
};

BufferedDisplayElement.prototype.sendToDevice = function(index)
{
   updateDisplayColumn(this.row, this.columnOffset + index, this.values[+index].toString(), this.numColumns, this.columnWidth);
};

BufferedDisplayElement.prototype.sendAllToDevice = function()
{
   for (var i = 0; i < this.numColumns; i++)
   {
      this.sendToDevice(i);
   }
};

BufferedDisplayElement.prototype.setter = function(index)
{
   var obj = this;
   return function(data)
   {
      obj.set(+index, data);
   }
};

BufferedDisplayElement.prototype.set = function(index, data)
{
   this.values[+index] = data;

   if (this.page === activeDisplayPage)
   {
      this.sendToDevice(+index);
   }
};

////////////////////////////////////////////////////////////////////////////////
