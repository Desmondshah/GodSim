import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { WorldSetup } from "./components/WorldSetup";
import { GameInterface } from "./components/GameInterface";
import { Toaster } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const [selectedWorldId, setSelectedWorldId] = useState<Id<"worlds"> | null>(null);

  return (
    <div 
      className="min-h-screen bg-neutral relative scan-lines"
      style={{
        // iOS-specific styles for native app feel
        minHeight: '-webkit-fill-available',
        touchAction: 'manipulation', // Prevents double-tap zoom
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        backgroundImage: `
          linear-gradient(90deg, transparent 50%, rgba(255, 0, 0, 0.02) 50%),
          linear-gradient(0deg, transparent 50%, rgba(0, 255, 255, 0.02) 50%)
        `,
        backgroundSize: '20px 20px',
        // Handle safe areas for iPhone notch/dynamic island - only top
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      {/* Brutalist geometric background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 sm:opacity-100">
        <div className="absolute top-10 left-4 sm:left-10 w-16 sm:w-32 h-16 sm:h-32 bg-primary border-4 border-secondary shadow-brutal transform rotate-12"></div>
        <div className="absolute top-32 right-4 sm:right-20 w-12 sm:w-24 h-12 sm:h-24 bg-accent border-4 border-secondary shadow-brutal transform -rotate-6"></div>
        <div className="absolute bottom-20 left-1/4 w-20 sm:w-40 h-8 sm:h-16 bg-secondary shadow-brutal"></div>
        <div className="absolute bottom-40 right-4 sm:right-10 w-10 sm:w-20 h-10 sm:h-20 bg-accent-cyan border-4 border-secondary shadow-brutal transform rotate-45"></div>
      </div>

      <header className="sticky top-0 z-20 bg-neutral border-b-4 border-secondary shadow-brutal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-2xl sm:text-4xl animate-flicker">⚡</div>
            <h1 className="brutal-header text-brutal-xl sm:text-brutal-3xl divine-glitch" data-text="DIVINE.SIM">
              DIVINE.SIM
            </h1>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] relative z-10">
        <Authenticated>
          <AuthenticatedContent 
            selectedWorldId={selectedWorldId}
            setSelectedWorldId={setSelectedWorldId}
          />
        </Authenticated>
        
        <Unauthenticated>
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] p-4 sm:p-8">
            <div className="w-full max-w-xl sm:max-w-2xl">
              <div className="text-center mb-8 sm:mb-12 brutal-container">
                <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-glitch">👁️</div>
                <h2 className="brutal-header mb-4 sm:mb-6 divine-glitch" data-text="ASCEND TO GODHOOD">
                  ASCEND TO GODHOOD
                </h2>
                <p className="brutal-text mb-6 sm:mb-8 leading-relaxed text-center">
                  &gt; INITIALIZE DIVINE PROTOCOL<br/>
                  &gt; CREATE WORLDS // GUIDE CIVILIZATIONS<br/>
                  &gt; SHAPE DESTINIES // AI-POWERED SIMULATION<br/>
                  &gt; [WARNING] ABSOLUTE POWER CORRUPTS ABSOLUTELY
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <div className="bg-primary border-4 border-secondary p-3 sm:p-4 shadow-brutal">
                    <div className="brutal-text text-neutral text-center">CREATE</div>
                  </div>
                  <div className="bg-accent border-4 border-secondary p-3 sm:p-4 shadow-brutal">
                    <div className="brutal-text text-secondary text-center">CONTROL</div>
                  </div>
                  <div className="bg-secondary border-4 border-secondary p-3 sm:p-4 shadow-brutal">
                    <div className="brutal-text text-neutral text-center">DESTROY</div>
                  </div>
                </div>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>
      
      <Toaster 
        toastOptions={{
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '4px solid #FF0000',
            fontFamily: 'JetBrains Mono',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }
        }}
      />
    </div>
  );
}

function AuthenticatedContent({ 
  selectedWorldId, 
  setSelectedWorldId 
}: { 
  selectedWorldId: Id<"worlds"> | null;
  setSelectedWorldId: (id: Id<"worlds"> | null) => void;
}) {
  const world = useQuery(api.worldSetup.getUserWorld);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (world === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="brutal-container text-center">
          <div className="brutal-loading mx-auto mb-6"></div>
          <div className="brutal-text">LOADING DIVINE PROTOCOLS...</div>
          <div className="brutal-text text-accent mt-2">[PLEASE WAIT]</div>
        </div>
      </div>
    );
  }

  // No world exists - show setup
  if (!world) {
    return (
      <div className="py-12">
        <WorldSetup onComplete={(worldId) => setSelectedWorldId(worldId as Id<"worlds">)} />
      </div>
    );
  }

  // World exists but setup not complete - show loading or continue setup
  if (!world.isSetupComplete) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="brutal-container text-center max-w-2xl">
          <div className="brutal-loading mx-auto mb-8"></div>
          <h2 className="brutal-header mb-6 divine-glitch" data-text="WORLD.GENERATION.IN.PROGRESS">
            WORLD.GENERATION.IN.PROGRESS
          </h2>
          <div className="brutal-text mb-4">THE COSMIC FORCES ARE SHAPING YOUR REALM...</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-primary border-4 border-secondary p-4 shadow-brutal">
              <div className="brutal-text text-neutral">TERRAIN // GENERATING</div>
            </div>
            <div className="bg-accent border-4 border-secondary p-4 shadow-brutal">
              <div className="brutal-text text-secondary">LIFE // SEEDING</div>
            </div>
            <div className="bg-secondary border-4 border-secondary p-4 shadow-brutal">
              <div className="brutal-text text-neutral">LAWS // ESTABLISHING</div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-neutral border-l-8 border-accent">
            <div className="brutal-text text-accent">&gt; STATUS: REALITY.MATRIX.INITIALIZING...</div>
          </div>
        </div>
      </div>
    );
  }

  // World is ready - show game interface
  return (
    <div className="py-12">
      <GameInterface worldId={world._id} />
    </div>
  );
}