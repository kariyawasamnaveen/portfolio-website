export default `
uniform sampler2D uTexture;
uniform float uShatter; // 0 to 1
uniform float uTime;
uniform vec3 uColorBase;

varying vec2 vUv;
varying vec3 vPosition;

// Classic 2D noise
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;
    
    // When shattered, distort UVs heavily like a black hole/melt
    if (uShatter > 0.0) {
        float noise = rand(uv * 10.0 + uTime);
        float noise2 = rand(uv * 20.0 - uTime);
        
        // Pull towards center and tear apart
        vec2 dir = uv - 0.5;
        float dist = length(dir);
        uv -= dir * (uShatter * 2.0) * noise; // suck in
        uv.x += (noise - 0.5) * uShatter * 0.5; // tear X
        uv.y += (noise2 - 0.5) * uShatter * 0.5; // tear Y
    }

    vec4 texColor = texture2D(uTexture, uv);
    
    // Convert to grayscale/monochrome
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 finalColor = vec3(gray) * 1.5; // Brighten
    
    // Add crimson tint when shattering
    finalColor = mix(finalColor, uColorBase, uShatter * 0.8);
    
    // Edge fade (circular mask to hide plane edges)
    float distToCenter = length(vUv - 0.5);
    float alphaMask = smoothstep(0.48, 0.45, distToCenter);
    
    // Fade out as it shatters
    float finalAlpha = texColor.a * alphaMask * (1.0 - uShatter);
    
    // Discard pixels completely melted
    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, finalAlpha);
}
`;
