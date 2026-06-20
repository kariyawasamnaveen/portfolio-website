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
        
    # Replace the border and background
    new_content = re.sub(
        r'border:\s*2px solid transparent;\s*background:\s*linear-gradient\([^)]+\)\s*padding-box,\s*linear-gradient\([^)]+\)\s*border-box;',
        'border: 2px solid #50d0ea;\\n          background: #0d0415;',
        content
    )
    
    # Replace the box-shadow to match the color #50d0ea / rgba(80, 208, 234)
    new_content = re.sub(
        r'box-shadow:\s*0 0 30px rgba\(0, 240, 255, 0\.2\), inset 0 0 20px rgba\(0, 240, 255, 0\.1\);',
        'box-shadow: 0 0 30px rgba(80, 208, 234, 0.2), inset 0 0 20px rgba(80, 208, 234, 0.1);',
        new_content
    )
    
    with open(file_path, 'w') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

print("Done.")
