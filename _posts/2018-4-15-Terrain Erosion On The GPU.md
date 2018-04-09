---
layout: post
title: Terrain Erosion On The GPU
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal1.png" width="400" style="float:left;margin-right:15px;"> <p>I have been playing with different type of terrain erosion lately and one thing I would like to do is implementing all the things I do on the GPU. Erosion being very costly in terms of computation time, GPU is the way to go. Fortunately, many erosion algorithm have been implemented on the GPU, but there is not always an open source implementation. Let's take a look at the state of the art on terrain erosion.</p>
---

I have been playing with different type of terrain erosion lately and one thing I would like to do is implementing all the things
I do on the GPU. Erosion being very costly in terms of computation time, GPU is the way to go. Fortunately, many erosion algorithm have
been implemented on the GPU, but there is not always an open source implementation. Let's take a look at the state of the art on terrain erosion.

### State of the Art

There are different type of erosion :
* Thermal Erosion : the simplest one to implement. It is based on the repose angle of the terrain material.
* Hydraulic Erosion : simulate water flows over the terrain. There is also different type of Hydraulic erosion, but all
are tricky to implement. Still, there is some resources on the Internet and good papers about it.

This is the first article of a series about terrain erosion methods - mostly procedural. I will try to implement the ones I find the most interesting, both
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

The only difficult point relies in the use of the atomicAdd function because multiple threads can be adding or removing height from a point at the same time. This function being
defined only for integers, it forces me to use an integer array to represent height data, which is not great when you have small details in your terrain because it will snap the values to the nearest integer. 
But I figured that you only do thermal erosion on big terrains and therefore on large scale (> 1 meters), so using integers is not that much of a problem. You can see some results in the following figures - left being the base terrain
and right the result after a few hundreds iteration.

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal0.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal1.png" width="480">

<center><i>The base heightfield on the left, and the results of 300 hundreds thermal erosion iteration on the right</i></center>

### Results

All algorithms cannot be done on the GPU, which is parallel by nature so I ran a quick benchmark to compare the results of both version of the method.

<center>
	<table class="tg">
	  <tr>
		<th class="tg-8o8c">Simulation Grid Size</th>
		<th class="tg-8o8c">Iteration count</th>
		<th class="tg-8o8c">CPU Time (s)</th>
		<th class="tg-8o8c">GPU Time (s)</th>
	  </tr>
	  <tr>
		<td class="tg-ml2k">128x128</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">256x256</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">512x512</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">1024x1024</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">2048x2048</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">4096x4096</td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
		<td class="tg-f1li"></td>
	  </tr>
	</table>
</center>

### References

[Fast Hydraulic and Thermal Erosion on the GPU - Balazs Jako](http://old.cescg.org/CESCG-2011/papers/TUBudapest-Jako-Balazs.pdf)

[Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - Guillaume Cordonnier et al.](https://hal.inria.fr/hal-01262376/document)

[The Synthesis and Rendering of Eroded Fractal Terrains - Kenton Musgrave et al.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.27.8939&rep=rep1&type=pdf)