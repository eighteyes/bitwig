---
layout: post
title:  "Introduction to BitWig API Programming"
date:   2014-04-04 15:31:45
categories: text intro beginner
---

Welcome, I am assuming a fundamental understanding of JavaScript Programming. You should know what variables, functions, iterations, conditionals, objects and events are.

If you need an introduction, I think [Codecademy][learnjs] is a fair bet for a solid resource.

[learnjs]: http://www.codecademy.com/tracks/javascript

Step 1: Read the `Control Surface Scripting Guide` available in BitWig > Help . I will wait for you to return, and do my best not to duplicate content, but instead guide you through this dense introduction.

Step 2: Use the instructions in the guide to find where your BitWig scripts are stored.

Hint:

Mac and Linux `~/Bitwig Studio/Controller Scripts/`

Windows `%USERPROFILE%\Documents\Bitwig Studio\Controller Scripts\`

Step 3: Make a file entitled `test.control.js` within the generic folder. It is important that your files end with `control.js`, otherwise they won't be recognized by BitWig.

Step 4: Enter this content in your file.

{% highlight javascript %}
loadAPI(1);

host.defineController("Generic", "Test", "1.0", "97A21EF8-D9B5-4AB9-A261-066997B81E2B");
host.defineMidiPorts(1, 1);
{% endhighlight %}

Feel free to enter a new UUID using the excellent `GenerateUUID` package in Sublime or [get one online][uuid]. Make sure it is uppercase.

[uuid]: http://www.famkruithof.net/uuid/uuidgen

Step 5: **Restart** Bitwig and open the Script Console via the Commander or View Menu. Ensure that test.control.js is visible on the right, and it exists in Preferences > Controllers > Add Controller Manually > Generic.

Hooray, the basics are out of the way, and we can move forward.
