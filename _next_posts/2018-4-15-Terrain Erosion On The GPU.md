---
layout: post
title: Terrain Erosion On The GPU
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud0.png" width="400" style="float:left;margin-right:15px;"> <p>This work was done during my third year internship to complete my bachelor degree with one friend of mine also an intern. I worked for three month at LIRIS, France in the Geomod team. The goal was to develop an atmosphere model only from sketching on screen with different brushes. We rapidly focus on the modeling and let the sketching part aside because it was only a programming challenge and not really research work. First, let's take a look at some scientific background on atmosphere and clouds.</p>
---

I have been playing with different type of terrain erosion lately and one thing I would like to do is implementing all the things
I do on the GPU. Erosion being very costly in terms of computation time, GPU is the way to go. Fortunately, many erosion algorithm have
been implemented on the GPU. Let's take a look at the state of the art on terrain erosion.

### State of the Art

There are different type of erosion :
* Thermal Erosion : the simplest one to implement. It is based on the repose angle of the terrain material.
* Hydraulic Erosion : simulate water flows over the terrain. There is also different type of Hydraulic erosion, but all
are quite difficult to implement. Still, there is some resources on the internet and good papers about it.

This is the first step of a serie about terrain erosion method. I will try to implement the ones I find the most interesting, both
on the CPU and the GPU to compare results (and also because compute shaders are fun). Note that my skills in GPGPU programming are 
not the best and I am open to suggestion when it comes to implementation.

### Thermal Erosion

Like I said, Thermal erosion is based on the repose (or talus) angle of the material. The idea is to calculate transport a certain
amount of material to the lowest neighbour if our talus angle is above the threshold defined by our material. The process is explained
in the following figure.

[Make a figure]

You can imagine the results it can give : the terrain will have a maximum slope that it will try to obtain by moving matters down the slope.
By chance, the algorithm is easily portable to the GPU : in fact, the code is almost identical the CPU version. Here is a snippet of the GPU
code :

[Code snippet]

The only hot point here is the call to atomicAdd function, which I couldn't get rid of. If forced me to use integer to represents height, which
is not great when you have small details in your terrain because it will snap the values to the nearest integers. I figured that you only do thermal
erosion on big terrains and therefore on large scale (> 1 meters), so it is not too much of a problem.


### Improvements

As always, there is a lof of room for improvement but it goes beyond the scope of this blog post. I am trying to implement various things more than
implementing something really well for a long time. Therefore, here is a list of things that could be improved :
* Using a large range of integer to represent floating value for our terrain. One could cast float to integer and change the range to keep enough precision.
* 

### References
