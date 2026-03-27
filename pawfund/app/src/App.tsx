import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, HandHeart, Home, Stethoscope, 
  Menu, X, Check, Copy, Activity
} from 'lucide-react';
import ShinyText from './components/ShinyText';
import BorderGlow from './components/BorderGlow';
import TiltedCard from './components/TiltedCard';
import Beams from './components/Beams';

// Crypto Card Component to handle individual expansion state
function CryptoCard({ crypto, onCopy, copiedAddress }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(crypto.networks ? crypto.networks[0] : null);
  const isCopied = copiedAddress === (currentNetwork ? currentNetwork.address : crypto.address);

  const displayAddress = currentNetwork ? currentNetwork.address : crypto.address;
  const displayLabel = currentNetwork ? currentNetwork.label : `Scan to send ${crypto.symbol}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[400px] mx-auto"
    >
      <BorderGlow 
        backgroundColor="#060010" 
        colors={['#c084fc', '#f472b6', '#38bdf8']} 
        className="w-full"
      >
        <div className="p-6 flex flex-col gap-4 bg-black/40 rounded-[27px] transition-all duration-300 w-full h-full overflow-hidden group">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden p-2 shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
                <motion.img 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  src={crypto.icon} 
                  alt={crypto.name} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg leading-tight">{crypto.name}</h4>
                <span className="text-slate-400 text-sm font-medium">{crypto.subtitle || crypto.symbol}</span>
              </div>
            </div>
            <button 
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all duration-300 border border-white/10 shrink-0 ml-4 active:scale-95"
            >
              {isOpen ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-4">
                  
                  {crypto.networks && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 shrink-0">Network</label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none bg-white/5 border border-white/10 text-white text-xs font-medium rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-pink-500/50 transition-colors"
                          value={currentNetwork.id}
                          onChange={(e) => setCurrentNetwork(crypto.networks.find((n: any) => n.id === e.target.value))}
                        >
                          {crypto.networks.map((net: any) => (
                            <option key={net.id} value={net.id} className="bg-[#110e18] text-white">{net.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-pink-500/50">
                          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-slate-400 break-all text-center">
                      {displayAddress}
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(displayAddress);
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 border backdrop-blur-md ${isCopied ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      {isCopied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Address</>}
                    </motion.button>
                  </div>

                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center mt-2"
                  >
                    <div className="bg-white/90 border border-white/20 p-3 rounded-2xl flex flex-col items-center gap-2 shadow-xl shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayAddress}`} 
                        alt="QR Code" 
                        className="w-[120px] h-[120px] rounded-lg"
                        loading="lazy"
                      />
                      <span className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-tight">{displayLabel}</span>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'donate'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#donate') {
        setView('donate');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const cryptoOptions = [
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      subtitle: 'BTC — Multiple networks available',
      icon: 'https://i.postimg.cc/NMS3w0xJ/1200px-Bitcoin.png',
      networks: [
        { id: 'legacy', name: 'BTC Legacy', address: '167HX6GAhSsfv4rVSohxVFgikaUiN8411t', label: 'Scan to send BTC (Legacy)' },
        { id: 'segwit', name: 'BTC SegWit (Native)', address: 'bc1qdcn4v4utm2ma5dk29azqu4m5gjvn3mygq3es42', label: 'Scan to send BTC (SegWit)' },
        { id: 'bsc', name: 'BSC (Wrapped BTC)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send BTC (BSC)' },
      ]
    },
    { 
      name: 'Ethereum / EVM', 
      symbol: 'ETH', 
      subtitle: 'ETH · BSC · BASE · OPTIMISM — same address',
      icon: 'https://i.postimg.cc/zBVsMhTs/250px-Ethereum-icon-purple.png',
      networks: [
        { id: 'eth', name: 'Ethereum (ETH)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on ETH' },
        { id: 'bsc', name: 'BNB Smart Chain (BSC)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on BSC' },
        { id: 'base', name: 'Base', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on Base' },
        { id: 'optimism', name: 'Optimism', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on Optimism' },
      ]
    },
    { name: 'Tether', symbol: 'USDT', subtitle: 'TRC20 — Tron Network', address: 'TKoQwvUxjxGQMv6VGvVp9RsEsbiemYX4mM', icon: 'https://i.postimg.cc/fyvX60fP/image.png' },
    { name: 'Solana', symbol: 'SOL', subtitle: 'SOL — Solana Network', address: 'Gmv3yf3HFHFsNJC6E5T3tFHYzCKKdCMkR9QHMMjTEvzo', icon: 'https://i.postimg.cc/Tw6Kf31M/image.png' },
    { name: 'Litecoin', symbol: 'LTC', subtitle: 'LTC — Litecoin Network', address: 'LcGy7NBaceSTAEVr1aL1e4EFrf8MwM6JgW', icon: 'https://i.postimg.cc/3wcHFSMC/image.png' },
  ];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-200 font-sans selection:bg-pink-500/30 flex flex-col">
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={3}
          beamHeight={30}
          beamNumber={20}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      {/* Pill Navbar like reference */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full flex justify-center">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="flex items-center justify-between px-6 py-2.5 rounded-full bg-[#110e18]/80 border border-white/10 backdrop-blur-md shadow-2xl min-w-[300px] md:min-w-[420px]"
        >
          <a href="#" className="flex items-center gap-3 text-white font-medium text-base">
            <img src="https://i.postimg.cc/t4vcKsrg/cat.png" alt="Logo" className="w-5 h-5 object-cover rounded-full" />
            <ShinyText text="PawFund" speed={3} className="font-bold tracking-tight" />
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#donate" className="hover:text-white transition-colors">Donate</a>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-28 px-4 bg-[#060010]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#" onClick={() => setIsNavOpen(false)} className="glass-panel p-4 text-center text-white font-medium">Home</a>
              <a href="#donate" onClick={() => setIsNavOpen(false)} className="glass-panel p-4 text-center text-white font-medium">Donate</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-48 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto flex-1 w-full">
        
        {view === 'home' ? (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="flex flex-col gap-32"
          >
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center space-y-16 min-h-[45vh]">
              <div className="space-y-8">
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md mx-auto"
                >
                  <Activity className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                  100% Transparent Cat Welfare
                </motion.div>

                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight leading-[1.1]"
                >
                  <ShinyText 
                    text="A gentle glow to light" 
                    speed={3} 
                    color="#ffffff" 
                    shineColor="#f472b6" 
                    className="italic"
                  /> <br />
                  <ShinyText 
                    text="their way!" 
                    speed={3} 
                    delay={1.5}
                    color="#f472b6" 
                    shineColor="#ffffff" 
                    className="italic"
                  />
                </motion.h1>
              </div>

              <motion.div 
                variants={itemVariants}
                className="flex flex-row items-center justify-center gap-6"
              >
                <a href="#donate" className="w-[180px] py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 text-center flex items-center justify-center gap-2 group">
                  <HandHeart className="w-4.5 h-4.5 text-pink-600 group-hover:scale-110 transition-transform" />
                  Donate
                </a>
                <a href="https://www.tiktok.com/@azenithx" target="_blank" rel="noreferrer" className="w-[180px] py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 active:scale-95 group">
                  <div className="bg-black/40 p-1.5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                    <img src="https://i.postimg.cc/7Zw7qbTM/image.png" className="w-3.5 h-3.5 object-contain invert opacity-80 group-hover:opacity-100 transition-opacity" alt="TikTok" />
                  </div>
                  TikTok
                </a>
              </motion.div>
            </section>

            {/* Categories Section */}
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-[1000px] mx-auto w-full px-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <motion.div variants={itemVariants}>
                  <TiltedCard 
                    containerHeight="260px"
                    imageHeight="260px"
                    imageWidth="100%"
                    displayOverlayContent={true}
                    rotateAmplitude={12}
                    scaleOnHover={1.03}
                    overlayContent={
                      <div className="p-8 w-full h-full flex flex-col justify-center gap-5 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl group transition-all duration-500" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                        <div 
                          className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/20 group-hover:border-pink-500/40 transition-all duration-300"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <HandHeart className="w-7 h-7 text-pink-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-2.5" style={{ transform: "translateZ(10px)" }}>
                          <h3 className="text-2xl font-bold text-white tracking-tight">Litter & Bedding</h3>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">Clean litter boxes and warm, comfortable sleeping supplies for rescued cats.</p>
                        </div>
                      </div>
                    }
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TiltedCard 
                    containerHeight="260px"
                    imageHeight="260px"
                    imageWidth="100%"
                    displayOverlayContent={true}
                    rotateAmplitude={12}
                    scaleOnHover={1.03}
                    overlayContent={
                      <div className="p-8 w-full h-full flex flex-col justify-center gap-5 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl group transition-all duration-500" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                        <div 
                          className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-all duration-300"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <Heart className="w-7 h-7 text-sky-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-2.5" style={{ transform: "translateZ(10px)" }}>
                          <h3 className="text-2xl font-bold text-white tracking-tight">Food & Nutrition</h3>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">Daily nutritious meals, kitten formula, and specialized diet support for recovery.</p>
                        </div>
                      </div>
                    }
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TiltedCard 
                    containerHeight="260px"
                    imageHeight="260px"
                    imageWidth="100%"
                    displayOverlayContent={true}
                    rotateAmplitude={12}
                    scaleOnHover={1.03}
                    overlayContent={
                      <div className="p-8 w-full h-full flex flex-col justify-center gap-5 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl group transition-all duration-500" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                        <div 
                          className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <Home className="w-7 h-7 text-purple-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-2.5" style={{ transform: "translateZ(10px)" }}>
                          <h3 className="text-2xl font-bold text-white tracking-tight">Shelter</h3>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">Temporary rescue enclosures, insulated winter crates, and safe housing setups.</p>
                        </div>
                      </div>
                    }
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TiltedCard 
                    containerHeight="260px"
                    imageHeight="260px"
                    imageWidth="100%"
                    displayOverlayContent={true}
                    rotateAmplitude={12}
                    scaleOnHover={1.03}
                    overlayContent={
                      <div className="p-8 w-full h-full flex flex-col justify-center gap-5 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl group transition-all duration-500" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                        <div 
                          className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <Stethoscope className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-2.5" style={{ transform: "translateZ(10px)" }}>
                          <h3 className="text-2xl font-bold text-white tracking-tight">Medical Care</h3>
                          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">Veterinary checkups, vaccines, and emergency treatments only when cats are sick.</p>
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              </div>
            </motion.section>
          </motion.div>
        ) : (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 w-full max-w-[1000px] mx-auto py-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Make a Donation</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">Select your preferred cryptocurrency network to reveal the wallet address.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {cryptoOptions.map((crypto) => (
                <CryptoCard key={crypto.symbol} crypto={crypto} onCopy={handleCopy} copiedAddress={copiedAddress} />
              ))}
            </div>
          </motion.section>
        )}

      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <img src="https://i.postimg.cc/t4vcKsrg/cat.png" alt="Logo" className="w-5 h-5 object-cover rounded-full" />
            PawFund
          </div>
          <p className="text-slate-500 text-sm">© 2026 PawFund. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.tiktok.com/@azenithx" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <div className="bg-black/40 p-1 rounded-full border border-white/5">
                <img src="https://i.postimg.cc/7Zw7qbTM/image.png" className="w-3.5 h-3.5 object-contain invert opacity-60 hover:opacity-100 transition-opacity" alt="TikTok" />
              </div>
              TikTok
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}