import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

# We will use a smooth, solid radial gradient exactly matching the magenta in the image.
new_bg = "background: radial-gradient(ellipse at top left, #db1a68 0%, #0a040d 30%, #000000 100%) !important;"

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Find the body, html block and replace the background line
    content = re.sub(r'background:\s*radial-gradient[^;]+!important;', new_bg, content)
    
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
