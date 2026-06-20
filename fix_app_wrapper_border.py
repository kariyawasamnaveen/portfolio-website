import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_border = "border: 2px solid #00a8ff !important;"
new_border = "border: 2px solid #52d2e9 !important;"

old_shadow = "box-shadow: 0 0 30px rgba(0, 168, 255, 0.4), inset 0 0 20px rgba(0, 168, 255, 0.2) !important;"
new_shadow = "box-shadow: 0 0 30px rgba(82, 210, 233, 0.4), inset 0 0 20px rgba(82, 210, 233, 0.2) !important;"

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_border in content:
        content = content.replace(old_border, new_border)
        
    if old_shadow in content:
        content = content.replace(old_shadow, new_shadow)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
