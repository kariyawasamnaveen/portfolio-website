import re

file_path = '/Applications/MAMP/htdocs/social-engagement-engine/app/modules/auth/controllers/auth.php'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Add class properties
content = content.replace(
    'public $social_login_google_enable;',
    'public $social_login_google_enable;\n    public $linkedin_auth;\n    public $social_login_linkedin_enable;'
)

# 2. Add constructor logic
linkedin_construct = """
        // LinkedIn
        $this->social_login_linkedin_enable = get_option("social_login_linkedin_enable", '');
        $linkedin_client_id = get_option('social_login_linkedin_app_id');
        $linkedin_client_secret = get_option('social_login_linkedin_secret_key');
        if ($this->social_login_linkedin_enable && $linkedin_client_id != "" && $linkedin_client_secret != "") {
            $this->load->library('Linkedinauth');
            $this->linkedin_auth = new Linkedinauth();
        }

        if (session("uid")"""
content = content.replace('if (session("uid")', linkedin_construct)

# 3. Update login()
login_old = """    public function login()
    {
        $this->lang->load('../../../../themes/' . get_theme() . '/language/english/' . get_theme());
        $data = [
            'social_login_html' => $this->generate_social_login_html('login')
        ];
        $this->template->set_layout('blank_page');
        $this->template->build('../../../themes/' . get_theme() . '/views/sign_in', $data);
    }"""
login_new = """    public function login()
    {
        $this->lang->load('../../../../themes/' . get_theme() . '/language/english/' . get_theme());
        $google_login_url = isset($this->google_auth) ? $this->google_auth->createLoginUrl() : '';
        $linkedin_login_url = isset($this->linkedin_auth) ? $this->linkedin_auth->createLoginUrl() : '';
        $data = [
            'social_login_html' => $this->generate_social_login_html('login'),
            'google_login_url' => $this->social_login_google_enable ? $google_login_url : '',
            'linkedin_login_url' => $this->social_login_linkedin_enable ? $linkedin_login_url : ''
        ];
        $this->template->set_layout('blank_page');
        $this->template->build('../../../themes/' . get_theme() . '/views/sign_in', $data);
    }"""
content = content.replace(login_old, login_new)

# 4. Update signup()
signup_old = """    public function signup()
    {
        if (get_option('disable_signup_page')) {
            redirect(cn('auth/login'));
        }
        $this->lang->load('../../../../themes/' . get_theme() . '/language/english/' . get_theme());
        $data = [
            'social_login_html' => $this->generate_social_login_html('signup')
        ];
        $this->template->set_layout('blank_page');
        $this->template->build('../../../themes/' . get_theme() . '/views/sign_up', $data);
    }"""
signup_new = """    public function signup()
    {
        if (get_option('disable_signup_page')) {
            redirect(cn('auth/login'));
        }
        $this->lang->load('../../../../themes/' . get_theme() . '/language/english/' . get_theme());
        $google_login_url = isset($this->google_auth) ? $this->google_auth->createLoginUrl() : '';
        $linkedin_login_url = isset($this->linkedin_auth) ? $this->linkedin_auth->createLoginUrl() : '';
        $data = [
            'social_login_html' => $this->generate_social_login_html('signup'),
            'google_login_url' => $this->social_login_google_enable ? $google_login_url : '',
            'linkedin_login_url' => $this->social_login_linkedin_enable ? $linkedin_login_url : ''
        ];
        $this->template->set_layout('blank_page');
        $this->template->build('../../../themes/' . get_theme() . '/views/sign_up', $data);
    }"""
content = content.replace(signup_old, signup_new)

# 5. Add LinkedIn Callback logic
linkedin_callback = """        } else if ($type == 'linkedin') {
            $user_info = $this->linkedin_auth->handleCallback();
            if ($user_info) {
                $email = $user_info->email;
                $item_user = $this->model->get('id, status, ids, email, password, first_name, last_name, timezone', $this->tb_users, ['email' => $email, 'login_type' => 'linkedin_login']);
                if (!empty($item_user)) {
                    set_session('uid', $item_user->id);
                    $data_session = array(
                        'email'         => $email,
                        'first_name'    => $item_user->first_name,
                        'last_name'     => $item_user->last_name,
                        'timezone'      => $item_user->timezone,
                    );
                    set_session('user_current_info', $data_session);
                    $this->insert_user_activity_logs('login');
                } else { 
                    $limit_payments = $this->model->get_payments_list_for_new_user();
                    $settings = ['limit_payments' => $limit_payments];
                    $item_new_user = array(
                        "ids"            => ids(),
                        "first_name"     => $user_info->givenName,
                        "last_name"      => $user_info->familyName,
                        "email"          => $email,
                        "login_type"     => 'linkedin_login',
                        "password"       => '',
                        "timezone"       => 'UTC',
                        "status"         => 1,
                        "api_key"        => create_random_string_key(32),
                        "settings"       => json_encode($settings),
                        'history_ip'     => get_client_ip(),
                        "reset_key"      => create_random_string_key(32),
                        "activation_key" => create_random_string_key(32),
                        "created"        => NOW,
                        "changed"        => NOW,
                    );
                    if ($this->db->insert($this->tb_users, $item_new_user)) {
                        $uid = $this->db->insert_id();
                        set_session('uid', $uid);
                        $data_session = array('email' => $email, 'first_name' => $user_info->givenName, 'last_name' => $user_info->familyName, 'timezone' => 'UTC');
                        set_session('user_current_info', $data_session);
                        $this->insert_user_activity_logs('login');
                        if (get_option("is_welcome_email", '')) {
                            $this->model->send_email(get_option('email_welcome_email_subject', ''), get_option('email_welcome_email_content', 0), $uid);
                        }
                    }       
                }
                if (session('uid')) {
                    redirect(cn('home'));
                }
            }
        }
        redirect(cn('auth/login'));"""

content = content.replace("        }\n        redirect(cn('auth/login'));", linkedin_callback)

with open(file_path, 'w') as f:
    f.write(content)

print("auth.php patched.")
