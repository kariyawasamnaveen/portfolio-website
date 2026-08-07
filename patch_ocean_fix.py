import re

with open('components/ThreeDTechLab.tsx', 'r') as f:
    content = f.read()

# Replace Canvas Lights to focus on the ocean, avoiding orange override
old_lights = """                    <ambientLight intensity={0.8} color="#00b3ff" />
                    <directionalLight position={[0, 10, 0]} intensity={2.5} color="#0088ff" />
                    <pointLight position={[0, 10, -5]} intensity={3} color="#00ffff" distance={40} />"""

new_lights = """                    <ambientLight intensity={1.5} color="#0088ff" />
                    <directionalLight position={[0, 10, 10]} intensity={3} color="#00aaff" />
                    <pointLight position={[0, 5, 5]} intensity={5} color="#00ffff" distance={30} />"""

content = content.replace(old_lights, new_lights)

# Replace Material for a solid Deep Sea Blue look
old_material = """            <meshStandardMaterial 
                color="#001133"
                emissive="#000000"
                roughness={0.05} 
                metalness={1.0} 
            />"""

new_material = """            <meshStandardMaterial 
                color="#0055ff"
                emissive="#001133"
                emissiveIntensity={0.5}
                roughness={0.05} 
                metalness={1.0} 
            />"""

content = content.replace(old_material, new_material)

with open('components/ThreeDTechLab.tsx', 'w') as f:
    f.write(content)
print("Updated Lights & Material for Deep Sea Blue")
