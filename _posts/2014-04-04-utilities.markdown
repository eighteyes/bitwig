---
layout: post
title:  "Included Utilities & Language Capabilities"
date:   2014-04-04 15:31:45
categories: text intro beginner
---

Just as important as learning the BitWig API, is learning how to use the EMCAScript 3 implementation of JavaScript available in BitWig.

This is important, because some of the advanced constructs available in modern browsers are not available in BitWig. As well, certain aspects of the language might be confusing for those of us steeped in web development.

* Variable declarations in functions are scoped globally.
* Array map, reduce, forEach, filter are not available.
* Object meta-data control.

Most of these are fairly esoteric, but good to be aware of.

Looking through the `api` folder, we see api_v1.js, midi.js, sysex.js and utils.js.

These are helpful to reference occasionally when developing your driver.

* `println()` Outputs to console.
* `withinRange(val, low, high)` low < val < high shortcut
* `makeIndexedFunction(index, fn)` use in iterators to pass different variables to a event callback. you can see examples used when assigning events to track controls. This is done because each callback needs to be instantiated as a unique object when the listener is made. Otherwise the only parameters that would be passed to all of them would be the last one assigned.
* `dump()` see the output of what an object contains, or what methods a bitwig built in has
* `forceLength(length, padding)` for hardware labels where a certain length string is expected
* `String.repeat(number, delimiter)` repeats a string a `number` of times with `delimiter` between
* `printMidi(status, data1, data2)` very handy to throw on your midi handler

Examine midi.js for a ton of helper functions to assist in categorizing and creating MIDI messages. In case you're curious `(status & 0xf0)` is a way to check the hex code for each channel and find what category it lands in.

* `MIDIChannel(status)` returns the channel of the MIDI message.

I prefer the following log(), which handles multiple parameters.

{% highlight javascript %}
function log(msg) {
  for (var i = 0, l = arguments.length; i < l; i++) {
    host.println(arguments[i]);
  }
}
{% endhighlight %}

Also alert(), to have messages show in a fading popup.

{% highlight javascript %}
function alert(msg) {
  host.showPopupNotification(msg);
}
{% endhighlight %}

Of course, the perennial favorite, setInterval, with optional args.

{% highlight javascript %}
function setInterval(cb, args, delay){
  host.scheduleTask(cb, args, delay);
}
{% endhighlight %}