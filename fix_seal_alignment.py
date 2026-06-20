import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # We add transform: translate(4px, -2px); to .badge-seal
    if ".badge-seal {" in content:
        # Check if transform already exists
        if "transform: translate(" not in content.split(".badge-seal {")[1].split("}")[0]:
            content = content.replace(".badge-seal {", ".badge-seal {\n          transform: translate(4px, -2px);")
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
