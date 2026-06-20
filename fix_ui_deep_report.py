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

    # 1. glass-form-box size and transparency
    content = content.replace("width: 380px;", "width: 480px;")
    content = content.replace("background: rgba(15, 20, 35, 0.6);", "background: rgba(15, 20, 35, 0.15);")
    content = content.replace("backdrop-filter: blur(15px);", "backdrop-filter: blur(4px);")
    content = content.replace("-webkit-backdrop-filter: blur(15px);", "-webkit-backdrop-filter: blur(4px);")
    content = content.replace("padding: 0 0 30px 0;", "padding: 0 0 20px 0;")

    # 2. form-tabs gradient border (rounded corners)
    old_tabs = """.form-tabs {
          display: flex;
          border: 2px solid transparent;
          border-image: linear-gradient(to right, #00f0ff, #ff3399) 1;
          border-bottom: 1px solid rgba(255,255,255,0.05);"""
    
    new_tabs = """.form-tabs {
          display: flex;
          border-top: 2px solid transparent;
          border-left: 2px solid transparent;
          border-right: 2px solid transparent;
          background: linear-gradient(rgba(15, 20, 35, 0.7), rgba(15, 20, 35, 0.7)) padding-box,
                      linear-gradient(90deg, #00f0ff, #ff3399) border-box;
          border-bottom: 1px solid rgba(255,255,255,0.05);"""
    
    if old_tabs in content:
        content = content.replace(old_tabs, new_tabs)

    # 3. form-tabs margin to reduce height
    content = content.replace("margin-bottom: 30px;", "margin-bottom: 20px;")
    
    # 4. Input group margin to reduce height
    content = content.replace(".app-input-group { margin-bottom: 20px; }", ".app-input-group { margin-bottom: 15px; }")

    # 5. Inputs styling (transparency and smooth border)
    old_input = """width: 100%;
          background: rgba(0, 20, 30, 0.4) !important;
          border: 1px solid #00F0FF !important;
          border-radius: 8px !important;
          padding: 14px 16px !important;
          color: #c4e1f0 !important;
          font-size: 13px !important;
          outline: none;
          transition: 0.3s;
          box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);"""
          
    new_input = """width: 100%;
          background: rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(0, 240, 255, 0.6) !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          color: #c4e1f0 !important;
          font-size: 13px !important;
          outline: none;
          transition: 0.3s;
          box-shadow: inset 0 0 5px rgba(0, 240, 255, 0.1);"""
          
    if old_input in content:
        content = content.replace(old_input, new_input)
        
    # 6. Reduce top margin of forgot password
    content = content.replace("margin: 25px auto 0;", "margin: 15px auto 0;")

    # Also fix active tab gradient line if needed, it's currently at the top (before). Let's remove the top line since the border handles it.
    old_active_before = """.form-tab.active::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink));
      }"""
    if old_active_before in content:
        content = content.replace(old_active_before, "/* top line removed */")

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
