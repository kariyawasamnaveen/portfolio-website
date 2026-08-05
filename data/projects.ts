export interface Project {
    id: string;
    title: string;
    tagline: string;
    problem: string;
    solution: string;
    metrics: { label: string; value: string }[];
    tech: string[];
    video: string | string[];
    images: string[];
    link: string;
    github?: string;
    role: string;
    deepDive?: {
        story: string;
        architecture: string;
        features: string[];
    };
}

export const PROJECTS_DATA: Project[] = [
    {
        id: 'shemet',
        title: 'Shemet Dating & Live',
        tagline: 'Real-time Dating with AR Video & Secure Matchmaking',
        problem: 'Modern dating apps often suffer from an influx of fake profiles and lack secure, real-time communication tools, leaving users vulnerable and hesitant to connect genuinely.',
        solution: 'Architected a highly secure, real-time ecosystem utilizing Google ML-Kit for automated face verification to eliminate fake profiles, alongside Agora and DeepAR for immersive, end-to-end encrypted video dates.',
        metrics: [
            { label: 'Live Video', value: 'Agora + DeepAR' },
            { label: 'Verification', value: 'Google ML Kit' },
            { label: 'Security', value: 'E2E Encrypted' }
        ],
        tech: ['Flutter', 'Firebase Functions', 'Agora', 'DeepAR', 'Google ML Kit', 'Encrypt'],
        video: [
            'https://www.youtube.com/embed/6ucpyvfcvMA?autoplay=1&mute=1&loop=1&playlist=6ucpyvfcvMA',
            'https://www.youtube.com/embed/bBP7cFm28Is?autoplay=1&mute=1&loop=1&playlist=bBP7cFm28Is'
        ],
        images: [
            '/projects/shemet/hero.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.29.10.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.31.21.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.31.48.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.31.59.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.32.20.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.48.04.png',
            '/projects/shemet/Screenshot 2026-05-15 at 20.56.09.png',
            '/projects/shemet/Screenshot 2026-05-15 at 21.21.35.png',
            '/projects/shemet/Screenshot 2026-05-15 at 21.21.42.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.30.29.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.30.50.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.31.03.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.32.53.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.33.02.png',
            '/projects/shemet/Screenshot 2026-05-16 at 00.33.33.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.22.46.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.22.52.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.11.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.16.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.20.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.27.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.34.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.23.55.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.00.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.12.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.16.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.21.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.51.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.24.55.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.25.29.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.25.33.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.25.37.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.25.56.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.00.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.05.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.10.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.16.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.26.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.31.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.26.35.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.30.15.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.30.22.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.30.30.png',
            '/projects/shemet/Screenshot 2026-05-16 at 10.31.53.png',
            '/projects/shemet/Screenshot_1778857002.png',
            '/projects/shemet/Screenshot_1778867042.png',
            '/projects/shemet/Screenshot_1778867048.png',
            '/projects/shemet/Screenshot_1778867058.png',
            '/projects/shemet/Screenshot_1778867073.png',
            '/projects/shemet/Screenshot_1778867080.png',
            '/projects/shemet/Screenshot_1778867090.png',
            '/projects/shemet/Screenshot_1778867362.png',
            '/projects/shemet/Screenshot_1778872796.png',
            '/projects/shemet/Screenshot_1778872799.png',
            '/projects/shemet/Screenshot_1778872801.png',
            '/projects/shemet/Screenshot_1778872805.png',
            '/projects/shemet/Screenshot_1778872806.png',
            '/projects/shemet/Screenshot_1778872808.png',
            '/projects/shemet/Screenshot_1778872811.png',
            '/projects/shemet/Screenshot_1778872814.png',
            '/projects/shemet/Screenshot_1778872948.png',
            '/projects/shemet/Screenshot_1778872956.png',
            '/projects/shemet/Screenshot_1778872962.png',
            '/projects/shemet/Screenshot_1778873150.png',
            '/projects/shemet/Screenshot_1778873154.png',
            '/projects/shemet/Screenshot_1778873158.png',
            '/projects/shemet/Screenshot_1778873180.png',
            '/projects/shemet/Screenshot_1778873187.png',
            '/projects/shemet/Screenshot_1778873225.png',
            '/projects/shemet/Screenshot_1778875987.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/shemet',
        github: 'https://github.com/kariyawasamnaveen/shemet',
        role: 'Lead Mobile & Backend Developer',
        deepDive: {
            story: 'Shemet was created to revolutionize the digital dating landscape by prioritizing absolute user safety and real-time engagement. The core motivation was to move beyond static, swipe-based interfaces and foster genuine connections. To achieve this, we integrated advanced AI for profile verification and Augmented Reality (AR) to make real-time video dates more interactive and secure. The UI was designed with a premium dark-mode aesthetic, utilizing neon gradients to create an immersive, futuristic matchmaking environment.',
            architecture: 'Engineered as a comprehensive ecosystem, Shemet relies on Flutter for cross-platform performance and Firebase Cloud Functions for a scalable, serverless backend.\n\n1. Real-time Video & AR Engine: Leverages `agora_rtc_engine` for high-fidelity, low-latency video streaming, seamlessly integrated with `deepar_flutter_plus` to overlay 3D Augmented Reality face filters dynamically during live dates.\n\n2. AI-Powered Verification: Implements `google_mlkit_face_detection` to autonomously scan user uploads against real-time camera feeds, verifying human presence and strictly eliminating catfishing and bots.\n\n3. Advanced Location Matching: Utilizes the `geolocator` package within a highly optimized matchmaking algorithm to connect users based on precise, dynamic proximity ranges.\n\n4. Military-Grade Privacy: Integrates the `crypto` and `encrypt` packages to establish End-to-End Encryption (E2E) for all private text and audio (`just_audio`) messages, ensuring user conversations remain completely confidential.',
            features: [
                'Real-time Video Streaming with DeepAR Face Filters',
                'Google ML-Kit Powered Automated Profile Verification',
                'End-to-End Encrypted Audio & Text Messaging',
                'Advanced Geolocator Matchmaking Algorithm',
                'Serverless Backend Architecture via Firebase Cloud Functions'
            ]
        }
    },
    {
        id: 'habit-tracker',
        title: 'Habit Flow Tracker',
        tagline: 'Offline-First Daily Habit Builder',
        problem: 'Users often struggle with overly complex, internet-dependent apps to track their simple daily habits, leading to inconsistent tracking and loss of motivation.',
        solution: 'Developed a lightning-fast, 100% offline mobile application that securely stores data locally while utilizing native background scheduling to deliver timely habit reminders without requiring any internet connection.',
        metrics: [
            { label: 'Architecture', value: 'Offline-First' },
            { label: 'Typography', value: 'Google Fonts' },
            { label: 'Notifications', value: 'Local Push' }
        ],
        tech: ['Flutter', 'Dart', 'Shared Preferences', 'Local Notifications'],
        video: 'https://www.youtube.com/embed/hPa5ghLaM3k?autoplay=1&mute=1&loop=1&playlist=hPa5ghLaM3k',
        images: [
            '/projects/habit-tracker/hero.png',
            '/projects/habit-tracker/1_user_registration.png',
            '/projects/habit-tracker/2_user_login.png',
            '/projects/habit-tracker/3_profile_setup.png',
            '/projects/habit-tracker/4_add_habit.png',
            '/projects/habit-tracker/5_home_dashboard_api.png',
            '/projects/habit-tracker/6_habit_interaction.png',
            '/projects/habit-tracker/7_navigation_drawer.png',
            '/projects/habit-tracker/8_push_notifications.png',
            '/projects/habit-tracker/9_progress_chart.png',
            '/projects/habit-tracker/Screenshot 2026-06-01 at 01.22.55.png',
            '/projects/habit-tracker/Screenshot 2026-06-01 at 01.32.30.png',
            '/projects/habit-tracker/figma-evidence1.png',
            '/projects/habit-tracker/figma-evidence2.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/habit-tracker-app',
        github: 'https://github.com/kariyawasamnaveen/habit-tracker-app',
        role: 'Mobile UI/UX Developer',
        deepDive: {
            story: 'Building daily habits requires an application that is fast, reliable, and accessible instantly. To achieve this, I designed Habit Flow Tracker with a strict "Offline-First" philosophy. The primary goal was to remove the latency of cloud syncing, ensuring the app opens instantly without loading screens. The UI was crafted using a minimal aesthetic with deep blue (#0052CC) accents and custom typography to make the daily tracking experience visually pleasing and completely distraction-free.',
            architecture: 'Built entirely using Flutter, the application completely bypasses external cloud databases to prioritize speed and privacy.\n\n1. Offline-First Storage: Replaces traditional cloud databases with a custom `DataManager` wrapper around `shared_preferences`. All user data, habits, and daily progress logs are encoded as JSON and stored securely on the device for zero-latency data access.\n\n2. Background Reminders: Utilizes `flutter_local_notifications` combined with the `timezone` package. The `NotificationService` runs in the background to schedule perfectly timed, localized push notifications entirely offline, guaranteeing users never miss a habit.\n\n3. Dynamic UI/UX Engineering: Implements `google_fonts` to provide premium typography that dynamically scales. The `device_preview` package is deeply integrated into the app\'s root (`main.dart`) to ensure pixel-perfect layout testing across iOS, Android, and web interfaces during development.',
            features: [
                '100% Offline Data Persistence via Custom JSON Caching',
                'Custom Scheduled Local Push Notifications (NotificationService)',
                'Dynamic Habit Categorization & Progress Tracking',
                'Responsive Interface rigorously tested with DevicePreview',
                'Instant App Load Times with Zero Network Latency'
            ]
        }
    },
    {
        id: 'fitness-tracker',
        title: 'Fitness Tracker Pro',
        tagline: 'Smart Health & Activity Monitor',
        problem: 'Users need a centralized, intuitive platform to aggregate daily physical activities, track sleep patterns, and visualize their overall health metrics from scattered ecosystem data.',
        solution: 'Developed a comprehensive cross-platform mobile application that directly syncs with Apple Health and Google Fit, providing an interactive, unified dashboard for daily health tracking and goals.',
        metrics: [
            { label: 'Ecosystem Sync', value: 'Apple/Google' },
            { label: 'Security', value: 'Biometric' },
            { label: 'Data Vis', value: 'Interactive' }
        ],
        tech: ['Flutter', 'Dart', 'Firebase', 'HealthKit API'],
        video: 'https://www.youtube.com/embed/5aq0sBCcZ_I?autoplay=1&mute=1&loop=1&playlist=5aq0sBCcZ_I',
        images: [
            '/projects/fitness-tracker/hero.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.13.55.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.14.02.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.14.55.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.15.43.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.15.54.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.16.03.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.16.14.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.16.23.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.16.36.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.16.59.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.17.12.png',
            '/projects/fitness-tracker/Screenshot 2026-06-25 at 12.17.21.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/fitness-tracker-app',
        github: 'https://github.com/kariyawasamnaveen/fitness-tracker-app',
        role: 'Full Stack Mobile Developer',
        deepDive: {
            story: 'Tracking physical fitness often requires jumping between multiple apps. To solve this, I designed Fitness Tracker Pro—a comprehensive health aggregation app. The goal was to motivate users by tracking their daily habits, calculating streaks, and dynamically assigning them a "Fitness Level Badge" (Beginner to Elite). The UI was designed with a futuristic dark-mode aesthetic featuring neon accents to make health tracking engaging and rewarding.',
            architecture: 'Built using Flutter to deliver a highly performant cross-platform experience. The backend relies heavily on Firebase and local device sensors.\n\n1. Health Ecosystem Sync: Utilizes the `health` package to securely request permissions and automatically fetch real-time step counts from Apple Health or Google Fit.\n\n2. Security & Biometrics: Leverages `firebase_auth` combined with `google_sign_in` for seamless onboarding, while `local_auth` is implemented to provide an optional Biometric App Lock (FaceID/TouchID) for maximum privacy.\n\n3. Cloud & Local State: State management is handled via the `provider` package. `shared_preferences` caches data locally for instant offline access, while Cloud Firestore syncs streaks, metrics, and advanced profiles across devices in real-time.\n\n4. Background Engagement: The `flutter_local_notifications` package powers a sophisticated background notification system that schedules motivational quotes, workout reminders, and "Streak Saver" alerts entirely offline.',
            features: [
                'Native Apple Health & Google Fit Step Tracking',
                'Dynamic Fitness Level Badging based on Daily Streaks',
                'Biometric App Lock (FaceID/TouchID) & Google Sign-In',
                'Real-time Cloud Sync with Firestore & Local Caching',
                'Automated Offline Push Notifications (Motivation & Reminders)',
                'Advanced User Profiling & Dynamic Workout Generation'
            ]
        }
    },
    {
        id: 'expense-tracker',
        title: 'Daily Expense Tracker',
        tagline: 'Flutter & Firebase Financial App',
        problem: 'People struggle with managing their daily expenses and monthly budgets due to a lack of simple, centralized financial tracking tools.',
        solution: 'Developed a cross-platform mobile application with secure authentication, categorized expense tracking, and an intuitive dashboard to monitor daily and monthly budgets.',
        metrics: [
            { label: 'Cross-Platform', value: 'iOS & Android' },
            { label: 'Authentication', value: 'Firebase Auth' },
            { label: 'Core Features', value: '5+ Modules' }
        ],
        tech: ['Flutter', 'Dart', 'Firebase', 'Firestore'],
        video: 'https://www.youtube.com/embed/UgVmrz8B4J4?autoplay=1&mute=1&loop=1&playlist=UgVmrz8B4J4',
        images: [
            '/projects/expense-tracker/hero.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.54.52.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.55.18.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.55.29.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.55.55.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.02.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.15.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.23.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.30.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.43.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.56.56.png',
            '/projects/expense-tracker/Screenshot 2026-06-23 at 12.57.02.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/daily-expense-tracker-capstone',
        github: 'https://github.com/kariyawasamnaveen/daily-expense-tracker-capstone',
        role: 'Full Stack Mobile Developer',
        deepDive: {
            story: 'Managing personal finances can be overwhelming. Many people lose track of their daily expenses and fail to maintain a monthly budget. To solve this, I designed and developed the Daily Expense & Budget Tracker. The goal was to create a seamless, cross-platform mobile experience that allows users to quickly log expenses, categorize them, and view real-time summaries of their financial health on a clean, intuitive dashboard.',
            architecture: 'The application is built using Flutter for the frontend, ensuring a native-like experience on both iOS and Android.\n\n1. Security & Authentication: Integrates Firebase Auth paired with local_auth for seamless Biometric Login (FaceID/TouchID), ensuring maximum privacy for financial data.\n\n2. Cloud & Local Sync: Uses Cloud Firestore as a NoSQL backend for real-time synchronization across devices, while leveraging shared_preferences for fast local caching.\n\n3. Background Processing: Implements flutter_local_notifications to schedule daily reminder alerts locally without relying on external servers.\n\n4. Data Portability: Features an automated data pipeline using the csv and share_plus packages to generate and share monthly financial reports instantly.',
            features: [
                'Biometric Authentication (TouchID/FaceID) Integration',
                'Real-Time Cloud Database with Firestore',
                'Automated Data Export to CSV with Native Sharing',
                'Scheduled Push Notifications for Daily Expense Reminders',
                'Cross-Platform Support (iOS & Android) using Flutter'
            ]
        }
    },
    {
        id: 'commish-ai',
        title: 'RecapAI',
        tagline: 'AI-Powered Fantasy Football Intelligence',
        problem: 'League commissioners spend hours manually gathering data and writing engaging weekly summaries for their fantasy football leagues.',
        solution: 'Built an AI-powered system that automatically fetches live league data and generates character-driven, narrative weekly recaps using LangChain and OpenAI.',
        metrics: [
            { label: 'Weekly Hours Saved', value: '15+' },
            { label: 'Automation', value: '100%' },
            { label: 'Persona Variations', value: 'Unlimited' }
        ],
        tech: ['Python', 'Streamlit', 'LangChain', 'Sleeper API'],
        video: 'https://www.youtube.com/embed/VSoQSh1bEU8?autoplay=1&mute=1&loop=1&playlist=VSoQSh1bEU8',
        images: [
            '/projects/commish-ai/commish-hero.png',
            '/projects/commish-ai/screenshot-1.png',
            '/projects/commish-ai/screenshot-2.png',
            '/projects/commish-ai/screenshot-3.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/fantasy-football-recap-demo',
        role: 'Full Stack AI Engineer',
        deepDive: {
            story: 'Fantasy football commissioners spend hours every week gathering data from Sleeper or ESPN, calculating stats, and writing engaging, trash-talk-filled weekly recaps for their leagues. I built Commish.ai to completely automate this process. It connects directly to the Sleeper API, pulls the latest weekly matchups, and feeds the data into a custom LangChain agent that generates highly personalized, character-driven weekly recaps (e.g. written in the style of Dwight Schrute or Snoop Dogg).',
            architecture: 'The system uses a streamlined architecture built entirely in Python using Streamlit for the frontend.\n\n1. Data Ingestion: The backend connects to the Sleeper API to fetch real-time roster, matchup, and scoring data. It processes this JSON data and maps players to their respective teams.\n\n2. AI Processing: The processed data is fed into a LangChain conversational agent powered by OpenAI. The agent uses custom prompt templates to analyze the matchups, identify the biggest blowouts or upsets, and generate a narrative summary injected with the chosen persona.\n\n3. Presentation: The Streamlit UI provides a simple, clean interface for commissioners to input their league ID, select a persona, and instantly generate the recap, saving them hours of manual work.',
            features: [
                'Live Data Fetching from Sleeper API',
                'Custom LLM Personas for engaging content',
                'Automated Matchup Analysis and Statistical Summaries',
                'Clean, responsive Streamlit User Interface'
            ]
        }
    },
    {
        id: 'estate-core',
        title: 'EstateCore',
        tagline: 'Neural Estate Intelligence',
        problem: 'Property managers in Kolkata struggle with high-volume, multilingual lead qualification and manual property damage assessment.',
        solution: 'Engineered a "Neural Concierge" using GPT-4 Vision and LangChain to automate lead capture, visual diagnosis, and communication in English, Hindi, and Bengali.',
        metrics: [
            { label: 'Response Latency', value: '< 1.5s' },
            { label: 'Lead Accuracy', value: '98%' },
            { label: 'Language Coverage', value: '100%' }
        ],
        tech: ['Node.js', 'Prisma', 'GPT-4 Vision', 'LangChain'],
        video: 'https://www.youtube.com/embed/sINMR-s-U8E?autoplay=1&mute=1&loop=1&playlist=sINMR-s-U8E',
        images: [
            '/projects/contractor-ai/hero.png',
            '/projects/contractor-ai/ss1.png',
            '/projects/contractor-ai/ss2.png',
            '/projects/contractor-ai/ss3.png',
            '/projects/contractor-ai/ss4.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/contractor-ai-backend',
        role: 'Lead Full Stack Engineer',
        deepDive: {
            story: 'The real estate renovation and contracting market in areas like Kolkata is intensely competitive and linguistically diverse. Local property managers and contractors were losing up to 40% of potential leads simply because they could not provide immediate, 24/7 responses in the client\'s native language (English, Hindi, or Bengali). Furthermore, the initial damage assessment phase was broken—clients would send low-quality images on WhatsApp, leading to inaccurate cost estimations. I architected EstateCore not just as a chatbot, but as an autonomous "Neural Concierge" designed to eliminate this friction entirely. It acts as the first line of interaction, diagnosing issues visually, conversing fluently in regional languages, and qualifying leads before a human ever steps in.',
            architecture: 'The system architecture is a highly decoupled, event-driven Node.js backend. At the edge, a lightweight, glassmorphic widget captures user intent and media payloads. \n\n1. Conversational Engine: Built utilizing LangChain, the system maintains stateful conversation memory, allowing the AI to remember context across multiple interactions. It dynamically detects the user\'s language and switches its NLP processing pipeline seamlessly.\n\n2. Vision Processing Pipeline: When a user uploads an image of property damage (e.g., a cracked wall or leaking pipe), the Node.js backend processes the file into a base64 buffer and securely routes it to the GPT-4 Vision API. The AI analyzes the structural integrity and outputs a preliminary diagnostic report directly into the chat.\n\n3. Data Persistence & Routing: A Prisma ORM layer sits atop a relational database, automatically extracting entities (Name, Phone Number, Service Intent) from the natural language flow. Once a lead is qualified, it triggers an asynchronous webhook to the Admin Dashboard.',
            features: [
                'Dynamic Language Detection & Switching (EN, HI, BN) via LangChain',
                'Zero-Shot Image Analysis using GPT-4 Vision capabilities',
                'Automated Entity Extraction (Name, Phone, Intent) from unstructured text',
                'Stateful Session Memory Management for contextual continuity',
                'Secure, rate-limited Node.js/Express API gateway',
                'Prisma-backed relational database for lead management'
            ]
        }
    },
    {
        id: 'bizlangai',
        title: 'BizLangAI',
        tagline: 'Enterprise Neural Knowledge Base',
        problem: 'Large enterprises waste time manually extracting metrics from complex M&A PDFs and logistics CSVs. Existing LLMs hallucinate or fail to plot complex data accurately.',
        solution: 'Built a robust FastAPI backend utilizing Pinecone and LangChain tool-calling to ensure 100% accurate data retrieval and dynamic chart generation.',
        metrics: [
            { label: 'Data Retrieval Time', value: '-98%' },
            { label: 'Chart Accuracy', value: '100%' },
            { label: 'Hallucinations', value: '0%' }
        ],
        tech: ['React', 'FastAPI', 'LangChain', 'Pandas'],
        video: 'https://www.youtube.com/embed/UgsJcJSqd74?autoplay=1&mute=1&loop=1&playlist=UgsJcJSqd74',
        images: [
            '/projects/bizlangai/bizlangai-hero.png',
            '/projects/bizlangai/bizlangai-demo-1.png',
            '/projects/bizlangai/bizlangai-demo-2.png',
            '/projects/bizlangai/bizlangai-demo-3.png'
        ],
        link: '#',
        github: 'https://github.com/kariyawasamnaveen/bizlangai-frontend',
        role: 'Full Stack AI Engineer',
        deepDive: {
            story: 'Enterprise RAG systems often fail because they retrieve stale vectors from previous queries or cannot perform mathematical operations on tabular data. I designed BizLangAI to solve both issues. It strictly isolates document contexts by aggressively flushing the Pinecone vector database between sessions, ensuring zero cross-contamination. For tabular data, it bypasses standard RAG entirely.',
            architecture: 'The system uses a decoupled architecture with a React glassmorphism frontend and a FastAPI backend. \n\n1. Vector Pipeline: When a user uploads a PDF (like an M&A Due Diligence Report), the backend clears all existing vectors, chunks the new document, and stores it in Pinecone. This ensures absolute context purity.\n\n2. Dynamic Chart Generation: When a CSV is uploaded, the system switches from RAG to a LangChain Pandas DataFrame Agent. Using OpenAI\'s Tool Calling API, the agent autonomously writes and executes Matplotlib Python code in a secure sandbox, generates the chart, and serves it to the frontend.',
            features: [
                'Zero-Hallucination Vector Clearing Pipeline',
                'Autonomous Python Code Execution via LangChain Tool Calling',
                'Dynamic Matplotlib Chart Generation from CSVs',
                'Secure JWT Authentication and Session Management',
                'Responsive Glassmorphism UI tailored for Enterprise Dashboards'
            ]
        }
    },
    {
        id: 'heartsync',
        title: 'HeartSync Protocol',
        tagline: 'Cyber-Romantic Sync & Verification Hub',
        problem: 'Standard romantic surprise pages lack engaging tech aesthetics, interactivity, and security features suited for tech-forward couples.',
        solution: 'Built an interactive multi-phase React/Framer Motion application utilizing biometric validation simulations, 3D tilt polaroid rendering, and encrypted time calculation engines.',
        metrics: [
            { label: 'Timeline Locked', value: '100%' },
            { label: '3D Tilt Mechanics', value: '60fps' },
            { label: 'Encryption Status', value: 'Active' }
        ],
        tech: ['React', 'Framer Motion', 'TailwindCSS', 'Vite'],
        video: 'https://www.youtube.com/embed/cIWpzyPnUSs?autoplay=1&mute=1&loop=1&playlist=cIWpzyPnUSs',
        images: [
            '/love_app/heartsync_cover.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.31.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.47.png',
            '/love_app/Screenshot 2026-05-21 at 22.33.58.png',
            '/love_app/Screenshot 2026-05-21 at 22.37.22.png',
            '/love_app/Screenshot 2026-05-21 at 22.37.57.png',
            '/love_app/Screenshot 2026-05-21 at 22.38.06.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/valentine-surprise',
        github: 'https://github.com/kariyawasamnaveen/valentine-surprise',
        role: 'Creator & Lead Developer',
        deepDive: {
            story: 'Every developer wants to build something truly special and unique for their significant other. HeartSync Protocol is a fully interactive, cybersecurity-themed surprise portal created to celebrate our anniversary. Built with premium dark aesthetics, cybernetic grid interfaces, and custom physics animations, it guides the user through multi-phase sync processes, simulated biometric data scanning, and love node authorization, concluding with a fully interactive 3D Polaroid card and anniversary time counter.',
            architecture: 'The system features a lightweight single-page architectural design built with React, styled using custom TailwindCSS and modern typography.\n\n1. Simulated Security Layer: Employs standard console typewriter logs and interactive lock status widgets to gamify the user experience.\n\n2. Real-Time Duration Engine: Computes real-time precise millisecond durations to output the exact days elapsed since the relationship\'s establishment.\n\n3. 3D Tilt Graphics: Uses Framer Motion\'s useMotionValue, useSpring, and useTransform to track mouse movements on the viewport and tilt the Polaroid card dynamically in 3D space.',
            features: [
                'Multi-Phase Interactive Cyber-Romantic Gamification',
                '3D Tilt Polaroid Card using Spring Physics',
                'Simulated Biometric Data Authorization Node',
                'Interactive Console Logs & Particle Systems',
                'Responsive 100% Non-Scrollable UI layout design'
            ]
        }
    },
    {
        id: 'ig-engagement-bot',
        title: 'Instagram Engagement Bot',
        tagline: 'Automated Social Media Marketing Ecosystem',
        problem: 'Manual execution of Instagram growth strategies is highly inefficient, and web-based automated bots are constantly blocked by strict anti-bot detections and IP bans.',
        solution: 'Engineered a complete ecosystem utilizing Android device emulation, smart AirProxy rotation, and human-like account warm-up sequences to completely bypass detection.',
        metrics: [
            { label: 'Automation', value: '100%' },
            { label: 'Detection Bypass', value: 'High' },
            { label: 'Platforms', value: 'Web/Mobile' }
        ],
        tech: ['Python', 'PHP', 'Flutter', 'MySQL', 'Instagrapi'],
        video: [],
        images: [
            '/projects/ig-bot/hero.png'
        ],
        link: 'https://github.com/kariyawasamnaveen/instagram-engagement-bot',
        github: 'https://github.com/kariyawasamnaveen/instagram-engagement-bot',
        role: 'Lead Automation & Full Stack Developer',
        deepDive: {
            story: 'Building a stable Instagram automation bot is incredibly difficult due to strict anti-bot detection systems. To solve this, I designed the Instagram Engagement Bot not just as a script, but as a full ecosystem. It includes a PHP SmartPanel for users to place orders, a Flutter mobile app for management, and a robust Python backend that performs the heavy lifting by emulating real Android devices to avoid suspension.',
            architecture: 'The project is divided into three main components communicating via a shared MySQL database.\n\n1. Python Automation Engine: Uses `instagrapi` to mimic legitimate Android app API calls, completely bypassing web-based detections that normally block automation scripts.\n\n2. Proxy Rotation: Integrates AirProxy APIs to automatically rotate mobile IPs between actions, evading location-based detection.\n\n3. Warm-up System: A dedicated engine that automatically scrolls feeds and watches reels like a real human before executing heavy tasks, building trust for new accounts.\n\n4. Multi-Platform Frontend: A PHP web panel (SmartPanel) and a cross-platform Flutter mobile app allow users to manage campaigns on the go.',
            features: [
                'Android Emulation using Instagrapi API',
                'Automated Bulk Account Verification & Filtering',
                'Human-like Warm-up Engine (Scrolling/Reels)',
                'AirProxy Integration for Smart IP Rotation',
                'PHP Web Panel & Flutter Mobile App Integration'
            ]
        }
    }
];
