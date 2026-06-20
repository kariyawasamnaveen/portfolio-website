import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_short_underline = """      .red-underline.short::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 10 Q 25 6, 50 9 T 98 8' stroke='%23F54EA2' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }"""

new_short_underline = """      .red-underline.short::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 10 Q 25 6, 50 9 T 98 8' stroke='%23ff3399' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }"""

old_long_underline = """      .red-underline.long::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 9 Q 30 12, 60 7 T 98 10' stroke='%23F54EA2' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }"""

new_long_underline = """      .red-underline.long::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 9 Q 30 12, 60 7 T 98 10' stroke='%23ff3399' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }"""


for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_short_underline in content:
        content = content.replace(old_short_underline, new_short_underline)
        
    if old_long_underline in content:
        content = content.replace(old_long_underline, new_long_underline)
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated underlines {file_path}")

print("Done.")
