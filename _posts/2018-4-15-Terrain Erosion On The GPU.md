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
are tricky to implement. Still, there is some resources on the Internet and good papers about it.

This is the first article of a series about terrain erosion methods. I will try to implement the ones I find the most interesting, both
on the CPU and the GPU to compare results (and also because compute shader are fun). Note that my skills in GPGPU programming are 
not the best and I am open to suggestion when it comes to implementation.

### Thermal Erosion

Like I said, Thermal erosion is based on the repose (or talus) angle of the material. The idea is to transport a certain
amount of material to the lowest neighbor if our talus angle is above the threshold defined by our material. The process is explained
in the following figure.

[Make a figure]

You can imagine the results : the terrain will have a maximum slope that it will try to obtain by moving matters down the slope.
By chance, the algorithm is easily portable to the GPU : in fact, the code is almost identical the CPU version. Here is a snippet of the code :

[Code snippet]

The only hot point is the use of the atomicAdd function because multiple thread can be adding/removing height from a point at the same time. 
It forces me to use integer to represents height, which is not great when you have small details in your terrain because it will snap the values to the nearest integers. 
But I figured that you only do thermal erosion on big terrains and therefore on large scale (> 1 meters), so using integers is not that much of a problem.

### Results

All algorithms cannot be done on the GPU, which is parallel by nature so I ran a quick benchmark to compare the results of both version of the method.

| Simulation Grid Size | CPU Time (s) | GPU Time (s) |
|----------------------|--------------|--------------|
|        128x128       |         5    |        2     |
|        256x256       |         5    |        2     |
|        512x512       |        5     |        2     |
|       1024x1024      |         5    |        2     |
|       2048x2048      |          5   |        2     |
|       4096x4096      |          5   |        2     |

### References

[Fast Hydraulic and Thermal Erosion on the GPU - Balazs Jako](http://old.cescg.org/CESCG-2011/papers/TUBudapest-Jako-Balazs.pdf)

[Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - Guillaume Cordonnier et al.](https://hal.inria.fr/hal-01262376/document)

[The Synthesis and Rendering of Eroded Fractal Terrains - Kenton Musgrave et al.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.27.8939&rep=rep1&type=pdf)