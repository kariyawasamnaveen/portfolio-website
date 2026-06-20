import os

file_path = '/Applications/MAMP/htdocs/social-engagement-engine/app/modules/admin/views/settings/elements/social_login.php'

content = """
<?php
  $form_url = admin_url($controller_name."/store/");
?>
<div class="card content">
  <div class="card-header">
    <h3 class="card-title"><i class="fe fe-share-2"></i> Social Login Integrations</h3>
  </div>
  <div class="card-body">
    <form class="actionForm" action="<?=$form_url?>" method="POST" data-redirect="<?=admin_url($controller_name."/social_login")?>">
      
      <div class="row">
        <!-- Google Login -->
        <div class="col-md-12">
          <h5 class="m-t-10"><i class="fa fa-google text-danger"></i> Google Login</h5>
          <hr>
          <div class="form-group">
            <label class="custom-switch">
              <input type="hidden" name="social_login_google_enable" value="0">
              <input type="checkbox" name="social_login_google_enable" class="custom-switch-input" value="1" <?=(get_option('social_login_google_enable', 0) == 1) ? 'checked' : ''?>>
              <span class="custom-switch-indicator"></span>
              <span class="custom-switch-description">Enable Google Login</span>
            </label>
          </div>
          <div class="form-group">
            <label>Google Client ID</label>
            <input class="form-control" name="social_login_google_app_id" value="<?=get_option('social_login_google_app_id', '')?>">
          </div>
          <div class="form-group">
            <label>Google Client Secret</label>
            <input class="form-control" name="social_login_google_secret_key" value="<?=get_option('social_login_google_secret_key', '')?>">
          </div>
        </div>

        <!-- LinkedIn Login -->
        <div class="col-md-12 m-t-30">
          <h5 class="m-t-10"><i class="fa fa-linkedin text-info"></i> LinkedIn Login</h5>
          <hr>
          <div class="form-group">
            <label class="custom-switch">
              <input type="hidden" name="social_login_linkedin_enable" value="0">
              <input type="checkbox" name="social_login_linkedin_enable" class="custom-switch-input" value="1" <?=(get_option('social_login_linkedin_enable', 0) == 1) ? 'checked' : ''?>>
              <span class="custom-switch-indicator"></span>
              <span class="custom-switch-description">Enable LinkedIn Login</span>
            </label>
          </div>
          <div class="form-group">
            <label>LinkedIn Client ID</label>
            <input class="form-control" name="social_login_linkedin_app_id" value="<?=get_option('social_login_linkedin_app_id', '')?>">
          </div>
          <div class="form-group">
            <label>LinkedIn Client Secret</label>
            <input class="form-control" name="social_login_linkedin_secret_key" value="<?=get_option('social_login_linkedin_secret_key', '')?>">
          </div>
        </div>

      </div>

      <div class="form-footer">
        <button class="btn btn-primary btn-min-width btn-lg text-uppercase"><?=lang("Save")?></button>
      </div>
    </form>
  </div>
</div>
"""

with open(file_path, 'w') as f:
    f.write(content)

print(f"Created {file_path}")
