import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

# 1. Update Keyframes (scale down and move left)
old_animation = """@keyframes floatLogo {
          0% { transform: translate(140px, 0px) scale(1.35); }
          50% { transform: translate(140px, -15px) scale(1.35); }
          100% { transform: translate(140px, 0px) scale(1.35); }"""

new_animation = """@keyframes floatLogo {
          0% { transform: translate(40px, 0px) scale(1.1); }
          50% { transform: translate(40px, -15px) scale(1.1); }
          100% { transform: translate(40px, 0px) scale(1.1); }"""

# 2. Remove neon light (drop-shadow)
old_shadow = "filter: drop-shadow(0 0 30px rgba(0, 240, 255, 0.4));"
new_shadow = "/* filter removed */"

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_animation in content:
        content = content.replace(old_animation, new_animation)
        
    if old_shadow in content:
        content = content.replace(old_shadow, new_shadow)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
