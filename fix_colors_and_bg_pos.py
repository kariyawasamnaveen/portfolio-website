import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Update hex color #00a8ff to #52d2e9
    content = content.replace("#00a8ff", "#52d2e9")
    
    # Update rgb rgba(0, 168, 255 to rgba(82, 210, 233
    content = content.replace("rgba(0, 168, 255", "rgba(82, 210, 233")
    
    # Move background image to the right to show the left side
    content = content.replace("background-position: bottom center;", "background-position: bottom left;")
    
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
