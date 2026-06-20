import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

replacements = {
    r'width: 95vw;': 'width: 98vw;',
    r'height: 90vh;': 'height: 97vh;',
    r'max-width: 1600px;': 'max-width: 1900px;',
    r'top: 40px;': 'top: 50px;',
    r'left: 40px;': 'left: 50px;',
    r'padding: 8px 16px;': 'padding: 12px 24px;',
    r'font-size: 12px;': 'font-size: 15px;',
    r'font-size: 14px;': 'font-size: 18px;',
    r'width: 400px;': 'width: 500px;',
    r'padding: 15px;': 'padding: 20px;',
    r'font-size: 16px;': 'font-size: 20px;',
    r'padding: 40px;': 'padding: 50px;',
    r'font-size: 11px;': 'font-size: 14px;',
    r'margin-bottom: 8px;': 'margin-bottom: 12px;',
    r'padding: 16px;': 'padding: 22px;',
    r'font-size: 13px;': 'font-size: 16px;',
    r'margin-top: 25px;': 'margin-top: 35px;',
    r'width: 36px;': 'width: 45px;',
    r'height: 36px;': 'height: 45px;',
    r'font-size: 15px;': 'font-size: 19px;',
    r'margin-top: 10px;': 'margin-top: 15px;',
    r'margin-top: 20px;': 'margin-top: 25px;',
    r'height: 380px;': 'height: 480px;',
    r'padding: 60px 40px;': 'padding: 80px 60px;',
    r'font-size: 65px;': 'font-size: 85px;',
    r'margin: 0 0 30px 0;': 'margin: 0 0 40px 0;',
    r'font-size: 17px;': 'font-size: 23px;',
    r'height: 5px;': 'height: 7px;',
    r'bottom: -4px;': 'bottom: -6px;'
}

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Split into CSS block and HTML block to avoid breaking HTML
    start_style = content.find('<style>')
    end_style = content.find('</style>')
    
    if start_style != -1 and end_style != -1:
        css = content[start_style:end_style]
        html = content[end_style:]
        
        for old, new in replacements.items():
            css = css.replace(old, new)
            
        new_content = content[:start_style] + css + html
        
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

print("Done.")
