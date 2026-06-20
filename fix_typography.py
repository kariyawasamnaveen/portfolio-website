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
        
    # Using regex to target the specific font sizes safely
    new_content = re.sub(
        r'(\.stacked-title\s*\{[^}]*font-size:\s*)85px',
        r'\g<1>100px',
        content
    )
    new_content = re.sub(
        r'(\.typography-subtitle\s*\{[^}]*font-size:\s*)23px',
        r'\g<1>26px',
        new_content
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

print("Done.")
