import React, { useState, useEffect, useRef } from 'react';
import { Flame, Wind, Award, Shield, Heart, CheckCircle2, Lock, Settings } from 'lucide-react';

// --- DATA CONFIGURATION ---
const AFFIRMATIONS = [
  "Who you are when no one's watching is who you actually are.",
  "A dream with no next step is just a feeling.",
  "Discipline isn't a cage. It's what you build the life inside.",
  "The pause before you react — that's where the power lives.",
  "The strongest move is usually the quietest one.",
];

const SMILE_PIECES = [
  "Otters hold hands while sleeping so they don't drift apart. Interpret that however you want.",
  "This week's useless skill: shuffle cards like a casino dealer. YouTube it. See who gives up first.",
  "Find the weirdest thing near you right now. Send each other a photo. No context.",
];

const REWARDS = {
  cade: [
    { tier: 7, title: "Ragnarok — The Base Spot", content: "Ice cave system (11 lat / 22 lon) is highly defensible. Bring a Yuty." },
    { tier: 14, title: "The Center — Underwater Loot", content: "Underwater caves near floating island drop blueprint-tier loot. Bring scuba." }
  ],
  morgan: [
    { tier: 7, title: "The Template Hack", content: "Search 'Cornell Notes' in Notion. Explain concepts out loud like teaching a 10-year-old." },
    { tier: 14, title: "The Grocery Hack", content: "Buy store brand except for 3-5 core items. Shop the perimeter first." }
  ]
};

const USERS = {
  cade: { id: 'cade', name: "Cade", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", glow: "shadow-emerald-500/20" },
  morgan: { id: 'morgan', name: "Morgan", color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/30", glow: "shadow-pink-500/20" },
};

const USER_LIST = Object.values(USERS);

const BREATH_SEQUENCE = [
  { phase: "inhale", duration: 4, scale: "scale-150" },
  { phase: "hold", duration: 4, scale: "scale-150" },
  { phase: "exhale", duration: 6, scale: "scale-90" },
];

const BreathCountdown = ({ phase, duration, color }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    if (phase === "ready" || phase === "done") return;

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, duration]);

  if (phase === "ready" || phase === "done") return null;

  return <span className={`text-3xl font-light mt-2 ${color}`}>{timeLeft}</span>;
};

const SHARED_ENCODER = new TextEncoder();

const BackgroundGradients = React.memo(() => (
  <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen transform-gpu will-change-transform" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] mix-blend-screen transform-gpu will-change-transform" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/30 rounded-full blur-[100px] mix-blend-screen transform-gpu will-change-transform" />
  </div>
));

