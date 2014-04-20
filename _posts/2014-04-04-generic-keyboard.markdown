---
layout: post
title:  "Generic Keyboard Implementation"
date:   2014-04-04 15:31:45
categories: text intro beginner
---

One of the great aspects of open source, and BitWig in particular is that you can see the controller drivers others have made in order to learn how to build your own.

Everything starts from the `init()`, which is fired after BitWig recognizes your hardware, (how to do this is detailed in the Guide) and goes through the process of setting up how BitWig will respond to your hardware. Success will mean "Called init()" in the console.

This is where compilation errors will show.

The simplest driver is the `Generic Midi Keyboard`. In the init() here you see:

{% highlight javascript %}
host.getMidiInPort(0).createNoteInput("MIDI Keyboard");
{% endhighlight %}

 "Midi Keyboard" becomes available as an input to your tracks within the application. `createNoteInput` OVERRIDES the `setMidiCallback` below, so your note data will not be passed to `onMidi` if it is handled here.

 All the MIDI note information is handled at this point, and for implementing a basic MIDI keyboard, this is all we need. The rest of the script handles controller (CC) data, knobs, faders and the like. Not bad eh?

{% highlight javascript %}
host.getMidiInPort(0).setMidiCallback(onMidi);
{% endhighlight %}

Sets up the callback for incoming MIDI information.

Callbacks are basically using functions as objects, and being setup to be fired off as a listener for an event. This is an equivalent paradigm to `$(elem).on('click', handleElemClick)` in jQuery or `EventTarget.addEventListener( 'click', handleClick)` in stock JavaScript. So, `on('midinote', onMidi)`.

`onMidi` is defined later in the document with `function onMidi(status, data1, data2)` and can be used like a variable in methods that support it. It may be helpful to think of this as `var onMidi = function(status, data1, data2)` as they are equivalent.

If you own any of the natively supported hardware, you should investigate the scripts for that and get an idea of how it is integrated. Don't worry about the details, just get a sense of how the application is structured.
