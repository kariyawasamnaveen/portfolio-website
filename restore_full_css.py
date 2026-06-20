import os
import re

files = [
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_in.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/sign_up.php',
    '/Applications/MAMP/htdocs/social-engagement-engine/themes/nico/views/forgot_password.php'
]

css_block = """      /* EXACT IMAGE MATCH SYSTEM */
      :root {
          --neon-pink: #FF007F;
          --neon-cyan: #00F0FF;
          --neon-purple: #8B5CF6;
      }

      body, html { 
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
      }

      .navbar, .footer, .navbar-custom, footer { display: none !important; }

      /* OUTER GLOWING CONTAINER */
      .app-wrapper {
          width: 96vw;
          height: 93vh;
          max-width: 1900px;
          border-radius: 15px;
          border: 2px solid #52d2e9 !important;
          background: #0d0415;
          display: flex;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          position: relative;
      }

      /* LEFT PANEL: Cosmic (70%) */
      .cosmic-panel {
          flex: 7;
          position: relative;
          background: radial-gradient(circle at center, #1a0b2e 0%, #05020a 100%);
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          padding: 50px;
          border-right: 1px solid rgba(255,255,255,0.05);
      }

      .cosmic-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: url("<?=BASE?>assets/images/bg-wave.png");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: bottom left;
          opacity: 1;
          filter: brightness(0.6);
          z-index: 0;
      }

      /* BADGE */
      .badge-container {
          position: absolute;
          top: 50px;
          left: 50px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 15, 25, 0.95);
          border: 1px solid #52d2e9;
          padding: 12px 24px;
          border-radius: 30px;
          z-index: 5;
      }
      .badge-icon {
          color: #52d2e9;
          font-size: 22px;
      }
      .badge-text {
          font-family: 'Outfit', sans-serif;
          color: #52d2e9;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
      }

      /* FORM BOX */
      .glass-form-box {
          position: relative;
          z-index: 5;
          width: 480px;
          max-height: 80vh;
          background: rgba(15, 20, 35, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 0 0 20px 0;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
      }

      .form-tabs {
          display: flex;
          border-top: 2px solid transparent;
          border-left: 2px solid transparent;
          border-right: 2px solid transparent;
          background: linear-gradient(rgba(15, 20, 35, 0.7), rgba(15, 20, 35, 0.7)) padding-box,
                      linear-gradient(90deg, #00f0ff, #ff3399) border-box;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 25px;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
          overflow: hidden;
          flex-shrink: 0;
      }
      .form-tab {
          flex: 1;
          text-align: center;
          padding: 20px 0;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          position: relative;
          background: rgba(0,0,0,0.2);
          transition: 0.3s;
      }
      .form-tab.active {
          color: #fff;
          background: transparent;
      }
      .form-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 10%; width: 80%; height: 3px;
          background: linear-gradient(90deg, var(--neon-pink), transparent);
      }

      .form-inner {
          padding: 0 30px;
          overflow-y: auto;
      }
      .form-inner::-webkit-scrollbar { width: 4px; }
      .form-inner::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.3); border-radius: 4px; }

      .app-input-group { margin-bottom: 15px; }
      .app-input-group label {
          display: block;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.5px;
          font-size: 10px;
          color: #a0a0a0;
          margin-bottom: 6px;
          font-weight: 600;
      }
      
      .app-input-group input,
      .app-input-group select {
          width: 100%;
          background: rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(0, 240, 255, 0.6) !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          color: #c4e1f0 !important;
          font-size: 13px !important;
          outline: none;
          transition: 0.3s;
          appearance: none;
      }
      .app-input-group select {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300F0FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
          background-position: right 16px center !important;
          background-repeat: no-repeat !important;
          background-size: 16px !important;
          padding-right: 40px !important;
      }

      .custom-checkbox-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-left: 5px;
      }
      .custom-checkbox-wrapper input[type="checkbox"] {
          width: 14px;
          height: 14px;
          margin-right: 10px;
          accent-color: var(--neon-pink);
          cursor: pointer;
      }
      .custom-checkbox-wrapper label {
          font-size: 14px;
          color: #a0a0a0;
          cursor: pointer;
          margin: 0;
      }
      .custom-checkbox-wrapper a {
          color: #52d2e9;
          text-decoration: none;
      }

      .social-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #a0a0a0;
      }
      .social-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: #a0a0a0;
      }
      .social-btn:hover { color: #fff; border-color: #fff; }
      
      .social-btn.google { border: 2px solid #52d2e9 !important; border-radius: 12px; }
      .social-btn.google i { background: conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }
      .social-btn.linkedin { border: 2px solid #ff3399 !important; border-radius: 12px; color: #52d2e9 !important; }

      .app-btn-submit {
          width: 100%;
          background: linear-gradient(90deg, #FF007F, #D946EF) !important;
          color: #fff !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 16px !important;
          font-family: 'Outfit', sans-serif !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 5px;
      }
      .app-btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4) !important;
      }

      /* LOGO */
      .massive-logo {
          height: 550px;
          margin-left: 0px;
          width: auto;
          position: relative;
          z-index: 5;
          animation: floatLogo 6s ease-in-out infinite;
      }
      @keyframes floatLogo {
          0% { transform: translate(40px, 0px) scale(1.1); }
          50% { transform: translate(40px, -15px) scale(1.1); }
          100% { transform: translate(40px, 0px) scale(1.1); }
      }

      /* RIGHT PANEL: Typography (30%) */
      .typography-panel {
          flex: 3;
          background-color: #000000;
          background: radial-gradient(80% 80% at 100% 0%, rgba(240, 69, 121, 0.35) 0%, rgba(0, 0, 0, 1) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 60px;
          position: relative;
          z-index: 5;
      }

      .stacked-title {
          font-family: 'Outfit', sans-serif;
          font-size: 100px;
          font-weight: 900;
          line-height: 0.95;
          margin: 0 0 40px 0;
          letter-spacing: -2px;
          background: linear-gradient(to bottom, #F54EA2 0%, #D24CB3 50%, #9E55EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 0px 8px rgba(210, 76, 179, 0.4));
      }

      .typography-subtitle {
          white-space: nowrap;
          color: rgba(82, 210, 233, 0.8) !important;
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          line-height: 1.6;
          font-weight: 400;
          max-width: 100%;
      }

      /* Hand-drawn red underlines */
      .red-underline {
          position: relative;
          display: inline-block;
      }
      .red-underline.short::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 10 Q 25 6, 50 9 T 98 8' stroke='%23ff3399' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }
      .red-underline.long::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: -2%;
          width: 104%;
          height: 7px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 15' preserveAspectRatio='none'%3E%3Cpath d='M2 9 Q 30 12, 60 7 T 98 10' stroke='%23ff3399' stroke-width='3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-size: 100% 100%;
          background-repeat: no-repeat;
      }
      
      .alert-message-reponse {
          font-weight: 600 !important;
          font-size: 12px !important;
          margin-top: 15px;
          text-align: center;
      }
      .forgot-text {
          font-size: 14px;
          color: #a0a0a0;
          text-decoration: none;
          display: block;
          text-align: center;
          margin: 15px auto 0;
          width: max-content;
          border-bottom: 2px solid #ff3399;
          padding-bottom: 3px;
          transition: 0.3s;
      }

      /* MOBILE RESPONSIVE */
      @media (max-width: 1200px) {
          .stacked-title { font-size: 50px; }
          .massive-logo { height: 280px; }
          .glass-form-box { width: 320px; }
      }
      @media (max-width: 991px) {
          .app-wrapper { flex-direction: column; height: 100vh; width: 100vw; border-radius: 0; border: none; overflow-y: auto; }
          .cosmic-panel { flex-direction: column; padding: 100px 20px 40px 20px; min-height: 80vh; }
          .typography-panel { padding: 40px 20px; align-items: center; text-align: center; }
          .badge-container { top: 20px; left: 20px; }
          .massive-logo { height: 200px; margin: 40px 0; }
          .glass-form-box { width: 100%; max-width: 500px; }
          body, html { display: block; overflow-y: auto; }
      }"""

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()

    # Find everything between <style> and </style> and replace it
    start_tag = "<style>"
    end_tag = "</style>"
    
    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx + len(start_tag)] + "\n" + css_block + "\n  " + content[end_idx:]
        
        # Also ensure no stray text at the beginning of the file (just to be 1000% safe)
        if new_content.startswith('pako'):
            new_content = re.sub(r'^pako.*?<\!DOCTYPE html>', '<!DOCTYPE html>', new_content)
            
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

print("Done.")