// --- MAIN APPLICATION ---
export default function App() {
  const [screen, setScreen] = useState("home"); // home | session | complete | admin
  const [activeUser, setActiveUser] = useState(null);

  // State: Progress
  const [sessionDone, setSessionDone] = useState({ cade: false, morgan: false });
  const [streaks, setStreaks] = useState({ cade: 6, morgan: 6, couple: 13 }); // Pre-loaded for demo

  // State: Session
  const [breathPhase, setBreathPhase] = useState("ready"); // ready | inhale | hold | exhale | done
  const [breathCount, setBreathCount] = useState(0);
  const [breathDuration, setBreathDuration] = useState(0);
  const [moodWord, setMoodWord] = useState("");
  const [affirmation, setAffirmation] = useState("");

  // State: Rewards & Admin
  const [earnedReward, setEarnedReward] = useState(null);
  const [adminPass, setAdminPass] = useState("");
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  const timeoutRef = useRef(null);

  // Security: Auto-lock admin session after 60 seconds to prevent unauthorized access
  // if a user leaves the device unattended while authenticated.
  useEffect(() => {
    if (!isAdminAuth) return;

    const timeoutId = setTimeout(() => {
      setAdminPass("");
      setIsAdminAuth(false);
      setScreen("home");
    }, 60000); // 60 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [isAdminAuth, screen]);

  // Security: Hash password to avoid storing plaintext in client bundle
  // Performance: Debounce expensive hashing operation to avoid main thread blocking
  useEffect(() => {
    let ignore = false;
    const checkAdminPass = async () => {
      if (!adminPass) {
        setIsAdminAuth(false);
        return;
      }
      try {
        if (import.meta.env.VITE_ADMIN_PASS_HASH) {
          const data = SHARED_ENCODER.encode(adminPass);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          if (!ignore) {
            const hashView = new Uint8Array(hashBuffer);
            let hashHex = '';
            for (let i = 0; i < hashView.length; i++) {
              hashHex += hashView[i].toString(16).padStart(2, '0');
            }
            setIsAdminAuth(hashHex === import.meta.env.VITE_ADMIN_PASS_HASH);
          }
        } else {
          // Security: Fail securely if VITE_ADMIN_PASS_HASH is missing.
          // Do not fallback to VITE_ADMIN_PASS, as referencing it exposes the plaintext secret in the client bundle.
          if (!ignore) setIsAdminAuth(false);
        }
      } catch (err) {
        if (!ignore) setIsAdminAuth(false);
      }
    };

    const timeoutId = setTimeout(checkAdminPass, 300);
    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [adminPass]);

  // --- LOGIC: BREATHING ---
  const startBreathing = () => {
    setBreathCount(0);
    runBreathCycle(0, 0);
  };

  const runBreathCycle = (cycleIndex, stepIndex) => {
    if (cycleIndex >= 3) {
      setBreathPhase("done");
      setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
      return;
    }
    const step = BREATH_SEQUENCE[stepIndex];
    setBreathPhase(step.phase);
    setBreathDuration(step.duration);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const nextStep = stepIndex + 1;
      if (nextStep >= BREATH_SEQUENCE.length) {
        setBreathCount(cycleIndex + 1);
        runBreathCycle(cycleIndex + 1, 0);
      } else {
        runBreathCycle(cycleIndex, nextStep);
      }
    }, step.duration * 1000);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // --- LOGIC: COMPLETION ---
  const completeSession = () => {
    // Security: Validate activeUser exists in USERS to prevent potential state corruption
    if (!activeUser || !USERS[activeUser] || !moodWord.trim()) return;

    const newSessionDone = { ...sessionDone, [activeUser]: true };
    setSessionDone(newSessionDone);

    const newSolo = streaks[activeUser] + 1;
    const bothDone = newSessionDone.cade && newSessionDone.morgan;
    const newCouple = bothDone ? streaks.couple + 1 : streaks.couple;

    setStreaks({ ...streaks, [activeUser]: newSolo, couple: newCouple });

    // Reward Check
    let rewardObj = null;
    const isMilestone = [7, 14, 30, 60].includes(newCouple);

    if (bothDone && isMilestone) {
      rewardObj = {
        cade: REWARDS.cade.find(r => r.tier === newCouple),
        morgan: REWARDS.morgan.find(r => r.tier === newCouple),
        smile: SMILE_PIECES[Math.floor(Math.random() * SMILE_PIECES.length)]
      };
    }

    setEarnedReward(rewardObj);
    setScreen("complete");
  };

  // --- UI COMPONENTS ---
  const renderHome = () => (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Header & Couple Streak */}
      <div className="text-center space-y-2">
        <h1 className="text-xs tracking-[0.3em] text-slate-400 uppercase">Initiative Engine</h1>
        <div className="flex justify-center items-center gap-3">
          <Heart aria-hidden="true" className={`w-5 h-5 ${sessionDone.cade && sessionDone.morgan ? 'text-indigo-400 fill-indigo-400/20' : 'text-slate-600'}`} />
          <h2 className="text-3xl font-light tracking-widest text-slate-200">
            {streaks.couple} <span className="text-sm text-slate-500">DAYS</span>
          </h2>
        </div>
        <p className="text-[10px] tracking-widest text-slate-500 uppercase">Growth Together</p>
      </div>

      {/* User Cards */}
      <div className="space-y-4 mt-8">
        {USER_LIST.map(u => {
          const isDone = sessionDone[u.id];
          return (
            <button
              key={u.id}
              disabled={isDone}
              aria-label={isDone ? `${u.name} session completed` : `Start session for ${u.name}`}
              title={isDone ? "Session already completed for today" : "Start daily session"}
              onClick={() => {
                setActiveUser(u.id);
                setBreathPhase("ready");
                setMoodWord("");
                setScreen("session");
              }}
              className={`w-full relative overflow-hidden rounded-2xl p-6 flex items-center justify-between transition-all duration-300 border backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                ${isDone
                  ? `bg-slate-800/40 ${u.border} opacity-50 cursor-not-allowed`
                  : `bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600 shadow-lg`}`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isDone ? u.bg + ' ' + u.border : 'bg-slate-900 border-slate-700'}`}>
                  {isDone ? <CheckCircle2 aria-hidden="true" className={`w-6 h-6 ${u.color}`} /> : <Shield aria-hidden="true" className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="text-left">
                  <h3 className={`text-lg tracking-wider ${isDone ? u.color : 'text-slate-200'}`}>{u.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame aria-hidden="true" className={`w-3 h-3 ${isDone ? u.color : 'text-slate-500'}`} />
                    <span className="text-xs text-slate-400">{streaks[u.id]} Day Streak</span>
                  </div>
                </div>
              </div>
              {!isDone && <div className="text-slate-500 tracking-widest text-xs uppercase animate-pulse">Start</div>}
            </button>
          )
        })}
      </div>

      {/* Admin Trigger */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => setScreen("admin")}
          className="text-slate-600 hover:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 rounded-md p-1"
          aria-label="Admin Settings"
          title="Admin Settings"
        >
          <Settings className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  const renderSession = () => {
    const u = USERS[activeUser];
    const isBreathing = breathPhase !== "done";

    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in slide-in-from-bottom-4 duration-500">
        <div className={`text-xs tracking-[0.3em] uppercase mb-12 ${u.color} opacity-80`}>
          {u.name} — Daily Session
        </div>

        {isBreathing ? (
          <div className="flex flex-col items-center space-y-12 w-full">
            <div className="text-xs tracking-widest text-slate-400 uppercase">
              {breathPhase === "ready" ? "Three Breaths" : `Cycle ${breathCount + 1} of 3`}
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Animated Breathing Circle */}
              <div
                className={`absolute inset-0 rounded-full border border-white/10 transition-transform bg-gradient-to-tr from-white/5 to-transparent transform-gpu
                  ${breathPhase === 'inhale' ? 'scale-150 duration-[4000ms] ease-out' : ''}
                  ${breathPhase === 'hold' ? 'scale-150 duration-700 ease-in-out' : ''}
                  ${breathPhase === 'exhale' ? 'scale-90 duration-[6000ms] ease-in-out' : ''}
                  ${breathPhase === 'ready' ? 'scale-100' : ''}
                `}
                style={{ boxShadow: breathPhase !== 'ready' ? `0 0 40px var(--tw-shadow-color)` : 'none' }}
                shadow-color={u.color}
              />

              <div className="relative z-10 flex flex-col items-center">
                <Wind aria-hidden="true" className={`w-8 h-8 mb-2 ${u.color}`} />
                <span className="text-xs tracking-widest uppercase text-slate-300">
                  {breathPhase === "ready" ? "Ready" : breathPhase}
                </span>
                <BreathCountdown phase={breathPhase} duration={breathDuration} color={u.color} />
              </div>
            </div>

            <button
              onClick={startBreathing}
              disabled={breathPhase !== "ready"}
              title={breathPhase === "ready" ? "Begin breathing exercise" : "Breathing in progress"}
              className={`w-full max-w-[200px] py-4 rounded-xl border text-sm tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500
                ${breathPhase === "ready" ? `bg-slate-800 ${u.border} text-white hover:bg-slate-700` : 'bg-transparent border-transparent text-slate-600 opacity-50 cursor-not-allowed'}`}
            >
              {breathPhase === "ready" ? "Begin" : "Focus"}
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-in fade-in duration-700">
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 text-center backdrop-blur-sm">
              <h4 className="text-[10px] tracking-[0.2em] text-slate-500 uppercase mb-4">Daily Truth</h4>
              <p className="text-lg font-serif italic text-slate-300 leading-relaxed">"{affirmation}"</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
              <label
                htmlFor="moodWordInput"
                className="block text-[10px] tracking-[0.2em] text-slate-500 uppercase mb-4 text-center"
              >
                One Word Check-In
              </label>
              <input
                id="moodWordInput"
                type="text"
                maxLength={20}
                placeholder="Current state..."
                value={moodWord}
                onChange={e => setMoodWord(e.target.value.split(" ")[0])}
                onKeyDown={e => {
                  if (e.key === 'Enter' && moodWord.trim()) {
                    completeSession();
                  }
                }}
                className={`w-full bg-slate-900/50 border rounded-xl p-4 text-center text-slate-200 focus:outline-none transition-colors
                  ${moodWord ? u.border : 'border-slate-700'} text-lg tracking-wider focus-visible:ring-2 focus-visible:ring-slate-500`}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setScreen("home")}
                className="flex-1 py-4 rounded-xl border border-slate-700 text-slate-400 text-xs tracking-widest uppercase hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Back
              </button>
              <button
                onClick={completeSession}
                disabled={!moodWord.trim()}
                title={!moodWord.trim() ? "Enter a check-in word to complete" : "Complete session"}
                className={`flex-2 py-4 px-8 rounded-xl border text-xs tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500
                  ${moodWord.trim() ? `${u.bg} ${u.border} ${u.color} hover:bg-opacity-20` : 'bg-slate-800 border-slate-700 text-slate-600 opacity-50 cursor-not-allowed'}`}
              >
                Complete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => {
    const u = USERS[activeUser];
    const bothDone = sessionDone.cade && sessionDone.morgan;

    return (
      <div className="w-full max-w-md mx-auto space-y-6 animate-in zoom-in-95 duration-500">
        <div className={`text-center p-8 rounded-3xl border ${u.border} bg-slate-800/50 backdrop-blur-md`}>
          <CheckCircle2 aria-hidden="true" className={`w-16 h-16 mx-auto mb-4 ${u.color}`} />
          <h2 className={`text-xl tracking-widest uppercase ${u.color}`}>{u.name} Validated</h2>
          <p className="text-sm text-slate-400 mt-2">Personal Streak: {streaks[activeUser]} Days</p>
        </div>

        {bothDone && (
          <div className="text-center p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm">
            <h3 className="text-[10px] tracking-[0.3em] text-indigo-400 uppercase mb-2">Together Bonus Active</h3>
            <div className="flex items-center justify-center gap-2">
              <Award aria-hidden="true" className="w-5 h-5 text-indigo-400" />
              <span className="text-2xl font-light text-slate-200">{streaks.couple} Days</span>
            </div>
          </div>
        )}

        {earnedReward && (
          <div className="space-y-4 animate-in slide-in-from-bottom-8 delay-300 duration-700">
            <div className="text-center mt-8 mb-4">
              <span className="px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 text-[10px] tracking-widest uppercase">
                Tier {streaks.couple} Unlocked
              </span>
            </div>

            {earnedReward.smile && (
              <div className="p-5 rounded-2xl border border-slate-700 bg-slate-800/40 text-center">
                <p className="text-sm italic text-slate-300">"{earnedReward.smile}"</p>
              </div>
            )}

            {earnedReward.cade && activeUser === 'cade' && (
              <div className={`p-5 rounded-2xl border ${USERS.cade.border} bg-slate-800/40`}>
                <h4 className={`text-[10px] tracking-widest uppercase ${USERS.cade.color} mb-2`}>Cade's Reward</h4>
                <h5 className="text-sm text-slate-200 mb-1">{earnedReward.cade.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{earnedReward.cade.content}</p>
              </div>
            )}

            {earnedReward.morgan && activeUser === 'morgan' && (
              <div className={`p-5 rounded-2xl border ${USERS.morgan.border} bg-slate-800/40`}>
                <h4 className={`text-[10px] tracking-widest uppercase ${USERS.morgan.color} mb-2`}>Morgan's Reward</h4>
                <h5 className="text-sm text-slate-200 mb-1">{earnedReward.morgan.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{earnedReward.morgan.content}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => { setScreen("home"); setActiveUser(null); setEarnedReward(null); }}
          className="w-full py-4 mt-8 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs tracking-widest uppercase hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
        >
          Return to Dashboard
        </button>
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in">
      <div className="bg-slate-800/60 border border-slate-700 p-8 rounded-3xl backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <Lock aria-hidden="true" className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-center text-xs tracking-[0.3em] text-slate-400 uppercase mb-8">System Override</h2>

        {/* Security: Authenticate via hashed password to prevent client bundle exposure */}
        {!isAdminAuth ? (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Authorization Code"
              aria-label="Authorization Code"
              value={adminPass}
              autoComplete="off"
              spellCheck="false"
              /* Security: Limit input length to prevent potential DoS from extremely long strings */
              maxLength={64}
              onChange={e => setAdminPass(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center text-slate-200 focus:border-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
            />
            <div className="flex gap-2">
              <button onClick={() => { setScreen("home"); setAdminPass(""); }} className="flex-1 py-3 border border-slate-700 rounded-xl text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-[10px] tracking-widest text-slate-500 uppercase">Engine Stats</h3>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={USERS.cade.color}>Cade Streak</span>
                  <span className="text-slate-300">{streaks.cade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={USERS.morgan.color}>Morgan Streak</span>
                  <span className="text-slate-300">{streaks.morgan}</span>
                </div>
                <div className="h-px bg-slate-700 my-2 w-full" />
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-400">Synergy Tier</span>
                  <span className="text-slate-300">{streaks.couple}</span>
                </div>
              </div>
            </div>
            <button onClick={() => { setScreen("home"); setAdminPass(""); }} className="w-full py-3 bg-slate-200 text-slate-900 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Lock System</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-slate-700 relative overflow-hidden flex items-center justify-center p-4">
      <BackgroundGradients />

      {/* Content Container */}
      <div className="relative z-10 w-full">
        {screen === "home" && renderHome()}
        {screen === "session" && renderSession()}
        {screen === "complete" && renderComplete()}
        {screen === "admin" && renderAdmin()}
      </div>
    </div>
  );
}
