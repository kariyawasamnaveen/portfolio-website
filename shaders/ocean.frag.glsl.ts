export default `
uniform vec3 uColor;
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vElevation;
varying vec3 vNormal;

// Simple 2D noise for foam
float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

void main() {
    // Base ocean color
    vec3 color = uColor;
    
    // Fake dome reflection (Red glow hitting water)
    // Assuming dome is around Z=20, X=0. Calculate distance from current frag to dome.
    float distToDome = length(vWorldPosition.xz - vec2(0.0, 20.0));
    float domeGlow = smoothstep(100.0, 10.0, distToDome) * 0.5;
    
    // Fresnal (edge highlights)
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = dot(viewDirection, normalize(vNormal));
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    // Mix sky reflection (dark grey/reddish) using fresnel
    vec3 skyColor = mix(vec3(0.05, 0.05, 0.08), vec3(0.5, 0.1, 0.1), domeGlow);
    color = mix(color, skyColor, fresnel);

    // Foam at peaks
    float foamThreshold = 0.8;
    if (vElevation > foamThreshold) {
        float foamIntensity = (vElevation - foamThreshold) * 1.5;
        float n = noise(vUv * 50.0 + uTime);
        color = mix(color, vec3(0.8, 0.9, 1.0), foamIntensity * n);
    }
    
    gl_FragColor = vec4(color, 0.95);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
}
`;
