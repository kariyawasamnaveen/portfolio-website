import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
        
    new_content = content.replace('height: 97vh;', 'height: 93vh;')
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

print("Done.")
