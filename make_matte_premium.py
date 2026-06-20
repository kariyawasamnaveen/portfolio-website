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

    # 1. Remove .app-wrapper glow
    content = re.sub(r'(box-shadow:\s*0 0 30px rgba\([^)]+\),\s*inset 0 0 20px rgba\([^)]+\)[^;]*;)', r'/* \1 */\n          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);', content)
    
    # 2. Remove .app-input-group input glow
    content = re.sub(r'(box-shadow:\s*inset 0 0 10px rgba\([^)]+\)[^;]*;)', r'/* \1 */', content)
    
    # 3. Remove .app-input-group input:focus glow
    content = re.sub(r'(box-shadow:\s*inset 0 0 15px rgba\([^)]+\)[^;]*;)', r'/* \1 */', content)
    
    # 4. Remove .app-btn-submit glow
    content = re.sub(r'(box-shadow:\s*0 0 15px rgba\([^)]+\)[^;]*;)', r'/* \1 */', content)
    
    # 5. Remove .app-btn-submit:hover glow
    content = re.sub(r'(box-shadow:\s*0 0 25px rgba\([^)]+\)[^;]*;)', r'/* \1 */\n          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4) !important;', content)
    
    # 6. Remove .form-tab.active::after glow
    content = re.sub(r'(box-shadow:\s*0 0 10px var\([^)]+\)[^;]*;)', r'/* \1 */', content)
    
    # 7. Make form-tabs border non-glowing if it has box-shadow
    content = re.sub(r'(box-shadow:\s*inset 0 2px 0 0[^;]*;)', r'/* \1 */', content)
    
    # Also fix the input border to make it crisp 1px solid without glow
    # If the input has a neon cyan border, we keep it but it will naturally look matte without the box shadow.

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
