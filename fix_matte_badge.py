import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_badge = """.badge-container {
          position: absolute;
          top: 50px;
          left: 50px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 20, 30, 0.6);
          border: 1px solid rgba(82, 210, 233, 0.6);
          padding: 16px 30px;
          border-radius: 30px;
          z-index: 5;
          backdrop-filter: blur(10px);
      }"""

new_badge = """.badge-container {
          position: absolute;
          top: 50px;
          left: 50px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 15, 25, 0.95);
          border: 1px solid #52d2e9;
          padding: 12px 24px;
          border-radius: 30px;
          z-index: 5;
      }"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_badge in content:
        content = content.replace(old_badge, new_badge)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
