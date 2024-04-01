
stateNoise = {
	spectralWeights: null,
}
var stateNoise;

function precomputeSpectralWeights(maxOctave) {
	stateNoise.spectralWeights = new Float32Array(maxOctave);
	let frequency = 1.0;
	let H = 0.75;
	for (let i = 0; i < maxOctave; i++) {
		stateNoise.spectralWeights[i] = Math.pow(frequency, -H)
		frequency *= 2.0;
	}
}

function fBm(x, y, perlin, a0, f0, o, noiseType) {
	let ret = 0.0;
	let a = a0;
	let f = f0;
	for (let i = 0; i < o; i++) {
		// Perlin
		if (noiseType == 0) {
			ret += perlin.noise(x * f, y * f, 0.0) * a;
		}
		// Ridge
		else if (noiseType == 1) {
			ret += (1.0 - Math.abs(perlin.noise(x * f, y * f, 0.0)) * a) - 1.0;
		}
		// Perlin Multifractal
		else if (noiseType == 2) {
			let s = perlin.noise(x * f, y * f, 0.0) * 0.5 + 0.5;
			if (i > 0) {
				s *= stateNoise.spectralWeights[i];
				s *= ret;
			}
			ret += s;

			if (i == o - 1) {
				ret *= a0;
				ret -= a0 / 2;
			}
		}
		// Ridge Multifractal
		else if (noiseType == 3) {
			let s = 1.0 - Math.abs(perlin.noise(x * f, y * f, 0.0)) - 0.5;
			if (i > 0) {
				s *= stateNoise.spectralWeights[i];
				s *= ret;
			}
			ret += s;

			if (i == o - 1) {
				ret *= a0;
			}
		}
		a *= 0.5;
		f *= 2.0;
	}
	return ret;
}

function falloff(d, r) {
	if (d > r) {
		return 0.0;
	}
	let x = d / r;
	x = x * x;
	return (1.0 - x) * (1.0 - x) * (1.0 - x);
}

export { precomputeSpectralWeights, fBm, falloff };