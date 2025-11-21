import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, User, Share2, Download, Zap, Star, Target, Trophy, Shield, Heart, Twitter, LogIn } from 'lucide-react';
import sdk from '@farcaster/frame-sdk';
import { FarcasterUser, ZodiacPrediction } from '../types';
import { ZODIAC_SIGNS, ZODIAC_PREDICTIONS, CRYPTO_ADVICE } from '../lib/zodiac-data';

const ZodiacCryptoPredictor: React.FC = () => {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<ZodiacPrediction | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Initialize Farcaster SDK
  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context?.user) {
          setUser(context.user as FarcasterUser);
        }
        sdk.actions.ready();
      } catch (error) {
        console.error('SDK initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const handleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      const result = await sdk.actions.signIn();
      
      if (result.user) {
        setUser(result.user as FarcasterUser);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePrediction = (signId: string) => {
    setGenerating(true);
    setSelectedSign(signId);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const signData = ZODIAC_SIGNS.find(s => s.id === signId);
      const predictionData = ZODIAC_PREDICTIONS[signId as keyof typeof ZODIAC_PREDICTIONS];
      
      if (signData && predictionData) {
        setPrediction({
          sign: signData.name,
          ...predictionData
        });
      }
      
      setGenerating(false);
      
      // Scroll to result on mobile
      const resultElement = document.getElementById('prediction-result');
      if (resultElement && window.innerWidth < 1024) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1500);
  };

  const downloadPrediction = () => {
    if (!prediction || !user) return;
    
    const content = `
🌌 Crypto Zodiac Prediction for @${user.username} 🌌

✨ ${prediction.sign} - ${prediction.personality} ✨

🎯 Trading Style: ${prediction.tradingStyle}
💎 Perfect Coin: ${prediction.perfectCoin}
⚡ Strength: ${prediction.cryptoStrength}
⚠️ Weakness: ${prediction.weakness}

🔮 Prediction: ${prediction.prediction}
💡 Advice: ${prediction.advice}

❤️ Compatible with: ${prediction.compatibility.map(s => ZODIAC_SIGNS.find(z => z.id === s)?.name).join(', ')}
🍀 Lucky Number: ${prediction.luckyNumber}
🎨 NFT Style: ${prediction.nftStyle}

Generated via Farcaster Zodiac Crypto Predictor
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `crypto-zodiac-${user.username}-${prediction.sign}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sharePrediction = () => {
    if (!prediction || !user) return;
    
    const text = `🔮 My Crypto Zodiac Prediction: I'm a ${prediction.sign} ${prediction.personality}! ${prediction.prediction} 

Check your crypto horoscope at [YOUR_APP_URL]`;

    if (navigator.share) {
      navigator.share({
        title: 'My Crypto Zodiac Prediction',
        text: text,
        url: window.location.href
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    if (!prediction || !user) return;
    
    const text = `🔮 My Crypto Zodiac Prediction: I'm a ${prediction.sign} ${prediction.personality}! ${prediction.prediction} 

Check your crypto horoscope 👇`;
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-400 border-opacity-80 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-base font-semibold animate-pulse">
            Loading Cosmic Connections...
          </p>
        </div>
      </div>
    );
  }

  // Sign In Screen if no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center space-y-8 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-cyan-500/20 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-cyan-500 p-3 rounded-2xl shadow-lg shadow-cyan-500/20 animate-pulse">
              <Sparkles className="text-white" size={32} />
            </div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Crypto Zodiac
            </h1>
            <p className="text-cyan-200/80 text-lg">
              Unlock your cosmic trading personality
            </p>
          </div>

          <div className="py-8">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full mx-auto flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-ping opacity-20"></div>
              <Shield className="text-cyan-400" size={40} />
            </div>
            <p className="text-sm text-cyan-300/60 px-8">
              Connect your Farcaster account to discover your trading destiny
            </p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-white hover:bg-cyan-50 text-purple-900 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            <span>Sign in with Farcaster</span>
          </button>
        </div>
        
        <p className="mt-8 text-cyan-300/40 text-xs">
          Powered by Farcaster Frames v2
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white font-sans">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-cyan-500 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Crypto Zodiac
            </h1>
          </div>
          <p className="text-cyan-200/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover your crypto trading personality based on ancient zodiac wisdom and blockchain energy
          </p>
        </div>

        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-cyan-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="bg-cyan-500/20 p-3 rounded-xl shrink-0 overflow-hidden">
                {user.pfpUrl ? (
                  <img src={user.pfpUrl} alt={user.username} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="text-cyan-400" size={24} />
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                  {user.displayName || `@${user.username}`}
                </h3>
                <p className="text-cyan-300/70 text-sm">@{user.username} • FID: {user.fid}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 w-full sm:w-auto justify-center sm:justify-start">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 text-xs sm:text-sm font-medium">Cosmically Connected</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Zodiac Selection */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Target className="text-cyan-400" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Choose Your Sign</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign.id}
                    onClick={() => generatePrediction(sign.id)}
                    disabled={generating}
                    className={`p-2 sm:p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px] ${
                      selectedSign === sign.id
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25 scale-105'
                        : 'border-cyan-500/30 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10'
                    } ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-2xl sm:text-2xl mb-1 sm:mb-2 transform transition-transform group-hover:scale-110">{sign.emoji}</div>
                    <div className="font-semibold text-white text-xs sm:text-sm">{sign.name}</div>
                    <div className="text-cyan-300/60 text-[10px] sm:text-xs hidden sm:block">{sign.dates}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cosmic Advice */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-purple-400" size={20} />
                <h3 className="text-lg font-bold text-white">Universal Wisdom</h3>
              </div>
              <div className="space-y-3">
                {CRYPTO_ADVICE.slice(0, 6).map((advice, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm text-cyan-200/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                    <span className="leading-relaxed">{advice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prediction Display */}
          <div className="space-y-6" id="prediction-result">
            {generating ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 flex items-center justify-center min-h-[300px] sm:h-96 shadow-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 border-opacity-80 mx-auto mb-4"></div>
                  <p className="text-cyan-400 text-lg font-semibold animate-pulse">
                    Reading Signals...
                  </p>
                  <p className="text-cyan-300/60 text-sm mt-2">
                    Aligning stars & blockchain
                  </p>
                </div>
              </div>
            ) : prediction ? (
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-cyan-500/20 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                  <div className="text-5xl sm:text-6xl mb-2 animate-bounce duration-[2000ms]">{ZODIAC_SIGNS.find(s => s.id === selectedSign)?.emoji}</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{prediction.sign}</h2>
                  <p className="text-cyan-300 text-base sm:text-lg font-semibold">{prediction.personality}</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Zap className="text-yellow-400" size={16} />
                        <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Trading Style</span>
                      </div>
                      <p className="text-white text-sm">{prediction.tradingStyle}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Star className="text-cyan-400" size={16} />
                        <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Perfect Coin</span>
                      </div>
                      <p className="text-white text-sm">{prediction.perfectCoin}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <Trophy className="text-green-400" size={16} />
                      <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Crypto Strength</span>
                    </div>
                    <p className="text-white text-sm">{prediction.cryptoStrength}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <Target className="text-orange-400" size={16} />
                      <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Weakness</span>
                    </div>
                    <p className="text-white text-sm">{prediction.weakness}</p>
                  </div>

                  <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={40} />
                    </div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                      <Sparkles className="text-purple-400" size={16} />
                      <span className="text-purple-300 font-semibold text-sm">Cosmic Prediction</span>
                    </div>
                    <p className="text-white text-sm italic relative z-10 leading-relaxed">"{prediction.prediction}"</p>
                  </div>

                  <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="text-cyan-400" size={16} />
                      <span className="text-cyan-300 font-semibold text-sm">Zodiac Advice</span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">"{prediction.advice}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="text-pink-400" size={16} />
                        <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Compatible With</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prediction.compatibility.map((signId) => {
                          const sign = ZODIAC_SIGNS.find(s => s.id === signId);
                          return sign ? (
                            <span key={signId} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-lg border border-pink-500/30">
                              {sign.emoji} {sign.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-yellow-400" size={16} />
                        <span className="text-cyan-300 font-semibold text-xs sm:text-sm">Lucky Number</span>
                      </div>
                      <p className="text-white text-2xl font-bold">{prediction.luckyNumber}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={downloadPrediction}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-cyan-900/20"
                    >
                      <Download size={18} />
                      <span>Save</span>
                    </button>
                    <div className="flex gap-3 flex-1">
                        <button
                        onClick={sharePrediction}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-purple-900/20"
                        >
                        <Share2 size={18} />
                        <span>{showShare ? 'Copied!' : 'Share'}</span>
                        </button>
                        <button
                        onClick={shareOnTwitter}
                        className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                        <Twitter size={18} />
                        <span>Tweet</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 flex items-center justify-center min-h-[250px] sm:h-96 shadow-xl">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">🌌</div>
                  <h3 className="text-xl font-bold text-white mb-2">Awaiting Your Sign</h3>
                  <p className="text-cyan-300/60 text-sm sm:text-base px-4">
                    Select your zodiac sign from the grid to reveal your crypto destiny
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 pt-6 border-t border-cyan-500/20">
          <p className="text-cyan-300/40 text-xs sm:text-sm px-4">
            🔮 Powered by cosmic energy and blockchain technology • Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCryptoPredictor;
