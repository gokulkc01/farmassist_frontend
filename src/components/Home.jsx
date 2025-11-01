import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Droplets, Wind, Leaf, DollarSign, MoreHorizontal } from 'lucide-react';

const Home = ({navigateTo, openModal}) => {
  const {isAuthenticated, user} = useAuth();
  //const [user, setUser] = useState({ name: 'John' });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cards = [
    { id: 'weather', icon: Wind, title: 'Weather', gradient: 'from-blue-400 to-cyan-500', color: 'text-blue-500' },
    { id: 'soilHealth', icon: Sparkles, title: 'Soil Health', gradient: 'from-amber-600 to-orange-500', color: 'text-amber-600' },
    { id: 'soilMoisture', icon: Droplets, title: 'Soil Moisture', gradient: 'from-cyan-400 to-blue-500', color: 'text-cyan-500' },
    { id: 'Motor', icon: TrendingUp, title: 'Motor', gradient: 'from-purple-500 to-pink-500', color: 'text-purple-500' },
    { id: 'PlantHealth', icon: Leaf, title: 'Plant Health', gradient: 'from-green-500 to-emerald-600', color: 'text-green-600' },
    { id: 'PriceCard', icon: DollarSign, title: 'Market Prices', gradient: 'from-yellow-500 to-orange-500', color: 'text-yellow-600' },
    { id: 'More', icon: MoreHorizontal, title: 'More', gradient: 'from-slate-500 to-gray-600', color: 'text-slate-600' }
  ];

   const handleCardClick = (page) => {
        if (isAuthenticated) {
            navigateTo(page);
        } else {
            openModal('login');
        }
    };

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigateTo('dashboard');
        } else {
            openModal('signup');
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl"
          style={{
            right: `${mousePosition.x * 0.015}px`,
            bottom: `${mousePosition.y * 0.015}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl shadow-2xl p-8 mb-8 hover:shadow-3xl transition-all duration-500">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
                <Sparkles className="w-4 h-4" />
                Smart Farming Technology
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
                FarmAssist
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                Precision agriculture tools powered by AI. Monitor weather, optimize soil health, manage irrigation, and boost yields with intelligent insights.
              </p>
              
              <button 
                onClick={handleGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            <div className="lg:min-w-[280px]">
              <div className="backdrop-blur-md bg-white/70 border border-white/60 rounded-2xl p-6 shadow-xl">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {user?.name}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Welcome back,</p>
                        <p className="text-lg font-bold text-gray-800">{user?.name}! 👨‍🌾</p>
                      </div>
                    </div>
                    <button onClick={()=> navigateTo('dashboard')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                      🌾
                    </div>
                    <div>
                      <p className="text-gray-600 mb-4">Welcome, Farmer</p>
                      <button 
                        onClick={() => openModal('login')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardClick(card.id)}
                className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className={`text-lg font-bold ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                    {card.title}
                  </h3>
                  
                  {/* Hover Indicator */}
                  <div className="w-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent group-hover:w-full transition-all duration-500 opacity-0 group-hover:opacity-100" />
                </div>

                {/* Corner Accent */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-12 backdrop-blur-xl bg-white/60 border border-white/40 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Farmers', icon: '👨‍🌾' },
              { value: '50K+', label: 'Hectares Monitored', icon: '🌾' },
              { value: '98%', label: 'Satisfaction Rate', icon: '⭐' }
            ].map((stat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="text-5xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;