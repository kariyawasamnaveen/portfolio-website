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

    # 0. Fix the stray text on line 1 of sign_in.php
    if file_path.endswith('sign_in.php'):
        content = re.sub(r'^pako me logo eka wate thiyena kalu pata norder eka wage eke pwnda ubata mata eka kiypanko mulinma , w<\!DOCTYPE html>', '<!DOCTYPE html>', content)

    # 1. Reverse .app-wrapper glow
    content = re.sub(r'/\*\s*(box-shadow:\s*0 0 30px rgba\([^)]+\),\s*inset 0 0 20px rgba\([^)]+\)[^;]*;)\s*\*/\n\s*box-shadow: 0 20px 40px rgba\(0, 0, 0, 0\.5\);', r'\1', content)
    
    # 2. Reverse .app-input-group input glow
    content = re.sub(r'/\*\s*(box-shadow:\s*inset 0 0 10px rgba\([^)]+\)[^;]*;)\s*\*/', r'\1', content)
    content = re.sub(r'/\*\s*(box-shadow:\s*inset 0 0 5px rgba\([^)]+\)[^;]*;)\s*\*/', r'\1', content)
    
    # 3. Reverse .app-input-group input:focus glow
    content = re.sub(r'/\*\s*(box-shadow:\s*inset 0 0 15px rgba\([^)]+\)[^;]*;)\s*\*/', r'\1', content)
    
    # 4. Reverse .app-btn-submit glow
    content = re.sub(r'/\*\s*(box-shadow:\s*0 0 15px rgba\([^)]+\)[^;]*;)\s*\*/', r'\1', content)
    
    # 5. Reverse .app-btn-submit:hover glow
    content = re.sub(r'/\*\s*(box-shadow:\s*0 0 25px rgba\([^)]+\)[^;]*;)\s*\*/\n\s*box-shadow: 0 10px 20px rgba\(0, 0, 0, 0\.4\) !important;', r'\1', content)
    
    # 6. Reverse .form-tab.active::after glow
    content = re.sub(r'/\*\s*(box-shadow:\s*0 0 10px var\([^)]+\)[^;]*;)\s*\*/', r'\1', content)

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
