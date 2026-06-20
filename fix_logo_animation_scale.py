import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_animation = """@keyframes floatLogo {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }"""

new_animation = """@keyframes floatLogo {
          0% { transform: translate(140px, 0px) scale(1.35); }
          50% { transform: translate(140px, -15px) scale(1.35); }
          100% { transform: translate(140px, 0px) scale(1.35); }"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_animation in content:
        content = content.replace(old_animation, new_animation)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
