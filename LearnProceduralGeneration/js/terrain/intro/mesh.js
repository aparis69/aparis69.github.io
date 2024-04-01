import * as THREE from 'three';

/**
* Basic 3D triangle mesh data structure.
*/ 
export class Mesh {
    vertices = null;
    normals = null;
    triangles = null;

    constructor(vertices, normals, triangles) {
        this.vertices = vertices;
        this.normals = normals;
        this.triangles = triangles;
    }

    CreateThreeJsGeometry() {
        const geometry = new THREE.BufferGeometry();

        // Vertices & Normals
        const verts = new Float32Array(this.vertices.length * 3);
        const norms = new Float32Array(this.normals.length * 3);
        for (var i = 0, j = 0; i < verts.length; i += 3, j++) {
            verts[i + 0] = this.vertices[j].x;
            verts[i + 1] = this.vertices[j].y;
            verts[i + 2] = this.vertices[j].z;

            norms[i + 0] = this.normals[j].x;
            norms[i + 1] = this.normals[j].y;
            norms[i + 2] = this.normals[j].z;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(norms, 3));

        // Indices
        geometry.setIndex(this.triangles);

        return geometry;
    }
}
