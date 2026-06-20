import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Add filter: brightness(0.7); to cosmic-overlay
    if ".cosmic-overlay {" in content and "filter: brightness" not in content:
        content = content.replace("opacity: 1;", "opacity: 1;\n          filter: brightness(0.6);")
    elif "filter: brightness" in content:
        import re
        content = re.sub(r'filter:\s*brightness\([^)]+\);', 'filter: brightness(0.6);', content)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
