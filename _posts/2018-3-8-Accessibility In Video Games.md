---
layout: post
title: Accessibility In Video Games
date: 08-03-2018
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/accessibility/ablegamers.jpg" width="400" style="float:left;margin-right:15px;"> <p> As I was traveling in Scotland a few years ago to do my second year internship at Robert Gordon University, I knew approximately nothing about accessibility in video games and I think most people and especially many game developers still don't. The idea of this placement was to develop a generic plug in that would provide accessibility features to existing games made with the Unity game engine. Considering this was only a three months placement, I worked with two others friends to make a proof of concept of the program.</p>
---

As I was traveling in Scotland a few years ago to do my second year internship at Robert Gordon University, I knew approximately nothing about accessibility in video games and I think most people and especially many game developers still don't.
The idea of this placement was to develop a generic plug in that would provide accessibility features to existing games made with the Unity game engine. Considering this was only a three months placement, I worked with two others friends to make a proof of concept
of the program.


<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/accessibility/ablegamers.jpg">


### Resources on Accessibility

I learned quite a lot about accessibility in the process and as I said, it is a under investigated topic. If you would like to know more about this, here is a list of very good reference on the subject :
* [Includification](https://www.includification.com/) Perhaps the most important resources for game developpers, this document explains how you can include accessibility features in your game.

* [Able Gamers Foundation](http://www.ablegamers.org/) Trying to improve gamers life by providing custom gaming setups. If you have a disability yourself, you may want to visit this website.

* [Unstoppable Gamers](http://www.unstoppablegamer.com/) This website analyses and writes about all kind of games from the disabled gamer perspective. If you are looking for good (and bad) examples of accessible video games, this is the place.

* [Google](www.google.com) There is a LOT of others resources on the web on how to make your game more accessible and why it matters.


To sum up the key points if you are not convinced you should read more :
* According to the able gamers foundation, it is estimated over one billion people have some form of a disability worldwide, and around 33 million gamers with disabilities.
* "That moment when you realise that your craft isn’t just about entertainment, that you have the opportunity to make a real difference to people, to help change things for the better - it makes a difference to why you get out of bed in the morning." - Ian Hamilton, from the guide above.
* Some accessibility features are VERY easy to implement and could enhance all player experience : key remapping, mouse sensitivity...


### The Accessibility plug in

Now let's talk a bit about the work I did for this project. We ended up with different features and helpers for different type of disabilities :
* Visual helpers : for people who have trouble with contrasts, we provided two post effect shaders : an edge detection and a contrast enhancer one. We also made script to change UI colors for color blind people. A another we did was implementing a close captioning feature for subtitles.
* Hearing disabilities : this one was more difficult to imagine since it depends heavily on the game and the implementation. We ended up with a little script listening to all the sounds being played in the scene and displaying
subtitles for each one in the lower part of the screen. We also made different sliders to allow the player to mute any sound they want in the game.
* Mechanical helpers : some people have problem with 'jiterring' and have trouble using the keyboard or the mouse. We tried to implement a 'double striking filter' that ignores some of the player's input to keep the game smooth.
Since Unity does not provide key remapping out of the box, we also developed a small utility to do that as an example.


*Two screenshots showing the high contrast post effect shader and the close captioning features. You can see all plug in options on the right part of the screen.*


<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/accessibility/accessibilityScreen1.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/accessibility/accessibilityScreen2.png" width="480">


Of course, each of these thing depends on the game you are making but the point is that it is very likely to be easy to integrate a few in your game, and you should consider it. Source code is available on github, but I would advise just
testing the game and seeing what was done - the code is not going to help you a lot since it's quite simple and more of a proof of concept than a production thing. Feel free to use nonetheless if you want to : [Sources](https://github.com/Moon519/Unity-Accessibility-Plug-In)
