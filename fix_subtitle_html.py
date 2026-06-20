import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_html = """            <p class="typography-subtitle">
                Automated, <span class="red-underline short">secure</span>, and instantaneous growth infrastructure for the <span class="red-underline long">modern social media age.</span>
            </p>"""

new_html = """            <p class="typography-subtitle">
                Automated, <span class="red-underline short">secure,</span> and<br>
                instantaneous growth infrastructure<br>
                for the <span class="red-underline long">modern social media age.</span>
            </p>"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # If exact match exists, replace it
    if old_html in content:
        content = content.replace(old_html, new_html)
    else:
        # Fallback regex if spacing is different
        pattern = r'<p class="typography-subtitle">.*?</p>'
        content = re.sub(pattern, new_html, content, flags=re.DOTALL)

    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
