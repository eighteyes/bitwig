////////////////////////////////////////////////////////////////////////////////

var VENDOR = "Native Instruments";
var MODEL = "MASCHINE MK2";
var VERSION = "1.0";
var UUID = "8707F650-45FB-11E2-BCFD-0800200C9A66";

////////////////////////////////////////////////////////////////////////////////

var IO_PORT_1 = "Maschine Controller MK2";
var IO_PORT_2_PREFIX = "Maschine MK2 Virtual";
var IN_PORT_2 = IO_PORT_2_PREFIX + " Input";
var OUT_PORT_2 = IO_PORT_2_PREFIX + " Output";
var IO_PORT_3_PREFIX = "Maschine MK2"; 
var IN_PORT_3 = IO_PORT_3_PREFIX + " In";
var OUT_PORT_3 = IO_PORT_3_PREFIX + " Out";

////////////////////////////////////////////////////////////////////////////////

var SYSEX_HEADER = "F0 00 00 66 17";
var BUILD_MAP_MESSAGE = "F0 00 42 55 49 4C 44 F7"
var WELCOME_MESSAGE = "F0 00 48 45 4C 4C 4F F7";
var GOODBYE_MESSAGE = "F0 00 42 55 49 4C 44 F7";

////////////////////////////////////////////////////////////////////////////////

var CC =
{
   // global section
   GLOBAL :
   {
      CHANNEL : 15,
      CONTROL : 60,
      STEP : 61,
      BROWSE : 62,
      SAMPLING : 63,
      SAVE : 64,
      SHIFT : 65
   },

   // master section
   MASTER :
   {
      VOLUME : 70,
      SWING : 71,
      TEMPO : 72,
      WHEEL : 73,
      INC : 74,
      DEC : 75,
      ENTER : 76,
      TAP : 79
   },

   // groups section
   GROUP :
   {
      A : 81,
      B : 82,
      C : 83,
      D : 84,
      E : 85,
      F : 86,
      G : 87,
      H : 88
   },

   SELECTION :
   {
      CHANNEL : 14,
      CURSOR_TRACK_INC : 41,
      CURSOR_TRACK_NEXT : 42,
      CURSOR_TRACK_PREV : 43,
      CURSOR_DEVICE_INC : 51,
      CURSOR_DEVICE_NEXT : 52,
      CURSOR_DEVICE_PREV : 53,
      DEVICE_PRESET_INC : 61,
      DEVICE_PRESET_NEXT : 62,
      DEVICE_PRESET_PREV : 63,
      DEVICE_PARAMETER_PAGE_INC : 71,
      DEVICE_PARAMETER_PAGE_NEXT : 72,
      DEVICE_PARAMETER_PAGE_PREV : 73,
      DEVICE_MACROS : 74,
      ENVELOPE_DEVICE_PARAMETERS : 75,
      COMMON_DEVICE_PARAMETERS : 76,
      USER_CONTROLS : 77,
      ALL_DEVICE_PARAMETERS : 78,
      DEVICE_LAYER_INC : 81,
      DEVICE_LAYER_NEXT : 82,
      DEVICE_LAYER_PREV : 83,
      CURSOR_SCENE_INC : 91,
      CURSOR_SCENE_NEXT : 92,
      CURSOR_SCENE_PREV : 93
   },

   // transport section
   TRANSPORT:
   {
      CHANNEL : 15,

      RESTART : 90,
      STEP_LEFT : 91,
      STEP_RIGHT : 92,
      GRID : 93,
      PLAY : 94,
      REC : 95,
      ERASE : 96,

      WRITE_CLIP_AUTOMATION : 1,
      WRITE_ARRANGER_AUTOMATION : 2,
      AUTOMATION_OVERRIDE : 3,
      LOOP : 4,
      PUNCH_IN : 5,
      PUNCH_OUT : 6,
      METRONOME : 7,
      METRONOME_TICKS : 8,

      POSITION : 12,
      TEMPO : 13,
      TIME_SIGNATURE : 14,
      LOOP_START : 15,
      LOOP_END : 16,
      METRONOME_VOLUME : 17,
      COUNT_INT : 18,

      AUTOMATION_MODE : 20,
      LATCH_AUTOMATION_MODE : 21,
      TOUCH_AUTOMATION_MODE : 22,
      WRITE_AUTOMATION_MODE : 23,
   },

   // pads section
   PAD_MODE : 
   {
      CHANNEL : 3,
      SCENE : 100,
      PATTERN : 101,
      KEYBOARD : 102,
      NAVIGATE : 103,
      DUPLICATE : 104,
      SELECT : 105,
      SOLO : 106,
      MUTE : 107
   },

   CURSOR_DEVICE :
   {
      CHANNEL : 0,
      PARAMETER_1 : 16,
      PARAMETER_2 : 17,
      PARAMETER_3 : 18,
      PARAMETER_4 : 19,
      PARAMETER_5 : 20,
      PARAMETER_6 : 21,
      PARAMETER_7 : 22,
      PARAMETER_8 : 23
   },

   PAD_0 : 36,
   GROUP_BUTTON_0 : 81
};

////////////////////////////////////////////////////////////////////////////////

var NUM_TRACKS = 4;
var NUM_SCENES = 4;
var NUM_SENDS = 4;

var PAGE_CONTROL_COUNT = 8;

////////////////////////////////////////////////////////////////////////////////
