import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # 1. Fix the border color to a pure, unmistakable vivid blue (#00a8ff)
    if "border: 2px solid #50d0ea !important;" in content:
        content = content.replace("border: 2px solid #50d0ea !important;", "border: 2px solid #00a8ff !important;")
    elif "border: 2px solid #50d0ea;" in content:
         content = content.replace("border: 2px solid #50d0ea;", "border: 2px solid #00a8ff !important;")
        
    # 2. Fix the box shadow glow to match the pure blue (#00a8ff -> 0, 168, 255)
    old_shadow1 = "box-shadow: 0 0 30px rgba(80, 208, 234, 0.4), inset 0 0 20px rgba(80, 208, 234, 0.2) !important;"
    new_shadow = "box-shadow: 0 0 30px rgba(0, 168, 255, 0.4), inset 0 0 20px rgba(0, 168, 255, 0.2) !important;"
    if old_shadow1 in content:
        content = content.replace(old_shadow1, new_shadow)
        
    # 3. Change subtitle text to white as seen in their reference image
    old_subtitle = "color: rgba(80, 208, 234, 0.7) !important;"
    if old_subtitle in content:
        content = content.replace(old_subtitle, "color: #ffffff !important;")
    elif "color: #7ae2f5;" in content:
        content = content.replace("color: #7ae2f5;", "color: #ffffff !important;")
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
