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

    # 1. Revert Logo Size
    if "height: 700px;" in content and "margin-left: 120px;" in content:
        content = content.replace("height: 700px;\n          margin-left: 120px;", "height: 550px;\n          margin-left: 0px;")

    # 2. Fix Form Tabs Border 
    # Add a pseudo element to .form-tabs to create the gradient border-top and border-sides effect
    if ".form-tabs {" in content and "border-image" not in content:
        content = content.replace(".form-tabs {\n          display: flex;", ".form-tabs {\n          display: flex;\n          border: 2px solid transparent;\n          border-image: linear-gradient(to right, #00f0ff, #ff3399) 1;")

    # 3. Fix Input text color (remove bright cyan text color)
    if "color: #00F0FF !important;" in content:
        content = content.replace("color: #00F0FF !important;", "color: #c4e1f0 !important;")

    # 4. Fix Social Buttons Border and Colors
    if ".social-btn.google i {" in content:
        old_social = ".social-btn.google i { background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }\n      .social-btn.linkedin { color: #0A66C2; border-color: rgba(10, 102, 194, 0.5); }"
        new_social = ".social-btn.google { border: 2px solid #00a8ff !important; border-radius: 12px; }\n      .social-btn.google i { background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }\n      .social-btn.linkedin { border: 2px solid #ff3399 !important; border-radius: 12px; color: #00a8ff !important; }"
        if old_social in content:
            content = content.replace(old_social, new_social)

    # 5. Fix Forgot Password Underline
    old_forgot = """      .forgot-text {
          font-size: 14px;
          color: #a0a0a0;
          text-decoration: none;
          display: block;
          text-align: center;
          margin-top: 25px;
          transition: 0.3s;
      }"""
    new_forgot = """      .forgot-text {
          font-size: 14px;
          color: #a0a0a0;
          text-decoration: none;
          display: block;
          text-align: center;
          margin: 25px auto 0;
          width: max-content;
          border-bottom: 2px solid #ff3399;
          padding-bottom: 3px;
          transition: 0.3s;
      }"""
    if old_forgot in content:
        content = content.replace(old_forgot, new_forgot)

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
