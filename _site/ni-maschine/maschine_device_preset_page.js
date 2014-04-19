// device preset page

devicePresetPage = new Page("Device Preset Page");
devicePresetPage.deviceName = new BufferedDisplayElement(devicePresetPage, 1, 1, 14, 0);
devicePresetPage.presetName = new BufferedDisplayElement(devicePresetPage, 1, 1, 14, 1);
devicePresetPage.presetCategory = new BufferedDisplayElement(devicePresetPage, 1, 1, 14, 2);
devicePresetPage.presetCreator = new BufferedDisplayElement(devicePresetPage, 1, 1, 14, 3);

devicePresetPage.showNoContentMessage = function()
{
   if (activeDisplayPage == this)
   {
      clearDisplay();
      updateDisplay(0, 0, 0, "Select a Device.", DISPLAY_WIDTH);
   }
};

devicePresetPage.sendDisplays = function()
{
   if (activeDisplayPage == this)
   {
      clearDisplay();
      updateDisplay(0, 0, 0, "< Device >    < Preset >", DISPLAY_WIDTH);
      updateDisplay(1, 0, 0, "< Category >  < Creator >", DISPLAY_WIDTH);
      this.deviceName.sendAllToDevice();
      this.presetName.sendAllToDevice();
      this.presetCategory.sendAllToDevice();
      this.presetCreator.sendAllToDevice();
   }
};

devicePresetPage.onEncoder = function(index, diff, resolution)
{
   switch(index)
   {
      case 0:
      case 1:
         if (diff > 0)
         {
            cursorDevice.selectNext();
         }
         else
         {
            cursorDevice.selectPrevious();
         }
         break;

      case 2:
      case 3:
         if (diff > 0)
         {
            cursorDevice.switchToNextPreset();
         }
         else
         {
            cursorDevice.switchToPreviousPreset();
         }
         break;

      case 4:
      case 5:
         if (diff > 0)
         {
            cursorDevice.switchToPreviousPresetCategory();
         }
         else
         {
            cursorDevice.switchToNextPresetCategory();
         }
         break;

      case 6:
      case 7:
         if (diff > 0)
         {
            cursorDevice.switchToPreviousPresetCreator();
         }
         else
         {
            cursorDevice.switchToNextPresetCreator();
         }
         break;
   }
};

devicePresetPage.onButton = function(button, isPressed)
{
   switch(button)
   {
      case CC.SELECTION.CURSOR_DEVICE_PREV:
         cursorDevice.selectPrevious();
         break;

      case CC.SELECTION.CURSOR_DEVICE_NEXT:
         cursorDevice.selectNext();
         break;

      case CC.SELECTION.DEVICE_MACROS:
         cursorDevice.switchToPreviousPreset();
         break;

      case CC.SELECTION.ENVELOPE_DEVICE_PARAMETERS:
         cursorDevice.switchToNextPreset();
         break;

      case CC.SELECTION.COMMON_DEVICE_PARAMETERS:
         cursorDevice.switchToPreviousPresetCategory();
         break;

      case CC.SELECTION.USER_CONTROLS:
         cursorDevice.switchToNextPresetCategory();
         break;

      case CC.SELECTION.DEVICE_PARAMETER_PAGE_PREV:
         cursorDevice.switchToPreviousPresetCreator();
         break;

      case CC.SELECTION.DEVICE_PARAMETER_PAGE_NEXT:
         cursorDevice.switchToNextPresetCreator();
         break;
   }
};

