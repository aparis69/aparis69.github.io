---
layout: post
title: Terrain Erosion On The GPU
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal1.png" width="400" style="float:left;margin-right:15px;"> <p>I have been playing with different type of terrain erosion lately and one thing I would like to do is implementing all the things I do on the GPU. Erosion being very costly in terms of computation time, GPU is the way to go. Fortunately, many erosion algorithm have been implemented on the GPU, but there is not always an open source implementation. Let's take a look at the state of the art on terrain erosion.</p>
---

I have been playing with different type of terrain erosion lately and one thing I would like to do is implementing all the things
I do on the GPU. Erosion being very costly in terms of computation time, GPU is the way to go. Fortunately, many erosion algorithm have
been implemented on the GPU, but there is not always an open source implementation. This is the first article of a series about terrain erosion and procedural generation.
I will try to implement the things I find the most interesting, both on the CPU and the GPU to compare results (and also because compute shaders are fun). Note that my skills in GPGPU programming are 
not the best and I am open to suggestion when it comes to implementation. Let's start by taking a look at the state of the art on terrain erosion.
 
### State of the Art

There are different type of erosion:
* Thermal Erosion: is defined as "the erosion of ice-bearing permafrost by the combined thermal and mechanical action of moving water". It is the simplest one to implement but does not give realistic results by itself.
* Hydraulic Erosion: simulates water flows over the terrain. There are different types of Hydraulic erosion, but all are tricky to implement. Combined with Thermal erosion, it can give realistic looking terrain.

Musgrave was the first to show some results on both Thermal and Hydraulic erosion. These algorithms were ported to the GPU by Jako in 2011 and also Št’ava in 2008. You can also find a very good implementation of Hydraulic Erosion
in Unity by [Digital-Dust](https://www.digital-dust.com/single-post/2017/03/20/Interactive-erosion-in-Unity).

### Thermal Erosion

Thermal erosion is based on the repose or talus angle of the material. The idea is to transport a certain
amount of material in the steepest direction if our talus angle is above the threshold defined the material.

This process leads to terrain with a maximum slope that will be obtained by moving matters down the slope.
By chance, the algorithm is easily portable to the GPU: in fact, the code is almost identical the CPU version. Here is a snippet of the code:

```cpp
layout(binding = 0, std430) coherent buffer HeightfieldData
{
    int data[];
};

uniform int nx; 			// Grid resolution
uniform int ny;				// Grid resolution
uniform float cellSize;			// Cell Size in meters
uniform float tanThresholdAngle;	// Tangent of the threshold angle of the material
uniform int amplitude;			// Erosion amplitude

bool Inside(int i, int j)
{
	if (i < 0 || i >= ny || j < 0 || j >= nx)
		return false;
	return true;
}

int ToIndex1D(int i, int j)
{
	return i * ny + j;
}
 
layout(local_size_x = 512) in;
void main()
{
    uint id = gl_GlobalInvocationID.x;
    if (id >= data.length())
        return;
	
    float maxZdiff = 0;
    int neighbourIndex = -1;
    int i = int(id) / nx;
    int j = int(id) % nx;
    for (int k = -1; k <= 1; k ++)
    {
        for (int l = -1; l <= 1; l ++)
        {
            if (Inside(i + k, j + l) == false)
                continue;
            int index = ToIndex1D(i + k, j + l);
            float h = float(data[index]);
            float z = float(data[id]) - h;
            if (z > maxZdiff)
            {
                maxZdiff = z;
                neighbourIndex = index;
            }
        }
    }
    if (maxZdiff / cellSize > tanThresholdAngle && neighbourIndex != -1)
    {
        atomicAdd(data[id], -amplitude);
        atomicAdd(data[neighbourIndex], amplitude);
    }
}
```

The only difficulty relies in the use of the atomicAdd function because multiple threads can be adding or removing height from a point at the same time. This function only exists for integers, so it forces me to use 
an integer array to represent height data, which is not great when you have small details in your terrain because it will truncate the values to the nearest integers. But I figured that you only do thermal erosion on 
big terrains and therefore on large scale (amplitude > 1 meter), so using integers is not that much of a problem. I use the same buffer for input and output which can lead to slightly
different results depending on the execution order. My investigation led me to conclude that the results were not very different so I kept the most basic implementation in place.
You can see some results in the following figures.

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal0.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal1.png" width="480">

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal2.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal3.png" width="480">

<center><i>The base heightfield on the left, and the results of three hundreds thermal erosion iteration on the right</i></center>

### Results

I ran a quick benchmark to see if I got an interesting speedup. Here are the results after 1000 iterations:

<center>
	<table class="tg">
	  <tr>
		<th class="tg-8o8c">Simulation Grid Size</th>
		<th class="tg-8o8c">CPU Time (s)</th>
		<th class="tg-8o8c">GPU Time (s)</th>
	  </tr>
	  <tr>
		<td class="tg-ml2k">128x128</td>
		<td class="tg-f1li">0.434</td>
		<td class="tg-f1li">0.364</td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">256x256</td>
		<td class="tg-f1li">1.583</td>
		<td class="tg-f1li">0.838</td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">512x512</td>
		<td class="tg-f1li">6.538</td>
		<td class="tg-f1li">2.948</td>
	  </tr>
	  <tr>
		<td class="tg-ml2k">1024x1024</td>
		<td class="tg-f1li">35.135</td>
		<td class="tg-f1li">7.706</td>
	  </tr>
	</table>
</center>

The global process could be improved by using very large integers to represent height on the GPU to take advantage of the atomicAdd function. Another solution could be to use the [intBitsToFloat](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/intBitsToFloat.xhtml)
and [floatBitsToInt](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/floatBitsToInt.xhtml) functions. If you want deterministic results, you can also use different buffers for input and output. The source code is available on [github](https://github.com/vincentriche/Outerrain/).

### References

[Interactive Terrain Modeling Using Hydraulic Erosion - Ondrej Št’ava](http://hpcg.purdue.edu/bbenes/papers/Stava08SCA.pdf)

[Fast Hydraulic and Thermal Erosion on the GPU - Balazs Jako](http://old.cescg.org/CESCG-2011/papers/TUBudapest-Jako-Balazs.pdf)

[Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - Guillaume Cordonnier et al.](https://hal.inria.fr/hal-01262376/document)

[The Synthesis and Rendering of Eroded Fractal Terrains - Kenton Musgrave et al.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.27.8939&rep=rep1&type=pdf)