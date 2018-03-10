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

*Figure showing the different types of cloud and altitudes ranges. We can then extract a few types and layer to create our model. See Wikipedia for more information on this topic.*


Atmosphere here on earth is composed of multiple layers and multiple things. We focused rapidly on clouds since it is the most observed phenomena. There are different types of clouds, each one having his own properties :
* Cumulus, or fluffy clouds are the most know type. They appears at low altitudes, typically below 2000m.
* Alto clouds, appearing as globular masses or rolls in layers or patches.
* Cirrus clouds characterized by thin, wispy strands at high altitudes.
* Cumulonimbus clouds, something I call multi-layer clouds, literally going through every sky layers because there are huge.


### The pipeline
To allow the user enough control on the scene, we adopted a sketching approach. The user would draw cloud densities on the screen wherever they wanted, and the application would translate this into real clouds. The user should also be able to specify shadow or sunny area on the screen and the application
would take care of all this, solve conflicts between views, and propose a final atmosphere model reading for rendering inside or outside of the application. We developed the following pipeline to solve these problems :


<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud1.png">

*The big picture of the pipeline, showing literally every step of the program.*


#### Atmosphere Model

<img class="displayed" src="https://raw.githubusercontent.com/Moon519/moon519.github.io/master/images/cloud2.png">

*Our atmosphere model : divided into four layers that can contains only certain types of clouds, which are modelled as a vector of Spheres/Densities representing the shapes. Extra parameters specify the maximum size of the cloud.*


#### Projection and Conflicts resolution


#### Sampling, Instancing


#### Amplification


### Perspectives and future work


### References

[Modeling clouds shape](https://hal.inria.fr/inria-00537462/file/BN04_clouds.pdf)

[A Real-Time Cloud Modeling, Rendering, and Animation System](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.884.2816&rep=rep1&type=pdf)

[Cloud types, Wikipedia](https://en.wikipedia.org/wiki/List_of_cloud_types)

