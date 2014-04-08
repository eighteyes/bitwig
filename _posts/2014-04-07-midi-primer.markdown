---
layout: post
title:  "A Basic Midi Programming Introduction"
date:   2014-04-07 21:31:45
categories: text midi intro beginner
---

Two useful resources to peruse alongside this entry

[Midi Specifications][midi]

[Bitwise Operators][bw]

It's easy to take MIDI for granted. It's been around for over 30 years, and it's still a standard in modern equipment. There are not many protocol + hardware implementations that have a third of that lifespan.

Midi messages are divided into three bytes ( 8 sets of binary bits ), convention divides these into, Status, Data 1 and Data 2.

Status is the message type, note on, note off, aftertouch, cc change, program change, pitch bend, etc. Status also contains information about which channel a particular midi message is directed at.

Data 1 is the note on the keyboard, starting at 0 (C-1) and ending at 127 (G8). Data 1 is also the control channel number, which differs from the MIDI Channel, it numbers from 0 - 119. These are often referred to as `CCs`.

Data 2 is devoted to velocity information and control channel values, with a few exceptions.

A Note On message has the byte group of `0x90`, meaning everthing from `0x90` to `0x9F` is considered a Note On, the second part of the byte determines the channel.

In `midi.js` you can see

`function isNoteOn(status) { return (status & 0xF0) == 0x90; }`

The `&` is an example of a bitwise operator, and basically says, 'what group is the first part of this byte in'. Look at the link above to learn exactly what is going on here. What you need to know is that these helpers are there to give you the tools necessary to sort your midi messages.

`function MIDIChannel(status) { return status & 0xF; }`

Similiarly, this function returns the Midi Channel of a given status by returning the right most byte.

Control Channels are how buttons, sliders and knobs are utilized. Buttons send 0 or 127 for on or off, respectively, and knobs send a range of values from 0-127, depending on resolution, which is set in your controller software. I prefer a higher resolution for easier manipulation, but your utility may vary.

[midi]: http://www.midi.org/techspecs/midimessages.php
[bw]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
