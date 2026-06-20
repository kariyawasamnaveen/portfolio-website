import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

# 1. Update Subtitle HTML
old_html = """<p class="typography-subtitle">
                Automated, <span class="red-underline short">secure</span>, and instantaneous growth infrastructure for the <span class="red-underline long">modern social media age.</span>
            </p>"""

new_html = """<p class="typography-subtitle">
                Automated, <span class="red-underline short">secure,</span> and<br>
                instantaneous growth infrastructure<br>
                for the <span class="red-underline long">modern social media age.</span>
            </p>"""

# 2. Update Title Style
old_title_style = """      .stacked-title {
          font-family: 'Outfit', sans-serif;
          font-size: 100px;
          font-weight: 900;
          line-height: 0.95;
          margin: 0 0 40px 0;
          letter-spacing: -2px;
          background: linear-gradient(to bottom, #F54EA2 0%, #D24CB3 50%, #9E55EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 6px rgba(245, 78, 162, 0.3));
      }"""

new_title_style = """      .stacked-title {
          font-family: 'Outfit', sans-serif;
          font-size: 100px;
          font-weight: 900;
          line-height: 0.95;
          margin: 0 0 40px 0;
          letter-spacing: -2px;
          background: linear-gradient(to bottom, #ff3399 0%, #8833ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 15px rgba(255, 51, 153, 0.4)) drop-shadow(0 0 30px rgba(136, 51, 255, 0.2));
      }"""

# 3. Update Subtitle Color
old_subtitle_style = """      .typography-subtitle {
          color: #e2e8f0;"""

new_subtitle_style = """      .typography-subtitle {
          color: #d0f4f4;"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Apply HTML change
    if old_html in content:
        content = content.replace(old_html, new_html)
        
    # Apply Title Style
    if old_title_style in content:
        content = content.replace(old_title_style, new_title_style)
        
    # Apply Subtitle Style
    if old_subtitle_style in content:
        content = content.replace(old_subtitle_style, new_subtitle_style)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
