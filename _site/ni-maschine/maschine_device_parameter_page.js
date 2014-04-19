// device parameter page

deviceParameterPage = new Page("Device Parameter Page");
deviceParameterColumnWidth = 7;
deviceParameterPage.userControlName = new BufferedDisplayElement(deviceParameterPage, 0, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.userControlValue = new BufferedDisplayElement(deviceParameterPage, 1, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.macroName = new BufferedDisplayElement(deviceParameterPage, 0, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.macroValue = new BufferedDisplayElement(deviceParameterPage, 1, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.pageParameterName = new BufferedDisplayElement(deviceParameterPage, 0, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.pageParameterValue = new BufferedDisplayElement(deviceParameterPage, 1, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.commonParameterName = new BufferedDisplayElement(deviceParameterPage, 0, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.commonParameterValue = new BufferedDisplayElement(deviceParameterPage, 1, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.envelopeParameterName = new BufferedDisplayElement(deviceParameterPage, 0, 8, deviceParameterColumnWidth, 0);
deviceParameterPage.envelopeParameterValue = new BufferedDisplayElement(deviceParameterPage, 1, 8, deviceParameterColumnWidth, 0);

deviceParameterPage.showNoContentMessage = function()
{
   if (activeDisplayPage == this)
   {
      clearDisplay();
      updateDisplayCentered(1, 0, "Edit macros, envelopes, common");
      updateDisplayCentered(1, 1, "parameters or navigate by page.");
      updateDisplay(0, 0, 0, "Select a Device.", DISPLAY_WIDTH);
   }
};

deviceParameterPage.sendDisplays = function()
{
   if (activeDisplayPage == this)
   {
      var isMacro = parameterMode == CC.SELECTION.DEVICE_MACROS;
      var isEnvelope = parameterMode == CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS;
      var isCommon = parameterMode == CC.SELECTION.COMMON_DEVICE_PARAMETERS;
      var isUser = parameterMode == CC.SELECTION.USER_CONTROLS;
      var isAll = parameterMode == CC.SELECTION.ALL_DEVICE_PARAMETERS;
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_MACROS, isMacro ? 127 : 0);
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS, isEnvelope ? 127 : 0);
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.COMMON_DEVICE_PARAMETERS, isCommon ? 127 : 0);
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.USER_CONTROLS, isUser ? 127 : 0);
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_PARAMETER_PAGE_NEXT, isAll ? 127 : 0);
      sendChannelController(CC.SELECTION.CHANNEL, CC.SELECTION.DEVICE_PARAMETER_PAGE_PREV, isAll ? 127 : 0);

      if (isMacro)
      {
         this.macroName.sendAllToDevice();
         this.macroValue.sendAllToDevice();
      }
      else if (isEnvelope)
      {
         this.envelopeParameterName.sendAllToDevice();
         this.envelopeParameterValue.sendAllToDevice();
      }
      else if (isCommon)
      {
         this.commonParameterName.sendAllToDevice();
         this.commonParameterValue.sendAllToDevice();
      }
      else if (isAll)
      {
         this.pageParameterName.sendAllToDevice();
         this.pageParameterValue.sendAllToDevice();
      }
      else
      {
         this.userControlName.sendAllToDevice();
         this.userControlValue.sendAllToDevice();
      }
   }
};

deviceParameterPage.onEncoder = function(index, diff, resolution)
{
   if (parameterMode == CC.SELECTION.DEVICE_MACROS)
   {
      cursorDevice.getMacro(+index).getAmount().inc(+diff, +resolution);
   }
   else if (parameterMode == CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS)
   {
      cursorDevice.getEnvelopeParameter(+index).inc(+diff, +resolution);
   }
   else if (parameterMode == CC.SELECTION.COMMON_DEVICE_PARAMETERS)
   {
      cursorDevice.getCommonParameter(+index).inc(+diff, +resolution);
   }
   else // if (parameterMode == CC.SELECTION.ALL_DEVICE_PARAMETERS)
   {
      cursorDevice.getParameter(+index).inc(+diff, +resolution);
   }
};

deviceParameterPage.onButton = function(button, isPressed)
{
   switch (button)
   {
      case CC.SELECTION.CURSOR_DEVICE_NEXT:
         cursorDevice.selectNext();
         break;

      case CC.SELECTION.CURSOR_DEVICE_PREV:
         cursorDevice.selectPrevious();
         break;

      case CC.SELECTION.DEVICE_PARAMETER_PAGE_NEXT:
         this.onUpdateParameterMode(CC.SELECTION.ALL_DEVICE_PARAMETERS);
         cursorDevice.nextParameterPage();
         break;

      case CC.SELECTION.DEVICE_PARAMETER_PAGE_PREV:
         this.onUpdateParameterMode(CC.SELECTION.ALL_DEVICE_PARAMETERS);
         cursorDevice.previousParameterPage();
         break;

      case CC.SELECTION.DEVICE_MACROS:
      case CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS:
      case CC.SELECTION.COMMON_DEVICE_PARAMETERS:
      case CC.SELECTION.ALL_DEVICE_PARAMETERS:
      case CC.SELECTION.USER_CONTROLS:
         this.onUpdateParameterMode(button);
         break;
   }
};

deviceParameterPage.updateIndications = function()
{
   if (activeDisplayPage == this)
   {
      for(var i=0; i<8; i++)
      {
         cursorDevice.getMacro(i).getAmount().setIndication(parameterMode == CC.SELECTION.DEVICE_MACROS);
         cursorDevice.getEnvelopeParameter(i).setIndication(parameterMode == CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS);
         cursorDevice.getCommonParameter(i).setIndication(parameterMode == CC.SELECTION.COMMON_DEVICE_PARAMETERS);
         cursorDevice.getParameter(i).setIndication(parameterMode == CC.SELECTION.ALL_DEVICE_PARAMETERS);
      }
   }
   else
   {
      for(var i=0; i<8; i++)
      {
         cursorDevice.getMacro(i).getAmount().setIndication(false);
         cursorDevice.getEnvelopeParameter(i).setIndication(false);
         cursorDevice.getCommonParameter(i).setIndication(false);
         cursorDevice.getParameter(i).setIndication(false);
      }
   }
};

deviceParameterPage.onUpdateParameterMode = function(value)
{
   parameterMode = value;

   this.updateIndications();

   if (activeDisplayPage == this)
   {
      this.sendDisplays();
   }
};
