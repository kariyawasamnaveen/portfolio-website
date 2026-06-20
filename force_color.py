import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Force border color
    if "border: 2px solid #50d0ea;" in content:
        content = content.replace("border: 2px solid #50d0ea;", "border: 2px solid #50d0ea !important;")
        
    # Force box shadow
    if "box-shadow: 0 0 30px rgba(80, 208, 234, 0.4), inset 0 0 20px rgba(80, 208, 234, 0.2);" in content:
        content = content.replace("box-shadow: 0 0 30px rgba(80, 208, 234, 0.4), inset 0 0 20px rgba(80, 208, 234, 0.2);", "box-shadow: 0 0 30px rgba(80, 208, 234, 0.4), inset 0 0 20px rgba(80, 208, 234, 0.2) !important;")
        
    # Update subtitle color to match the border color but slightly faded
    if "color: #7ae2f5;" in content:
        content = content.replace("color: #7ae2f5;", "color: rgba(80, 208, 234, 0.7) !important;")
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
