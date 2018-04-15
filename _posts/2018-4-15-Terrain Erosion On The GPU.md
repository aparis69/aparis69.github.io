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

Thermal erosion is based on the repose or talus angle of the material. The idea is to transport a certain
amount of material in the steepest direction if our talus angle is above the threshold defined the material.

This process leads to terrain with a maximum slope that it will try to obtain by moving matters down the slope.
By chance, the algorithm is easily portable to the GPU : in fact, the code is almost identical the CPU version. Here is a snippet of the code :

```cpp
layout(binding = 0, std430) coherent buffer HeightfieldData
{
    int data[];
};

uniform int nx;
uniform int ny;
uniform float cellDistX;
uniform float tanThresholdAngle;
uniform int amplitude;

bool Inside(int i, int j)
{
	if (i < 0 || i >= ny || j < 0 || j >= nx)
		return false;
	return true;
}

int ToIndex1D(int i, int j)
{
	return i * nx + j;
}

layout(local_size_x = 512) in;
void main()
{
	uint id = gl_GlobalInvocationID.x;
	if(id >= data.length())
        return;
	
	float maxZdiff = 0;
	int neiIndex = -1;
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
				neiIndex = index;
			}
		}
	}
	if (maxZdiff / cellDistX > tanThresholdAngle && neiIndex != -1)
	{
		atomicAdd(data[id], -amplitude);
		atomicAdd(data[neiIndex], amplitude);
	}
}
```

The only difficult point relies in the use of the atomicAdd function because multiple threads can be adding or removing height from a point at the same time. This function being
defined only for integers, it forces me to use an integer array to represent height data, which is not great when you have small details in your terrain because it will snap the values to the nearest integer. 
But I figured that you only do thermal erosion on big terrains and therefore on large scale (> 1 meters), so using integers is not that much of a problem. You can see some results in the following figures - left being the base terrain
and right the result after a few hundreds iteration.

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal0.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal1.png" width="480">

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal2.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal3.png" width="480">

<center><i>The base heightfield on the left, and the results of 300 hundreds thermal erosion iteration on the right</i></center>

### Results

I ran a quick benchmark to see if I got an interesting speedup. Here are the results after 1000 iterations :

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

### References

[Fast Hydraulic and Thermal Erosion on the GPU - Balazs Jako](http://old.cescg.org/CESCG-2011/papers/TUBudapest-Jako-Balazs.pdf)

[Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - Guillaume Cordonnier et al.](https://hal.inria.fr/hal-01262376/document)

[The Synthesis and Rendering of Eroded Fractal Terrains - Kenton Musgrave et al.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.27.8939&rep=rep1&type=pdf)