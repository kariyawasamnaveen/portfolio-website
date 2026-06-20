import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Update subtitle color to a light blue that matches the #00a8ff border
    if "color: #ffffff !important;" in content:
        content = content.replace("color: #ffffff !important;", "color: rgba(0, 168, 255, 0.8) !important;")
        
    # Update font size from 32px to 28px
    content = re.sub(r'(\.typography-subtitle\s*\{[^}]*font-size:\s*)32px', r'\g<1>28px', content)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
