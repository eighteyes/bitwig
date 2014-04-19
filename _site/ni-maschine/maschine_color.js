////////////////////////////////////////////////////////////////////////////////

load("maschine_constants.js");

////////////////////////////////////////////////////////////////////////////////

var COLOR =
{
   OFF : new Color(180.0, 0.0, 0.0),
   PAD_ARROW_KEY_DISABLED : new Color(220.0, 1.0, 0.1),
   PAD_ARROW_KEY_ENABLED : new Color(220.0, 1.0, 0.5),
   PAD_PAGE_MODIFIER : new Color(220.0, 0.5, 0.8),
   PAD_HOME_MODIFIER : new Color(220.0, 0.5, 0.8),
   PAD_SHIFT_MODIFIER : new Color(65.0, 1.0, 0.4),
   PAD_ALT_MODIFIER : new Color(70.0, 1.0, 0.4),
   RECORD : new Color(0.0, 1.0, 1.0),
   ARM : new Color(0.0, 1.0, 1.0),
   MUTE : new Color(50.0, 1.0, 1.0),
   SOLO : new Color(200.0, 1.0, 1.0),
   PLAY : new Color(100.0, 1.0, 1.0),
   PRESSED_NOTE_KEY : new Color(25.0, 1.0, 1.0),
   SCENE_WITH_CONTENT : new Color(30.0, 1.0, 1.0),
   SCENE_WITHOUT_CONTENT : new Color(30.0, 1.0, 0.5),
   LAUNCHED_SCENE_WITH_CONTENT : new Color(200.0, 1.0, 1.0),
   LAUNCHED_SCENE_WITHOUT_CONTENT : new Color(200.0, 1.0, 0.5),
   EMPTY_SLOT : new Color(0.0, 0.0, 0.0),
   EVEN_DRUM_PAD : new Color(260.0, 1.0, 0.1),
   ODD_DRUM_PAD : new Color(340.0, 1.0, 0.1),
   EVEN_CURSOR_DRUM_PAD : new Color(260.0, 1.0, 1.0),
   ODD_CURSOR_DRUM_PAD : new Color(340.0, 1.0, 1.0),
   DRUM_PAD_NOTE_ON : new Color(80.0, 0.1, 1.0),
   ACTIVE_NOTE_STEP : new Color(60.0, 1.0, 1.0),
   INACTIVE_NOTE_STEP : new Color(60.0, 1.0, 0.01),
   PLAYED_ACTIVE_NOTE_STEP : new Color(150.0, 1.0, 1.0),
   PLAYED_INACTIVE_NOTE_STEP : new Color(150.0, 1.0, 0.1),
   UNSELECTED_TOGGLE_BRIGHTNESS_FACTOR : 0.1
};

////////////////////////////////////////////////////////////////////////////////

function Color(hue, saturation, brightness)
{
   this.hue = hue;
   this.saturation = saturation;
   this.brightness = brightness;
};

////////////////////////////////////////////////////////////////////////////////

function mixColor(color, blink)
{
   return new Color(color.hue, color.saturation, color.brightness * blink);
};

////////////////////////////////////////////////////////////////////////////////

function updatePadColor(cc, hue, saturation, brightness)
{
   sendChannelController(0, cc, hue);
   sendChannelController(1, cc, saturation);
   sendChannelController(2, cc, brightness);
};

////////////////////////////////////////////////////////////////////////////////
