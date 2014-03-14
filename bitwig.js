API DUMPS
Host = createMixerSection,hashCode,createTrackBankSection,createUserControls,wait,processScheduledTasks,connectToRemoteHost,println,createRemoteConnection,createTransportSection,hostVersion,createUserControlsSection,defineMidiPorts,createArrangerSection,notifyAll,getHostVendor,createApplication,createMainTrackBankSection,getHostVersion,scheduleTask,equals,class,createCursorClipSection,createCursorDevice,createCursorTrackSection,createGroove,toString,getHostProduct,connectToDocument,defineSysexIdentityReply,showPopupNotification,platformIsMac,createEffectTrackBank,createApplicationSection,createTrackBank,errorln,createMasterTrackSection,getMidiInPort,createCursorDeviceSection,hostApiVersion,createCursorTrack,createEffectTrackBankSection,createArranger,createTransport,defineSysexDiscovery,notify,midiOutPort,platformIsLinux,disconnectFromDocument,hostProduct,createMainTrackBank,getClass,createMasterTrack,createCursorClip,addDeviceNameBasedDiscoveryPair,hostVendor,dispose,createGrooveSection,defineController,midiInPort,getHostApiVersion,getMidiOutPort,createMixer,platformIsWindows
User Control = getObservers,getKey,getChildren,hashCode,children,observers,wait,getDocument,setKey,document,notify,instance,key,disconnectFromDocument,notifyAll,getClass,control,controlSurfaceState,equals,class,getInstance,getControlSurfaceState,getControl,addChild,toString,connectToDocument
Application = getObservers,toggleFullScreen,zoomToSelection,screenIndex,getKey,undo,rename,getChildren,observers,hashCode,getDocumentWidget,wait,toggleMixer,toggleBrowserVisibility,getDocument,getViewMode,setKey,perspective,instance,key,automationEditorPanelLayout,zoomOut,copy,notifyAll,focusPanelAbove,controlSurfaceState,getPanelLayout,duplicate,equals,focusPanelToLeft,selectNone,class,toggleDevices,enter,toggleAutomationEditor,getInstance,documentWidget,arrowKeyLeft,previousPerspective,activateEngine,getControlSurfaceState,addHasActiveEngineObserver,deactivateEngine,zoomToFit,paste,redo,addChild,toString,connectToDocument,getPanelLayoutSettings,addSelectedModeObserver,arrowKeyRight,focusPanelBelow,children,getAutomationEditorPanelLayout,toggleNoteEditor,documentWrapper,escape,panelLayout,document,focusPanelToRight,notify,setPerspective,getDocumentWrapper,delete,getNoteEditorPanelLayout,getMixerPanelLayout,disconnectFromDocument,getScreenIndex,arrowKeyDown,getClass,noteEditorPanelLayout,mixerPanelLayout,nextPerspective,selectAll,zoomIn,panelLayoutSettings,viewMode,cut,arrowKeyUp
Transport = getObservers,getKey,addMetronomeVolumeObserver,tempo,getChildren,toggleOverdub,addPunchInObserver,increaseTempo,observers,hashCode,wait,getDocument,setKey,toggleLauncherOverdub,instance,addIsLoopActiveObserver,key,togglePunchOut,notifyAll,addLauncherOverdubObserver,addClickObserver,togglePlay,controlSurfaceState,metronomeValue,equals,addIsRecordingObserver,class,setPosition,toggleWriteClipLauncherAutomation,getInstance,record,inPosition,getControlSurfaceState,automationWriteMode,addChild,toString,connectToDocument,addMetronomeTicksObserver,getOutPosition,incPosition,position,stop,toggleMetronomeTicks,setLauncherOverdub,resetAutomationOverrides,setMetronomeValue,addAutomationWriteModeObserver,setOverdub,setClick,click,children,addIsWritingClipLauncherAutomationObserver,rewind,getPosition,addIsWritingArrangerAutomationObserver,document,launcherOverdub,toggleClick,notify,getTempo,loop,returnToArrangement,toggleLoop,disconnectFromDocument,getClass,addIsPlayingObserver,restart,addOverdubObserver,addPreRollObserver,addPunchOutObserver,play,togglePunchIn,fastForward,overdub,addAutomationOverrideObserver,getInPosition,toggleWriteArrangerAutomation,outPosition,setAutomationWriteMode,setLoop,toggleLatchAutomationWriteMode

addDeviceNameBasedDiscoveryPair(String[] inputs, String[] outputs)
connectToRemoteHost(String host, int port, org.mozilla.javascript.Callable callback)
Application createApplication()
Arranger  createArranger(int screenIndex)
Clip  createCursorClip(int gridWidth, int gridHeight)
CursorDevice  createCursorDevice()
CursorTrack createCursorTrack(int numSends, int numScenes)
TrackBank createEffectTrackBank(int numTracks, int numScenes)
Groove  createGroove()
TrackBank createMainTrackBank(int numTracks, int numSends, int numScenes)
Track createMasterTrack(int numScenes)
Mixer createMixer(String perspective, int screenIndex)
RemoteSocket  createRemoteConnection(String name, int defaultPort)
createRemoteConnection Opens a TCP host socket.
TrackBank createTrackBank(int numTracks, int numSends, int numScenes)
Transport createTransport()
UserControlBank createUserControls(int numControllers)
defineController(String vendor, String name, String version, String uuid)
defineMidiPorts(int numInports, int numOutports)
defineSysexDiscovery(String request, String reply)
defineSysexIdentityReply(String reply)
errorln(String s)
getHostApiVersion()
getHostProduct()
getHostVendor()
getHostVersion()
MidiIn  getMidiInPort(int index)
MidiOut getMidiOutPort(int index)
println(String s)
scheduleTask(org.mozilla.javascript.Callable callback, Object[] args, long delay)
showPopupNotification(String text)

var host;
var application = host.createApplication;
application.activateEngine;
application.addHasActiveEngineObserver(org.mozilla.javascript.Callable callable)
application.addSelectedModeObserver(org.mozilla.javascript.Callable callable, int maxChars, String fallbackText)
application.arrowKeyDown;
application.arrowKeyLeft;
application.arrowKeyRight;
application.arrowKeyUp;
application.copy;
application.cut;
application.deactivateEngine;
application.delete;
application.duplicate;
application.enter;
application.escape;
application.focusPanelAbove;
application.focusPanelBelow;
application.focusPanelToLeft;
application.focusPanelToRight;
application.nextPerspective;
application.paste;
application.previousPerspective;
// application.redo;
// application.rename;
// application.selectAll;
// application.selectNone;
application.setPerspective(String perspective)
application.toggleAutomationEditor;
application.toggleBrowserVisibility;
application.toggleDevices;
application.toggleFullScreen;
application.toggleMixer;
application.toggleNoteEditor;
// application.undo;
// application.zoomIn;
// application.zoomOut;
// application.zoomToFit;
// application.zoomToSelection;
