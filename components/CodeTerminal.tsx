'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiCode, FiTerminal } from 'react-icons/fi';
import { SiFlutter, SiNodedotjs, SiFirebase, SiGooglecloud } from 'react-icons/si';

export type TechId = 'flutter' | 'node' | 'firebase' | 'mlkit' | null;

const CODE_SNIPPETS: Record<string, { title: string; code: string }> = {
    flutter: {
        title: 'lib/core/bloc/auth_bloc.dart',
        code: `class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  final SecureStorage _secureStorage;

  AuthBloc({
    required AuthRepository authRepository,
    required SecureStorage secureStorage,
  })  : _authRepository = authRepository,
        _secureStorage = secureStorage,
        super(const AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event, Emitter<AuthState> emit
  ) async {
    emit(const AuthLoading());
    try {
      final user = await _authRepository.authenticate(
        email: event.email, password: event.password
      );
      await _secureStorage.write(key: 'token', value: user.token);
      emit(AuthSuccess(user));
    } catch (e) {
      emit(AuthFailure(e.toString()));
    }
  }
}`,
    },
    node: {
        title: 'src/services/MatchmakingEngine.ts',
        code: `export class MatchmakingEngine {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL!);
  }

  async findMatch(
    userId: string, prefs: UserPreferences
  ): Promise<string | null> {
    const geoRadius = prefs.distance || 50;

    // O(log N) geolocation matching via ZRANGEBYSCORE
    const potentialMatches = await this.redisClient.georadius(
      'user_locations',
      prefs.lon,
      prefs.lat,
      geoRadius,
      'km'
    );

    return this.filterByMLCompatibility(userId, potentialMatches);
  }
}`,
    },
    firebase: {
        title: 'functions/src/triggers/onUserCreate.ts',
        code: `export const onUserCreate = functions.auth
  .user()
  .onCreate(async (user) => {
    const batch = db.batch();

    const userRef = db.collection('users').doc(user.uid);
    batch.set(userRef, {
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending_verification',
    });

    const walletRef = db.collection('wallets').doc(user.uid);
    batch.set(walletRef, { balance: 0, currency: 'USD' });

    // Atomic transaction ensures absolute data integrity
    await batch.commit();
    console.log('Initialized architecture for ' + user.uid);
  });`,
    },
    mlkit: {
        title: 'lib/features/verification/face_detector.dart',
        code: `class RealTimeFaceVerifier {
  final FaceDetector _faceDetector = FaceDetector(
    options: FaceDetectorOptions(
      enableContours: true,
      enableClassification: true,
      performanceMode: FaceDetectorMode.accurate,
    ),
  );

  Future<bool> verifyLiveness(InputImage image) async {
    final faces = await _faceDetector.processImage(image);
    if (faces.isEmpty) return false;

    final face = faces.first;
    // Prevent 2D photo spoofing via 3D contour depth analysis
    final leftEye = face.leftEyeOpenProbability ?? 0;
    final rightEye = face.rightEyeOpenProbability ?? 0;
    return leftEye > 0.8 && rightEye > 0.8;
  }
}`,
    },
};

interface Props {
    activeTech: TechId;
    setActiveTech: (tech: TechId) => void;
    onAnalyze: (tech: TechId) => void;
    isAnalyzing: boolean;
}

export function CodeTerminal({ activeTech, setActiveTech, onAnalyze, isAnalyzing }: Props) {
    const [displayedCode, setDisplayedCode] = useState('');

    useEffect(() => {
        if (!activeTech) {
            setDisplayedCode(
                ' // SYSTEM IDLE\n // SELECT A TECHNOLOGY TO INITIATE CODE INJECTION...'
            );
            return;
        }

        const fullCode = CODE_SNIPPETS[activeTech].code;
        setDisplayedCode('');
        let i = 0;
        const interval = setInterval(() => {
            i += 6;
            setDisplayedCode(fullCode.slice(0, i));
            if (i >= fullCode.length) {
                setDisplayedCode(fullCode);
                clearInterval(interval);
            }
        }, 12);

        return () => clearInterval(interval);
    }, [activeTech]);

    const techs = [
        { id: 'flutter' as TechId, name: 'Flutter & BLoC', icon: <SiFlutter size={18} />, activeColor: 'border-[#0175C2] text-[#4ec9fb]', bg: 'hover:border-[#0175C2]/40' },
        { id: 'node' as TechId, name: 'Node.js Microservices', icon: <SiNodedotjs size={18} />, activeColor: 'border-[#339933] text-[#6dbf6d]', bg: 'hover:border-[#339933]/40' },
        { id: 'firebase' as TechId, name: 'Firebase NoSQL', icon: <SiFirebase size={18} />, activeColor: 'border-[#FFCA28] text-[#ffd454]', bg: 'hover:border-[#FFCA28]/40' },
        { id: 'mlkit' as TechId, name: 'Google ML-Kit', icon: <SiGooglecloud size={18} />, activeColor: 'border-[#4285F4] text-[#7baaf7]', bg: 'hover:border-[#4285F4]/40' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto" style={{ height: '520px' }}>
            {/* Left: Selector */}
            <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
                <div className="text-[10px] font-black tracking-[0.25em] text-neutral-600 uppercase mb-1 flex items-center gap-2">
                    <FiTerminal size={12} /> Environment
                </div>
                {techs.map((tech) => {
                    const isActive = activeTech === tech.id;
                    return (
                        <button
                            key={String(tech.id)}
                            onClick={() => setActiveTech(tech.id)}
                            className={[
                                'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200',
                                isActive
                                    ? `bg-neutral-800/80 ${tech.activeColor} shadow-lg`
                                    : `bg-neutral-900/40 border-white/5 text-neutral-400 ${tech.bg}`,
                            ].join(' ')}
                        >
                            {tech.icon}
                            <span className="text-sm font-semibold">{tech.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right: IDE */}
            <div className="flex-1 flex flex-col bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-0">
                {/* IDE Title Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                        <FiCode size={11} />
                        {activeTech ? CODE_SNIPPETS[activeTech].title : 'terminal — idle'}
                    </span>
                    <button
                        onClick={() => onAnalyze(activeTech)}
                        disabled={!activeTech || isAnalyzing}
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all',
                            !activeTech || isAnalyzing
                                ? 'opacity-40 cursor-not-allowed text-neutral-500 bg-neutral-800'
                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]',
                        ].join(' ')}
                    >
                        <motion.span
                            animate={isAnalyzing ? { rotate: 360 } : {}}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                            <FiCpu size={12} />
                        </motion.span>
                        {isAnalyzing ? 'ANALYZING...' : 'RUN AI REVIEW'}
                    </button>
                </div>

                {/* Code Body */}
                <div className="flex-1 overflow-y-auto p-5 font-mono text-sm leading-relaxed whitespace-pre">
                    <span className="text-emerald-400">{displayedCode}</span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.75 }}
                        className="inline-block w-[7px] h-[14px] bg-emerald-400 ml-0.5 translate-y-[3px] rounded-sm"
                    />
                </div>
            </div>
        </div>
    );
}
