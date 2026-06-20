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
    
    # Update badge container background and border
    content = content.replace("background: rgba(0, 240, 255, 0.05);", "background: rgba(0, 168, 255, 0.1);")
    content = content.replace("border: 1px solid rgba(0, 240, 255, 0.3);", "border: 1px solid rgba(0, 168, 255, 0.6);")
    
    # Update padding
    content = content.replace("padding: 12px 24px;", "padding: 16px 30px;")
    
    # Update badge icon color and font-size
    content = content.replace("color: var(--neon-cyan);", "color: #00a8ff;")
    if ".badge-icon {\n          color: #00a8ff;\n          font-size: 18px;" in content:
        content = content.replace(".badge-icon {\n          color: #00a8ff;\n          font-size: 18px;", ".badge-icon {\n          color: #00a8ff;\n          font-size: 22px;")
    else:
        # Fallback if already modified or slightly different
        content = re.sub(r'(\.badge-icon\s*\{[^}]*font-size:\s*)18px', r'\g<1>22px', content)
        
    # Update badge text font-size
    content = re.sub(r'(\.badge-text\s*\{[^}]*font-size:\s*)15px', r'\g<1>18px', content)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
