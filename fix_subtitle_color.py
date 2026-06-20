import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_subtitle_style = """      .typography-subtitle {
          color: #d0f4f4;
          font-family: 'Outfit', sans-serif;
          font-size: 26px;"""

new_subtitle_style = """      .typography-subtitle {
          color: #7ae2f5;
          font-family: 'Outfit', sans-serif;
          font-size: 32px;"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_subtitle_style in content:
        content = content.replace(old_subtitle_style, new_subtitle_style)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
