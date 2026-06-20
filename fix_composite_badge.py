import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_css_regex = r'/\* BADGE \*/\s*\.badge-container \{.*?\.badge-text \{[^\}]+\}'

new_css = """      /* ADVANCED COMPOSITE BADGE */
      .composite-badge {
          position: absolute;
          top: 50px;
          left: 50px;
          display: flex;
          align-items: center;
          z-index: 10;
          filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.6));
      }
      .badge-seal {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          position: relative;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 2 L58 10 L69 6 L74 16 L85 16 L88 27 L98 32 L94 42 L99 50 L94 58 L98 68 L88 73 L85 84 L74 84 L69 94 L58 90 L50 98 L42 90 L31 94 L26 84 L15 84 L12 73 L2 68 L6 58 L1 50 L6 42 L2 32 L12 27 L15 16 L26 16 L31 6 L42 10 Z' fill='%231b2631' stroke='%234c6270' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='34' fill='url(%23grad)' stroke='%2352d2e9' stroke-width='2'/%3E%3Cdefs%3E%3CradialGradient id='grad' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%2352d2e9' stop-opacity='0.4'/%3E%3Cstop offset='100%25' stop-color='%230b131c' stop-opacity='0.9'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E");
          background-size: cover;
      }
      .badge-seal i {
          color: #52d2e9;
          font-size: 20px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      }
      .badge-textbox {
          background: linear-gradient(90deg, rgba(82, 210, 233, 0.25) 0%, rgba(10, 20, 30, 0.8) 100%);
          border: 1px solid #52d2e9;
          border-left: none;
          border-radius: 0 8px 8px 0;
          padding: 8px 20px 8px 30px;
          margin-left: -20px;
          z-index: 1;
          color: #d1f4ff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          box-shadow: inset 0 0 15px rgba(82, 210, 233, 0.1);
      }"""

old_html_regex = r'<div class="badge-container">\s*<div class="badge-icon"><i class="fa-solid fa-crown"></i></div>\s*<div class="badge-text">PREMIUM GROWTH INFRASTRUCTURE</div>\s*</div>'

new_html = """            <div class="composite-badge">
                <div class="badge-seal"><i class="fa-solid fa-crown"></i></div>
                <div class="badge-textbox">PREMIUM GROWTH INFRASTRUCTURE</div>
            </div>"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Replace CSS
    content = re.sub(old_css_regex, new_css, content, flags=re.DOTALL)
    
    # Replace HTML
    content = re.sub(old_html_regex, new_html, content, flags=re.DOTALL)

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
