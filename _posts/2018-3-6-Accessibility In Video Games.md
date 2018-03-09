---
layout: post
title: Accessibility In Video Games
excerpt: Showcase and explanation of the work I have done during a research internship at Robert Gordon University, Scotland during my second year of Bachelor degree.
---

/* Blog post in progress */

As I was traveling in Scotland a few years ago to do my second year internship at Robert Gordon University, I knew approximately nothing about accessibility in video games and I think most people and especially many game developers still don't.
The idea was to develop a generic plug in that would provide accessibility features to existing games made with the Unity game engine. Considering this was only a three months placement, I worked with two others friends to make a proof of concept
of the program.

I learned quite a lot about accessibility in the process and as I said, it is a under investigated topic. If you would like to know more about this, here is a list of very good reference on the subject :
* Accessibility guidelines
* ...

We ended up with different features and helpers for different type of disabilities :
* Visual helpers : for people who have trouble with contrasts, we provided two post effect shaders : an edge detection and a contrast enhancer one.
* Hearing disabilities : this one was more difficult to imagine since it depends heavily on the game and the implementation. We ended up with a little script listening to all the sound being played in the scene and displaying
subtitles for each one in the lower part of the screen. We also made different sliders to allow the player to mute any sound they want in the game.
* Mechanical helpers :

Of course, each of these thing depends on the game you are making but the point is that it is very likely to be easy to integrate a few in your game, and you should consider it. Source code is available on github, but I would advise just
testing the game and seeing what was done - the code is not going to help you a lot since it's quite simple. Feel free to use nonetheless if you want to.


/* Blog post in progress */