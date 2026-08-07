import re

with open('components/ThreeDTechLab.tsx', 'r') as f:
    content = f.read()

# Replace Canvas Lights
old_lights = """                    <ambientLight intensity={0.2} color="#006699" />
                    <directionalLight position={[10, 10, 5]} intensity={1.0} color="#0099ff" />
                    <pointLight position={[0, 8, 0]} intensity={1.5} color="#0055ff" distance={30} />"""

new_lights = """                    <ambientLight intensity={0.8} color="#00b3ff" />
                    <directionalLight position={[0, 10, 0]} intensity={2.5} color="#0088ff" />
                    <pointLight position={[0, 10, -5]} intensity={3} color="#00ffff" distance={40} />"""

content = content.replace(old_lights, new_lights)

# Replace Material
old_material = """            <meshStandardMaterial 
                color="#001a33"
                emissive="#000a1a"
                emissiveIntensity={0.8}
                roughness={0.1} 
                metalness={0.9} 
            />"""

new_material = """            <meshStandardMaterial 
                color="#001133"
                emissive="#000000"
                roughness={0.05} 
                metalness={1.0} 
            />"""

content = content.replace(old_material, new_material)

with open('components/ThreeDTechLab.tsx', 'w') as f:
    f.write(content)
print("Updated Lights & Material")
