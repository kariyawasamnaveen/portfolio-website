export default `
uniform float uTime;
uniform float uWaveCount;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vElevation;
varying vec3 vNormal;

// Gerstner Wave function for PlaneGeometry (XY plane, Z is up)
vec3 gerstnerWave(vec2 direction, float steepness, float wavelength, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float k = 2.0 * 3.14159 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(direction);
    
    // Phase based on XY
    float f = k * (dot(d, p.xy) - c * uTime * 0.5);
    float a = steepness / k;

    float cosf = cos(f);
    float sinf = sin(f);

    // X derivative (tangent)
    tangent += vec3(
        -d.x * d.x * (steepness * sinf),
        -d.x * d.y * (steepness * sinf),
        d.x * (steepness * cosf)
    );

    // Y derivative (binormal)
    binormal += vec3(
        -d.x * d.y * (steepness * sinf),
        -d.y * d.y * (steepness * sinf),
        d.y * (steepness * cosf)
    );

    // Return offset: X, Y are horizontal displacement, Z is vertical displacement
    return vec3(
        d.x * (a * cosf),
        d.y * (a * cosf),
        a * sinf
    );
}

void main() {
    vUv = uv;
    
    vec3 p = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 1.0, 0.0); // For PlaneGeometry, binormal is along Y

    // Combine up to 4 waves
    vec3 offset = vec3(0.0);
    if (uWaveCount >= 1.0) offset += gerstnerWave(vec2(1.0, 0.5), 0.05, 60.0, p, tangent, binormal);
    if (uWaveCount >= 2.0) offset += gerstnerWave(vec2(0.3, -0.8), 0.08, 40.0, p, tangent, binormal);
    if (uWaveCount >= 3.0) offset += gerstnerWave(vec2(-0.6, 0.2), 0.04, 25.0, p, tangent, binormal);
    if (uWaveCount >= 4.0) offset += gerstnerWave(vec2(0.8, 0.8), 0.06, 30.0, p, tangent, binormal);

    p += offset;
    vElevation = offset.z; // Vertical wave height is now Z!
    
    // Calculate accurate normal (X cross Y = Z)
    vec3 newNormal = normalize(cross(tangent, binormal));
    vNormal = normalMatrix * newNormal;

    vec4 worldPosition = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;
