import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # The HTML block to replace
    old_html = """                        <?php if ((isset($google_login_url) && $google_login_url != '') || (isset($linkedin_login_url) && $linkedin_login_url != '')): ?>
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
    
    # We will just always show them, using javascript:void(0) if url is not set
    new_html_signin = """                        <div class="social-login">
                            Sign in with
                            <a href="<?=(isset($google_login_url) && $google_login_url != '') ? $google_login_url : 'javascript:void(0)'?>" class="social-btn google"><i class="fa-brands fa-google"></i></a>
                            <a href="<?=(isset($linkedin_login_url) && $linkedin_login_url != '') ? $linkedin_login_url : 'javascript:void(0)'?>" class="social-btn linkedin"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>"""

    new_html_signup = """                        <div class="social-login">
                            Sign up with
                            <a href="<?=(isset($google_login_url) && $google_login_url != '') ? $google_login_url : 'javascript:void(0)'?>" class="social-btn google"><i class="fa-brands fa-google"></i></a>
                            <a href="<?=(isset($linkedin_login_url) && $linkedin_login_url != '') ? $linkedin_login_url : 'javascript:void(0)'?>" class="social-btn linkedin"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>"""

    if 'sign_in.php' in file_path:
        content = content.replace(old_html, new_html_signin)
    else:
        old_html_signup = old_html.replace('Sign in with', 'Sign up with')
        content = content.replace(old_html_signup, new_html_signup)

    with open(file_path, 'w') as f:
        f.write(content)
        print(f"{file_path} patched.")

print("Done.")
