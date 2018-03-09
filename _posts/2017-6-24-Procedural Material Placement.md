---
layout: post
title: Procedural Material Placement, Texturing and PBR
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen31.png" width="480"> Showcase and explanation of the work I have done on our material placement workflow in the terrain engine.
---

Over the past two years, I have been working on a procedural system for material placement in the terrain engine. Here is the [main page](http://newheadstudio.com/) of the engine if you want to know more about it.

We wanted control over the placement in order to create biomes and realistic landscapes but we couldn’t do everything by hand since our terrain was realistically scaled. The solution we came up with is something we call the ‘Material Tree’.


*Each node can be edited with a Unity-style inspector on the right of the editor window. We made a custom serialization system (txt files) for our trees because we couldn't get the unity scriptable objects to work in game mode in our node editor. This also allow us to easily back up our material trees.*

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen24.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen25.png" width="480">

### How it works
The material tree is basically a hierarchical way of ordering the materials in our scenes. Only leaf nodes are actually placed on the terrain - intermediate nodes exists for decision making. 

Here is how it works for a single vertex :
* We evaluate which node in the material tree will be associated based on probabilities. 
* The probabilities for the vertex are affected by many parameters : LOD level, altitude, curvature, neighbour’s material, slope etc… Each one increasing or decreasing the probability to go in a given node of the tree.
* We repeat this until we reach a leaf node - and then we know which material will be on this vertex. 

With this process, we are able to determine vertex height as well as the ground material and the vegetation on it : bushes, grass or trees. It has proven to be a pretty solid solution for our needs : thanks to the GUI I developed, we can ‘easily’ modify the rules and see the results on the terrain. 

The node editor I made was heavily inspired by this link : Seneral Node Editor I ended up rewriting it to better fit our needs - but the idea is the same and this is a great open source tool.


<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen26.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen27.png" width="480">


### Advantages
* We can texture and place vegetation very quickly and easily. 
* No perlin noise or multiple-octave fractal algorithm involved. With this system, we are able to populate the terrain without any visible patterns and without noise, which are hard to get right a lot of the time. 
* With a little creativity, it is possible to create complex hierarchical vegetation placement : bushes below the trees mixed with grass, various flowers grouping in plains etc… 
* Unified representation : with our UI, we now have a unified model for all our materials in our scenes. We just need to master one tool to create everything.

### Disadvantages
* Difficulties when it comes to specific terrain features : we can’t customize the look of this mountain in our terrain. 
* Hard to control : sometimes, just changing one node can change all the terrain, and that’s not something we want most of the time. It takes some practice to get it to work the way we want.

### Integration with Unity Standard Shader
I have also been working on integrating our material tree with the standard shader in Unity in order to take advantage of the physically based rendering. I also took the time to integrate texture support (we used simple rgb colors). 
To achieve that, I had to modify Unity Shaders but to keep the part about the physically based rendering. I have to say it was fairly easy to do - the shaders are all well written and documented. In fact, I only had to modify two files : UnityStandardCore and UnityStandardInput. I removed all the reference to forward rendering since we use deferred, and then it was just calling our function to get the texture we want and pass it to the standard shader pipeline. 

This series of article from the Blacksmith were helpful in that regard, firstly because they modified the standard shader too (and that proved it could be done in a reasonable amount of time) and also because they provided good calibration charts for natural materials. The Blacksmith Main Page


*See results in the screenshots below. On the left, without PBR and without textures. On the right, with PBR and textures. We use normal maps for rocky materials only.*


<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen28.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen29.png" width="480">


<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen30.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/screen31.png" width="480">


### Future possibilities
* Create a custom modification system - something I am now working on is an "Overlay" system. I will probably write something about it when it's done. 
* Make other scenes. We want to test the possibilities of the material tree by creating different scenes with different biomes. 
* Find proper textures, normals maps etc... To achieve high artistic quality. 