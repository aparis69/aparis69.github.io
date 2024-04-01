import { Vector2, Vector3 } from 'three';
import { Mesh } from 'js/terrain/intro/mesh.js';

class BaseHeightField {
    // Public members
    horizontalExtents = new Vector2(10, 10);
    verticalExtents = new Vector2(0, 10);
    bboxMin = new Vector2(-5, -5);
    bboxMax = new Vector2(5, 5);

    constructor(horizontalExtents, verticalExtents) {
        this.horizontalExtents = horizontalExtents;
        this.verticalExtents = verticalExtents;
        this.bboxMin = new Vector2(
            -this.horizontalExtents.x / 2.0,
            -this.horizontalExtents.y / 2.0
        );
        this.bboxMax = new Vector2(
            this.horizontalExtents.x / 2.0,
            this.horizontalExtents.y / 2.0
        );
    }

    // Compute altitude at a given 2D point
    Elevation(p) {
        console.log("Not implemented");
        return 0.0;
    }

    /* 
    * Compute the world space position of a vertex from a virtual grid indices and resolution
    * i, j: grid indicies
    * nx, ny: grid dimensions
    */
    Vertex(i, j, nx, ny) {
        let cellDiagonal = new Vector2(
          this.horizontalExtents.x / (nx - 1),
          this.horizontalExtents.y / (ny - 1),
        );
        let p = new Vector2(
            this.bboxMin.x + i * cellDiagonal.x, 
            this.bboxMin.y + j * cellDiagonal.y
        );
        return new Vector3(
            p.x,
            p.y,
            this.Elevation(p)
        );
    }

    /**
    * Create and return a 3D mesh representing a heightfield, with vertices, normals, and triangles.
    * hf: heightfield, which should provide a Vertex(x, y) function.
    * nx, ny: discretization of the desired mesh along x/y axes.
    */
    CreateMesh(nx, ny) {
        var vertices = [];
        var normals = [];
        var triangles = [];

        // Create vertices
        for (var i = 0; i < nx; i++) {
            for (var j = 0; j < ny; j++) {
                vertices.push(this.Vertex(i, j, nx, ny));
                normals.push(new Vector3(0, 0, 0));
            }
        }

        // Compute triangle indices
        for (var i = 0; i < nx - 1; i++) {
            for (var j = 0; j < ny - 1; j++) {
                // Triangle 1
                triangles.push(i * ny + j);
                triangles.push((i + 1) * ny + j);
                triangles.push((i + 1) * ny + j + 1);

                // Triangle 2
                triangles.push(i * ny + j);
                triangles.push((i + 1) * ny + j + 1);
                triangles.push(i * ny + j + 1);
            }
        }
        
        // Compute normals from triangles
        for (var i = 0; i < triangles.length; i += 3) {
            let a = vertices[triangles[i + 0]].clone();
            let b = vertices[triangles[i + 1]].clone();
            let c = vertices[triangles[i + 2]].clone();

            let ba = b;
            ba.sub(a);
            let n = ba.cross(c.sub(a)).normalize();
            normals[triangles[i + 0]].add(n);
            normals[triangles[i + 1]].add(n);
            normals[triangles[i + 2]].add(n);
        }
        for (var i = 0; i < normals.length; i++) {
            normals[i].normalize();
        }

        return new Mesh(vertices, normals, triangles);
    }
}

export class DiscreteHeightField extends BaseHeightField {
    // Size of the 2D data array
    nx = 256;
    ny = 256;
    data = null;

    constructor(horizontalExtents, verticalExtents, nx, ny, data) {
        super(horizontalExtents, verticalExtents);
        this.nx = nx;
        this.ny = ny;
        this.data = data;
    }

    /**
    * Bilinear interpolation of a set of values.
    * a00, a10, a11, a01: values to interpolate.
    * u, v: interpolation factors along x/y axis.
    */
    Bilinear(a00, a10, a11, a01, u, v) {
        return (1 - u) * (1 - v) * a00 
            + (1 - u) * (v) * a01 
            + (u) * (1 - v) * a10 
            + (u) * (v) * a11;
    }

    SampleGrid(i, j) {
        return this.data[i * this.ny + j] * this.verticalExtents.y;
    }

    // Compute the altitude of a 2D point using bilinear interpolation
    Elevation(p) {
        let d = new Vector2(
            this.bboxMax.x - this.bboxMin.x,
            this.bboxMax.y - this.bboxMin.y
        );
        
        // Coordinate of point in heightfield
        let q = p.clone();
        q.sub(this.bboxMin);
      
        let u = q.x / d.x;
        let v = q.y / d.y;
      
        // Scale
        u *= (this.nx - 1);
        v *= (this.ny - 1);
      
        // Integer coordinates
        let i = Math.floor(u);
        let j = Math.floor(v);

        // No interpolation on borders
        if (i >= this.nx -1 || j >= this.ny - 1) {
            return this.SampleGrid(i, j);
        }
      
        // Local coordinates within cell
        u -= i;
        v -= j;

        // Bilinear interpolation
        return this.Bilinear(
            this.SampleGrid(i, j), this.SampleGrid(i + 1, j), 
            this.SampleGrid(i + 1, j + 1), this.SampleGrid(i, j + 1), 
            u, v
        );
    }
}

export class ProceduralHeightField extends BaseHeightField {
    constructor(horizontalExtents, verticalExtents) {
        super(horizontalExtents, verticalExtents);
    }

    // Compute the altitude of a 2D point procedurally
    Elevation(p) {
        return Math.cos(p.x) + Math.cos(p.y);
    }
}