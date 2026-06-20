import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_border_block = """          border: 2px solid transparent;
          background: linear-gradient(90deg, #0d0415, #0d0415) padding-box,
                      linear-gradient(45deg, var(--neon-cyan), var(--neon-pink)) border-box;"""

new_border_block = """          border: 2px solid #50d0ea;
          background: #0d0415;"""

old_shadow_wrong = "box-shadow: 0 0 30px rgba(80, 208, 234, 0.2), inset 0 0 20px rgba(80, 208, 234, 0.1);"
new_shadow_original = "box-shadow: 0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.1);"

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
        
    if old_border_block in content:
        content = content.replace(old_border_block, new_border_block)
        
    if old_shadow_wrong in content:
        content = content.replace(old_shadow_wrong, new_shadow_original)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
