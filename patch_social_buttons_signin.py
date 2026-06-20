import re

file_path = '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php'

with open(file_path, 'r') as f:
    content = f.read()

# CSS Fix
if ".social-btn {" in content:
    content = content.replace(".social-btn {\n", ".social-btn {\n          text-decoration: none !important;\n")

# HTML Replace
old_html = """                        <div class="social-login">
                            Sign in with
                            <div class="social-btn google"><i class="fa-brands fa-google"></i></div>
                            <div class="social-btn linkedin"><i class="fa-brands fa-linkedin-in"></i></div>
                        </div>"""

new_html = """                        <?php if ((isset($google_login_url) && $google_login_url != '') || (isset($linkedin_login_url) && $linkedin_login_url != '')): ?>
                        <div class="social-login">
                            Sign in with
                            <?php if (isset($google_login_url) && $google_login_url != ''): ?>
                            <a href="<?=$google_login_url?>" class="social-btn google"><i class="fa-brands fa-google"></i></a>
                            <?php endif; ?>
                            <?php if (isset($linkedin_login_url) && $linkedin_login_url != ''): ?>
                            <a href="<?=$linkedin_login_url?>" class="social-btn linkedin"><i class="fa-brands fa-linkedin-in"></i></a>
                            <?php endif; ?>
                        </div>
                        <?php endif; ?>"""

content = content.replace(old_html, new_html)

with open(file_path, 'w') as f:
    f.write(content)

print("sign_in.php patched.")
