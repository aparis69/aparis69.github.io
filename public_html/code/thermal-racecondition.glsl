#version 430

#ifdef COMPUTE_SHADER

layout(binding = 0, std430) coherent buffer ElevationDataBufferIn
{
	float data[];
};

uniform int nx;
uniform int ny;
uniform float amplitude;
uniform float cellSize;
uniform float tanThresholdAngle;

bool Inside(int i, int j)
{
	if (i < 0 || i >= nx || j < 0 || j >= ny)
		return false;
	return true;
}

int ToIndex1D(int i, int j)
{
	return i * nx + j;
}

void RaceConditionVersion(int i, int j)
{
	int id = ToIndex1D(i, j);
	float maxZDiff = 0;
	int neiIndex = -1;
	for (int k = -1; k <= 1; k += 2)
	{
		for (int l = -1; l <= 1; l += 2)
		{
			if (Inside(i + k, j + l) == false)
				continue;
			if (k == 0 && l == 0)
				continue;
			int index = ToIndex1D(i + k, j + l);
			float h = data[index];
			float z = data[id] - h;
			if (z > maxZDiff)
			{
				maxZDiff = z;
				neiIndex = index;
			}
		}
	}
	if (maxZDiff / cellSize > tanThresholdAngle)
	{
		data[id] = data[id] - amplitude;
		data[neiIndex] = data[neiIndex] + amplitude;
	}
}

layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
void main()
{
	int i = int(gl_GlobalInvocationID.x);
    int j = int(gl_GlobalInvocationID.y);	
	if (i < 0) return;
	if (j < 0) return;
	if (i >= nx) return;
	if (j >= ny) return;
	
	RaceConditionVersion(i, j);
}

#endif
