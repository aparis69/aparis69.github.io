---
layout: post
title: Atmosphere Modeling By Sketching
excerpt: <img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud0.png" width="400" style="float:left;margin-right:15px;"> <p>This work was done during my third year internship to complete my bachelor degree with one friend of mine also an intern. I worked for three month at LIRIS, France in the Geomod team. The goal was to develop an atmosphere model only from sketching on screen with different brushes. We rapidly focus on the modeling and let the sketching part aside because it was only a programming challenge and not really research work. First, let's take a look at some scientific background on atmosphere and clouds.</p>
---

This work was done during my third year internship to complete my bachelor degree with one friend of mine also an intern. I worked for three month at LIRIS, France in the [Geomod team](https://projet.liris.cnrs.fr/geomod/). The goal was to develop an atmosphere model only from sketching on screen with different brushes.
We rapidly focus on the modeling and let the sketching part aside because it was more of a programming challenge than research. First, let's take a look at the state of the art in clouds and some scientific background on atmosphere and clouds.

### State of the Art

Atmosphere and clouds have been studied for quite a long time, but there was not work that focused on the modeling of an coherent atmosphere from a global point of view. There was, as always simulation, procedural generation and hand crafted clouds.
[Bouthors](https://hal.inria.fr/inria-00537462/file/BN04_clouds.pdf) worked on representing cumulus clouds as a set of spherical sphere defined by an implicit field which can deform under the influence of neighbor particles. [Schpok](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.884.2816&rep=rep1&type=pdf) worked on the rendering of other types as well, but
this work stays at small scope : at max a few clouds and a heavy focus on rendering instead of representing an entire atmosphere. Therefore, this is where our work standed.


### Atmosphere, Clouds


<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud0.png">

<center><i>Figure showing the different types of cloud and altitude ranges. We can then extract a few types and layer to create our model. See Wikipedia for more information on this topic.</i></center>


Atmosphere here on earth is composed of multiple layers and multiple things. We focused rapidly on clouds since it is the most observed phenomena. There are different types of clouds, each one having his own properties :
* Cumulus, or fluffy clouds are the most know type. They appears at low altitudes, typically below 2000m.
* Alto clouds, appearing as globular masses or rolls in layers or patches.
* Cirrus clouds characterized by thin, wispy strands at high altitudes.
* Cumulonimbus clouds, something I call multi-layer clouds, literally going through every sky layers because there are huge.


### The pipeline
To allow the user enough control on the scene, we adopted a sketching approach. The user would draw cloud densities on the screen wherever they wanted, and the application would translate this into real clouds. The user should also be able to specify shadow or sunny area on the screen and the application
would take care of all this, solve conflicts between views, and propose a final atmosphere model reading for rendering inside or outside of the application. We developed the following pipeline to solve these problems :


<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud1.png">

<center><i>The big picture of the pipeline, showing literally every step of the program.</i></center>


#### Atmosphere Model

<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud2.png">

<center><i>Our atmosphere model : divided into four layers that can contains only certain types of clouds, which are modelled as a vector of Spheres/Densities representing the shapes. Extra parameters specify the maximum size of the cloud.</i></center>

Sky layers were implemented as 3D scalar fields, storing different information depending where we are in the pipeline. A possible mistake during the modeling we made was trying to create too much cloud types as you can see on the figure. Each of these has different properties, but for a three month internship we could have focused on cumulus, alto et cirrus clouds only. 
The model is quite simple and based on the idea that clouds will be represented as a set of spheres, and therefore rendered as well from this representation. This proved to be the main difficult when we got results with our little spheres : how to make a proper rendering from this ? The Geomod team had no rendering pipeline for clouds.
Me and my friends worked on cloud rendering sooner this year and got interesting results, but the model was not quite ready and had bug to fix (and it is still true today). At the time, cloud rendering became very popular thanks to Guerrila Games and their game, Horizon Zero Dawn which
features very realistic cloud rendering in real time.


#### Projection and Conflicts resolution

The first stage of our pipeline consisted of taking user sketches and translating these into densities in our atmosphere model. To do that, we simply projected every pixel of the sketch onto the corresponding sky layers and fill densities in the scalar fields.
We also had a conflicts resolution stage, where we basically merged user constraints from different views : the shadow and sunny area specified by the user could have intersection/conflicts zone that we solved by some ad hoc rules.
The next figure shows how the projection and the resolution works in the application.

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud3.png" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud4.png" width="480">


#### Sampling, Instancing

At this point, we have our sky layers filled with densities. What we want to is actual cloud instances. To do that, we need to compute candidate position from our scalar fields and then find a way to create a cloud from this position.
This stage is called Sampling. We use poisson disk to sample our scalar field uniformly and get candidate positions. The following figure show how Sampling works in our pipeline.

<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud6.jpg" width="480">
<img src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud5.png" width="480">




#### Amplification


### Retrospective and Avenue for future work


### References

[Guerilla Clouds Rendering Presentation](http://killzone.dl.playstation.net/killzone/horizonzerodawn/presentations/Siggraph15_Schneider_Real-Time_Volumetric_Cloudscapes_of_Horizon_Zero_Dawn.pdf)

[Modeling clouds shape](https://hal.inria.fr/inria-00537462/file/BN04_clouds.pdf)

[A Real-Time Cloud Modeling, Rendering, and Animation System](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.884.2816&rep=rep1&type=pdf)

[Cloud types, Wikipedia](https://en.wikipedia.org/wiki/List_of_cloud_types)

