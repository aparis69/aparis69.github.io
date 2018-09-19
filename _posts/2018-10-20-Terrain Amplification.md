---
layout: post
title: Terrain Amplification
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/thermal_erosion/thermalResults.png" width="400" style="float:left;margin-right:15px;"> <p></p>
---

This post will be about various terrain amplification methods that I tried by curiosity. You will often find in research papers and blog post that in order to amplify a terrain (add details), you
need to use some noise function combined with the slope or some other value, but the truth is that you will not find a real comparison, explanation and code provided on this topic. In this post I will
try all the methods I can think of to add detail on a low resolution heightfield (DEM or a fractal noise).
 
### Context and Existing Work

Musgrave, Parberry, Genevaux, Cordonnier

### Add details with Noise

Uniform noise
Noise + slope
Noise with user mask

### Restoring features

Drainage system and rivers (Drainage)
Glacial erosion features (Stream power)
Steep cliffs (Slope + Horizontal Displacement)

### References

[Large Scale Terrain Generation from Tectonic Uplift and Fluvial Erosion - Guillaume Cordonnier et al.](https://hal.inria.fr/hal-01262376/document)

[The Synthesis and Rendering of Eroded Fractal Terrains - Kenton Musgrave et al.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.27.8939&rep=rep1&type=pdf)