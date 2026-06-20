import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # 1. Fix the box shadow to use the exact blue color and remove green glow
    old_shadow = "box-shadow: 0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.1);"
    new_shadow = "box-shadow: 0 0 30px rgba(80, 208, 234, 0.4), inset 0 0 20px rgba(80, 208, 234, 0.2);"
    
    if old_shadow in content:
        content = content.replace(old_shadow, new_shadow)
        
    # 2. Force exactly 3 lines using white-space: nowrap; for the subtitle
    if ".typography-subtitle {" in content and "white-space: nowrap;" not in content:
        content = content.replace(".typography-subtitle {", ".typography-subtitle {\n          white-space: nowrap;")
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
