export default `
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorGlow;
uniform float uPulseSpeed;
uniform float uIsSpeaking;
uniform float uIsListening;

varying vec3 vNormal;
varying vec3 vViewPosition;

// Simple 3D noise for non-linear pulsing
float hash(vec3 p) {
    p = fract(p * 0.3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
            mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
            mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
}

void main() {
    // Base Fresnel calculation
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnelTerm = dot(viewDir, normal);
    fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
    
    // Heartbeat pulse logic
    float pulse = 0.0;
    if (uIsSpeaking > 0.5) {
        // Fast, intense heartbeat when speaking
        pulse = pow(sin(uTime * uPulseSpeed * 2.0) * 0.5 + 0.5, 4.0);
    } else if (uIsListening > 0.5) {
        // Smooth, erratic noise pulse when listening
        pulse = noise(vec3(0.0, uTime * uPulseSpeed, 0.0)) * 0.8 + 0.2;
    } else {
        // Slow idle breath
        pulse = pow(sin(uTime * uPulseSpeed * 0.5) * 0.5 + 0.5, 2.0) * 0.5;
    }
    
    // Combine Fresnel with pulse to create rim glow
    float glowStrength = pow(fresnelTerm, 3.0) * 2.0;
    glowStrength += pulse * fresnelTerm;
    
    vec3 finalColor = mix(uColorBase, uColorGlow, glowStrength);
    
    // Core center should be slightly darker to emphasize the rim, unless speaking
    float coreDarkness = smoothstep(0.0, 1.0, fresnelTerm);
    if (uIsSpeaking < 0.5) {
        finalColor *= coreDarkness + 0.2;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
