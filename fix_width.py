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
        
    # Using regex to target the specific width
    new_content = re.sub(
        r'(\.app-wrapper\s*\{[^}]*width:\s*)98vw',
        r'\g<1>96vw',
        content
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

print("Done.")
