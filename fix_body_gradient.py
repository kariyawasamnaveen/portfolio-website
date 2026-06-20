import os

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

old_css = """      body, html { 
          background-color: #0d0415 !important;
          color: #fff !important; 
          font-family: 'Poppins', sans-serif !important; 
          min-height: 100vh;
          overflow: hidden;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
      }"""

new_css = """      body, html { 
          background: radial-gradient(circle at top left, rgba(255, 0, 127, 0.25) 0%, rgba(13, 4, 21, 1) 50%, #000000 100%) !important;
          color: #fff !important; 
          font-family: 'Poppins', sans-serif !important; 
          min-height: 100vh;
          overflow: hidden;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
      }"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Fallback to precise replacement if exact string doesn't match perfectly
    if "background-color: #0d0415 !important;" in content:
        content = content.replace("background-color: #0d0415 !important;", "background: radial-gradient(circle at top left, rgba(255, 0, 127, 0.25) 0%, rgba(13, 4, 21, 1) 50%, #000000 100%) !important;")
        
    with open(file_path, 'w') as f:
        f.write(content)
    print(f"Updated {file_path}")

print("Done.")
