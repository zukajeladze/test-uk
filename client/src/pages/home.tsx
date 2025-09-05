import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/hooks/use-auth";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AuctionCard } from "@/components/auction-card";
import { UpcomingAuctionCard } from "@/components/upcoming-auction-card";
import { Button } from "@/components/ui/button";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Link } from "wouter";
import { socketService } from "@/lib/socket";
import { createSlug } from "@/lib/utils";
import type { Auction, Bid } from "@/types/auction";

// Revolutionary Split-Screen Hero Component
function RevolutionaryHero({ formatCurrency, auctionsData }: { 
  formatCurrency: (amount: number) => string;
  auctionsData?: { live: Auction[]; upcoming: Auction[]; finished: Auction[] };
}) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasLoadedData, setHasLoadedData] = useState(false);

  useEffect(() => {
    // Find the QB/1113 Samsung auction
    const samsungAuction = auctionsData?.upcoming?.find(auction => 
      auction.title.toLowerCase().includes('samsung galaxy z fold 7') ||
      auction.title.toLowerCase().includes('qb/1113')
    );
    
    const updateCountdown = () => {
      const now = Date.now();
      let difference = 0;
      
      if (samsungAuction) {
        setHasLoadedData(true);
        const auctionStart = new Date(samsungAuction.startTime).getTime();
        difference = auctionStart - now;
      } else if (hasLoadedData) {
        const auctionStart = Date.now() + (48 * 60 * 60 * 1000);
        difference = auctionStart - now;
      } else {
        difference = 0;
      }
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auctionsData, hasLoadedData]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-40 cyber-grid"
        />
        
        {/* Dynamic light beams */}
        <motion.div 
          className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-brand-500/20 via-transparent to-transparent"
          animate={{ 
            opacity: [0.2, 0.8, 0.2],
            scaleX: [1, 1.5, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-electric-500/20 via-transparent to-transparent"
          animate={{ 
            opacity: [0.8, 0.2, 0.8],
            scaleX: [1.5, 1, 1.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Split screen layout */}
      <div className="relative z-10 flex">
        {/* Left Panel - Dark with neon accents */}
                  <motion.div 
            className="w-full lg:w-3/5 py-14 flex flex-col justify-center px-8 sm:px-16 lg:px-20"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
          {/* Floating status indicator */}
          <motion.div 
            className="absolute top-8 left-8 flex items-center space-x-3"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div 
              className="w-3 h-3 bg-neon-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/80 text-sm font-medium tracking-wide">LIVE PREVIEW</span>
          </motion.div>

          <div className="space-y-12">
            {/* Dramatic headline */}
            <div className="space-y-8">
              <motion.div 
                className="inline-flex items-center px-6 py-3 rounded-full border  bg-neon-400/10 text-neon-400"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                whileHover={{ 
                  borderColor: "rgba(34, 211, 238, 0.6)",
                  backgroundColor: "rgba(34, 211, 238, 0.2)"
                }}
              >
                <motion.div 
                  className="w-2 h-2 bg-neon-400 rounded-full mr-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-bold tracking-widest">ЭКСКЛЮЗИВНАЯ ПРЕМЬЕРА</span>
              </motion.div>
              
              <AnimatedText 
                className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-none tracking-tight"
                animation="whipInUp"
                delay={0.1}
              >
                Samsung Galaxy
              </AnimatedText>
              
              <AnimatedText 
                className="text-3xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-neon-400 via-brand-400 to-electric-400 bg-clip-text text-transparent leading-none tracking-tight"
                animation="whipInUp"
                delay={0.2}
              >
                Z Fold 7
              </AnimatedText>
              
              <AnimatedText 
                className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed font-light max-w-lg"
                animation="calmInUp"
                delay={0.3}
              >
                Первый в мире аукцион революционного складного смартфона
              </AnimatedText>
              
              <motion.div 
                className="flex items-center space-x-4 text-white/60"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <motion.i 
                  className="fas fa-star text-sunset-500 text-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-base sm:text-lg">Официальная модель • Гарантия Samsung • Новый в упаковке</span>
                <motion.i 
                  className="fas fa-star text-sunset-500 text-lg"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* Futuristic countdown */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              <AnimatedText 
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-white"
                animation="calmInUp"
                delay={0.4}
              >
                Аукцион начинается через
              </AnimatedText>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: timeLeft.days, label: 'дней', color: 'neon' },
                  { value: timeLeft.hours, label: 'часов', color: 'brand' },
                  { value: timeLeft.minutes, label: 'минут', color: 'electric' },
                  { value: timeLeft.seconds, label: 'секунд', color: 'sunset' }
                ].map((unit, index) => (
                  <motion.div 
                    key={unit.label}
                    className="text-center"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <motion.div 
                      className={`relative w-full aspect-square bg-gradient-to-br from-${unit.color}-500/20 to-${unit.color}-600/10 backdrop-blur-sm border border-${unit.color}-400/30 rounded-2xl flex items-center justify-center group`}
                      whileHover={{ 
                        scale: 1.05,
                        borderColor: `rgba(34, 211, 238, 0.6)`,
                        backgroundColor: `rgba(34, 211, 238, 0.1)`
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br from-${unit.color}-400/10 to-transparent rounded-2xl`}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      />
                      <span className="relative z-10 text-3xl sm:text-4xl font-black text-white group-hover:text-neon-400 transition-colors duration-300">
                        {unit.value.toString().padStart(2, '0')}
                      </span>
                    </motion.div>
                    <span className="block text-xs text-white/60 mt-2 tracking-widest font-bold">
                      {unit.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              <motion.button 
                onClick={() => window.location.href = '/auction/samsung-galaxy-z-fold-7-qb-1113'}
                className="group w-full bg-gradient-to-r from-neon-500 via-brand-500 to-electric-500 text-white text-xl font-black py-6 px-8 rounded-2xl shadow-2xl relative overflow-hidden border border-white/20"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 50px rgba(34, 211, 238, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  <motion.i 
                    className="fas fa-rocket text-xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>Уведомить о старте аукциона</span>
                </div>
              </motion.button>
              
              <motion.button 
                className="group w-full border-2 border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white text-lg sm:text-xl font-semibold py-4 sm:py-6 px-8 sm:px-10 rounded-2xl transition-all duration-300 backdrop-blur-sm bg-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <i className="fas fa-user-plus mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
                Создать аккаунт
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Light with product focus */}
        <motion.div 
          className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-white via-brand-50 to-electric-50 flex-col  px-12 relative overflow-hidden"
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-20 right-20 w-20 h-20 border-2 border-brand-200 rounded-full"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-32 left-16 w-16 h-16 bg-electric-200/30 rounded-lg"
            animate={{ 
              rotate: [0, 45, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Product showcase */}
          <motion.div 
            className="w-full max-w-md md:sticky md:top-24"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {/* Main product container */}
            <motion.div 
              className="aspect-square bg-white/90 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border border-white/50 relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  "0 25px 50px rgba(0, 0, 0, 0.1)",
                  "0 35px 70px rgba(14, 165, 233, 0.2)",
                  "0 25px 50px rgba(0, 0, 0, 0.1)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%), 
                                   radial-gradient(circle at 75% 75%, #d946ef 0%, transparent 50%)`
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative z-10 h-full flex items-center justify-center">
                              <motion.img 
                src="https://www.spark.co.nz/content/dam/spark/images/product-images/devices/phones/samsung/z-series/z-fold7/zfold7-blue-shadow-1.png" 
                alt="Samsung Galaxy Z Fold 7" 
                className="w-full h-full object-contain"
                initial={{ opacity: 1 }}
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              </div>
            </motion.div>

            {/* Floating price tags */}
            <motion.div 
              className="absolute -top-8 -left-8 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-white"
              initial={{ opacity: 1, scale: 1, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ duration: 0.1 }}
              whileHover={{ rotate: 0, scale: 1.1 }}
            >
              <div className="text-center">
                <div className="text-xs font-bold opacity-80">RETAIL</div>
                <div className="text-lg font-black line-through">{formatCurrency(179900)}</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-8 -right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-white"
              initial={{ opacity: 1, scale: 1, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 10 }}
              transition={{ duration: 0.1 }}
              whileHover={{ rotate: 0, scale: 1.1 }}
            >
              <div className="text-center">
                <div className="text-xs font-bold opacity-80">START</div>
                <div className="text-lg font-black">{formatCurrency(0.01)}</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentTitle("Deshevshe.ua - №1 Пенни-аукционы в Кыргызстане | Выиграй iPhone за копейки");
  
  const { connected } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const { formatCurrency } = useSettings();
  const { t } = useLanguage();
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [auctionBids, setAuctionBids] = useState<Record<string, Bid[]>>({});
  const [visibleUpcomingCount, setVisibleUpcomingCount] = useState(9);

  const { data: auctionsData } = useQuery<{
    live: Auction[];
    upcoming: Auction[];
    finished: Auction[];
  }>({
    queryKey: ["/api/auctions"],
  });

  const { data: timerData } = useQuery<Record<string, number>>({
    queryKey: ["/api/timers"],
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (timerData) {
      setTimers(timerData);
    }
  }, [timerData]);

  useEffect(() => {
    if (connected) {
      socketService.onTimerUpdate((newTimers) => {
        setTimers(newTimers);
      });

      socketService.onAuctionUpdate((data) => {
        if (data.auction && data.bids) {
          setAuctionBids(prev => ({
            ...prev,
            [data.auction.id]: data.bids,
          }));
        }
        if (data.timers) {
          setTimers(data.timers);
        }
      });

      return () => {
        socketService.offTimerUpdate();
        socketService.offAuctionUpdate();
      };
    }
  }, [connected]);

  const calculateTimeToStart = (startTime: string): number => {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((start - now) / 1000));
  };

  const handleLoadMore = () => {
    setVisibleUpcomingCount(prev => prev + 3);
  };

  const sortedUpcomingAuctions = auctionsData?.upcoming
    ?.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || [];
  
  const visibleUpcomingAuctions = sortedUpcomingAuctions.slice(0, visibleUpcomingCount);
  const hasMoreAuctions = sortedUpcomingAuctions.length > visibleUpcomingCount;

  return (
    <div className="bg-black min-h-screen">
      <Header />
      
      {/* Revolutionary Hero Section */}
      <RevolutionaryHero formatCurrency={formatCurrency} auctionsData={auctionsData} />

      {/* Completely new content layout */}
      <div className="relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        {/* Cyber grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20 cyber-grid" />
          
          {/* Floating orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-neon-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-electric-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>
        
        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-20">
          {/* New layout structure */}
          <div className="space-y-32">
            {/* Section 01 - Featured Packages */}
            {(() => {
              const bidPackageAuctions = auctionsData?.upcoming?.filter(auction => auction.isBidPackage) || [];
              
              if (bidPackageAuctions.length === 0) {
                return null;
              }

              return (
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {/* Giant Number */}
                  <motion.div 
                    className="lg:col-span-1 text-center lg:text-left"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <motion.div 
                      className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-neon-400 to-brand-500 bg-clip-text text-transparent leading-none"
                      animate={{ 
                        backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      01
                    </motion.div>
                    <motion.div 
                      className="w-24 h-1 bg-gradient-to-r from-neon-400 to-brand-500 mx-auto lg:mx-0 mt-4"
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                      <AnimatedHeading 
                        level={2}
                        className="text-4xl lg:text-6xl font-black text-white leading-tight"
                        animation="whipInUp"
                        delay={0.1}
                      >
                        Пакеты ставок с супер скидками!
                      </AnimatedHeading>
                      
                      <AnimatedText 
                        className="text-xl text-white/80 leading-relaxed max-w-2xl"
                        animation="calmInUp"
                        delay={0.2}
                      >
                        Получите больше ставок за меньшие деньги. Ограниченное время!
                      </AnimatedText>
                    </div>

                    {/* Card deck layout */}
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
                        {bidPackageAuctions.slice(0, 4).map((auction, index) => (
                          <Link 
                            key={auction.id}
                            href={`/auction/${createSlug(auction.title, auction.displayId)}`}
                          >
                            <motion.div 
                              className="group relative min-w-[280px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-neon-400/20 shadow-2xl overflow-hidden cursor-pointer"
                              initial={{ opacity: 1, x: 0, rotateY: 0 }}
                              animate={{ opacity: 1, x: 0, rotateY: 0 }}
                              transition={{ duration: 0.1 }}
                              whileHover={{ 
                                scale: 1.05,
                                y: -10,
                                rotateY: 5,
                                boxShadow: "0 30px 60px rgba(34, 211, 238, 0.3)"
                              }}
                            >
                              {/* Glowing border effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-neon-400/20 via-transparent to-electric-400/20 rounded-3xl"
                                animate={{ 
                                  opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                              />
                              
                              {/* Hot badge */}
                              <motion.div 
                                className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg z-20"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                HOT
                              </motion.div>

                              <div className="relative z-10 space-y-6">
                                {/* Product image */}
                                <motion.div 
                                  className="w-full h-40 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <img
                                    src={auction.imageUrl}
                                    alt={auction.title}
                                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                  />
                                </motion.div>

                                {/* Package details */}
                                <div className="space-y-4">
                                  <h3 className="font-black text-lg text-white group-hover:text-neon-400 transition-colors duration-300 leading-tight">
                                    {auction.title}
                                  </h3>
                                  
                                  <div className="space-y-3">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                      <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Стоимость пакета</div>
                                      <div className="text-2xl font-black bg-gradient-to-r from-neon-400 to-electric-400 bg-clip-text text-transparent">
                                        {formatCurrency(auction.retailPrice)}
                                      </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-brand-600 to-electric-600 text-white rounded-xl p-3">
                                      <div className="text-xs uppercase tracking-wider mb-1 opacity-80">Аукцион начинается</div>
                                      <div className="text-sm font-bold">
                                        {new Date(auction.startTime).toLocaleDateString('ru-RU', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>
                                  </div>

                                  {auction.prebidsCount && auction.prebidsCount > 0 && (
                                    <div className="flex items-center justify-center space-x-2 bg-neon-400/20 backdrop-blur-sm rounded-xl p-3 border border-neon-400/30">
                                      <i className="fas fa-users text-neon-400"></i>
                                      <span className="text-sm font-bold text-white">
                                        {auction.prebidsCount} участников готовы
                                      </span>
                                    </div>
                                  )}

                                  <motion.div 
                                    className="bg-gradient-to-r from-sunset-500 to-sunset-600 text-white font-black py-4 px-6 rounded-xl shadow-lg text-center group-hover:shadow-2xl transition-all duration-300"
                                    whileHover={{ 
                                      scale: 1.05,
                                      boxShadow: "0 0 30px rgba(249, 115, 22, 0.6)"
                                    }}
                                  >
                                    <i className="fas fa-gift mr-2 group-hover:rotate-12 transition-transform duration-300"></i>
                                    Участвовать
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>

                      {/* View all button */}
                      {bidPackageAuctions.length > 4 && (
                        <motion.div 
                          className="text-center mt-8"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2, duration: 0.6 }}
                        >
                          <Link href="/auctions">
                            <motion.button
                              className="bg-gradient-to-r from-neon-500 to-electric-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm"
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 0 40px rgba(34, 211, 238, 0.5)"
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <i className="fas fa-eye mr-3"></i>
                              Посмотреть все пакеты ({bidPackageAuctions.length})
                            </motion.button>
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })()}

            {/* Section 02 - Live Battle Zone */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {/* Giant Number */}
              <motion.div 
                className="lg:col-span-1 text-center lg:text-left"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div 
                  className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent leading-none"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.5)",
                      "0 0 40px rgba(239, 68, 68, 0.8)",
                      "0 0 20px rgba(239, 68, 68, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  02
                </motion.div>
                <motion.div 
                  className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto lg:mx-0 mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                
                {/* Connection status */}
                <motion.div 
                  className="mt-8 flex items-center justify-center lg:justify-start space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <motion.div 
                    className={`w-4 h-4 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white/80 font-bold text-sm tracking-wide">
                    {connected ? t("connected") : t("disconnected")}
                  </span>
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                                        <AnimatedHeading 
                        level={2}
                        className="text-4xl lg:text-6xl font-black text-white leading-tight"
                        animation="whipInUp"
                        delay={0.1}
                      >
                        {t("liveAuctions")}
                      </AnimatedHeading>
                      
                      <AnimatedText 
                        className="text-xl text-white/80 leading-relaxed max-w-2xl"
                        animation="calmInUp"
                        delay={0.2}
                      >
                        Активные аукционы в режиме реального времени. Каждая секунда может изменить всё.
                      </AnimatedText>
                </div>

                {auctionsData?.live?.length === 0 ? (
                  <motion.div 
                    className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-neon-400/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <motion.i 
                      className="fas fa-satellite-dish text-neon-400 text-6xl mb-6"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <AnimatedText 
                      className="text-2xl font-bold text-white mb-4"
                      animation="calmInUp"
                      delay={1.1}
                    >
                      {t("noLiveAuctions")}
                    </AnimatedText>
                    <AnimatedText 
                      className="text-white/60 text-lg"
                      animation="fadeIn"
                      delay={1.3}
                    >
                      {t("liveAuctionsWillAppear")}
                    </AnimatedText>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {auctionsData?.live?.map((auction, index) => (
                      <motion.div
                        key={auction.id}
                        initial={{ opacity: 0, x: -30, rotateX: -10 }}
                        animate={{ opacity: 1, x: 0, rotateX: 0 }}
                        transition={{ 
                          delay: 0.9 + (index * 0.1), 
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1]
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          y: -5,
                          rotateX: 5,
                          boxShadow: "0 25px 50px rgba(34, 211, 238, 0.3)"
                        }}
                      >
                        <AuctionCard
                          auction={auction}
                          bids={auctionBids[auction.id] || []}
                          timeLeft={timers[auction.id] || 0}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Section 03 - Future Arena */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {/* Giant Number */}
              <motion.div 
                className="lg:col-span-1 text-center lg:text-left"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div 
                  className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-electric-400 to-electric-600 bg-clip-text text-transparent leading-none"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  03
                </motion.div>
                <motion.div 
                  className="w-24 h-1 bg-gradient-to-r from-electric-400 to-electric-600 mx-auto lg:mx-0 mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </motion.div>

              {/* Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                                        <AnimatedHeading 
                        level={2}
                        className="text-4xl lg:text-6xl font-black text-white leading-tight"
                        animation="whipInUp"
                        delay={0.1}
                      >
                        {t("upcomingAuctions")}
                      </AnimatedHeading>
                      
                      <AnimatedText 
                        className="text-xl text-white/80 leading-relaxed max-w-2xl"
                        animation="calmInUp"
                        delay={0.2}
                      >
                        Предстоящие битвы за самые желанные призы. Подготовьтесь к эпическим сражениям.
                      </AnimatedText>
                </div>

                {sortedUpcomingAuctions.length === 0 ? (
                  <motion.div 
                    className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-electric-400/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <motion.i 
                      className="fas fa-hourglass-half text-electric-400 text-6xl mb-6"
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <AnimatedText 
                      className="text-2xl font-bold text-white mb-4"
                      animation="calmInUp"
                      delay={1.1}
                    >
                      {t("noUpcomingAuctions")}
                    </AnimatedText>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {visibleUpcomingAuctions.slice(0, 4).map((auction, index) => (
                        <motion.div
                          key={auction.id}
                          initial={{ opacity: 0, y: 30, rotateX: -10 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{ 
                            delay: 0.9 + (index * 0.1), 
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          whileHover={{ 
                            scale: 1.03,
                            y: -5,
                            rotateX: 5,
                            boxShadow: "0 25px 50px rgba(34, 211, 238, 0.3)"
                          }}
                        >
                          <UpcomingAuctionCard
                            auction={auction}
                            startsIn={calculateTimeToStart(auction.startTime)}
                            prebidsCount={auction.prebidsCount || 0}
                          />
                        </motion.div>
                      ))}
                    </div>
                    
                    {hasMoreAuctions && (
                      <motion.div 
                        className="text-center mt-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                      >
                        <motion.button
                          onClick={handleLoadMore}
                          className="bg-gradient-to-r from-electric-500 to-brand-500 text-white font-black px-8 py-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 40px rgba(34, 211, 238, 0.5)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fas fa-plus-circle mr-3"></i>
                          {t("showMore")}
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Section 04 - Hall of Fame */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {/* Giant Number */}
              <motion.div 
                className="lg:col-span-1 text-center lg:text-left"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div 
                  className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-sunset-400 to-sunset-600 bg-clip-text text-transparent leading-none"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  04
                </motion.div>
                <motion.div 
                  className="w-24 h-1 bg-gradient-to-r from-sunset-400 to-sunset-600 mx-auto lg:mx-0 mt-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </motion.div>

              {/* Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-6">
                                        <AnimatedHeading 
                        level={2}
                        className="text-4xl lg:text-6xl font-black text-white leading-tight"
                        animation="whipInUp"
                        delay={0.1}
                      >
                        {t("winnersOfTheDay")}
                      </AnimatedHeading>
                      
                      <AnimatedText 
                        className="text-xl text-white/80 leading-relaxed max-w-2xl"
                        animation="calmInUp"
                        delay={0.2}
                      >
                        Легенды сегодняшнего дня. Те, кто выиграл невероятные призы за копейки.
                      </AnimatedText>
                </div>

                {auctionsData?.finished?.length === 0 ? (
                  <motion.div 
                    className="text-center py-20 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-sunset-400/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <motion.i 
                      className="fas fa-crown text-sunset-400 text-6xl mb-6"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <AnimatedText 
                      className="text-2xl font-bold text-white mb-4"
                      animation="calmInUp"
                      delay={1.1}
                    >
                      {t("noWinnersToday")}
                    </AnimatedText>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-sunset-400/20 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <div className="space-y-6">
                      {auctionsData?.finished?.slice(0, 5).map((auction, index) => (
                        <motion.div 
                          key={auction.id}
                          className="group flex items-center justify-between py-6 px-6 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl border border-white/10 hover:border-sunset-400/30 transition-all duration-300"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.1 + (index * 0.1), duration: 0.6 }}
                          whileHover={{ 
                            scale: 1.02,
                            x: 10,
                            backgroundColor: "rgba(55, 65, 81, 0.8)"
                          }}
                        >
                          <div className="flex items-center space-x-6">
                            <motion.div
                              className="relative"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sunset-400/50 shadow-lg">
                                <img
                                  src={auction.imageUrl}
                                  alt={auction.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-sunset-400 to-sunset-500 rounded-full border-2 border-gray-800 flex items-center justify-center"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <i className="fas fa-crown text-xs text-white"></i>
                              </motion.div>
                            </motion.div>
                            <div>
                              <p className="font-black text-lg text-white group-hover:text-sunset-400 transition-colors duration-300">
                                {auction.winner ? auction.winner.username : t("unknown")}
                              </p>
                              <p className="text-white/60">
                                {t("won")} <span className="font-bold text-white">{auction.title}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <motion.p 
                              className="font-black text-2xl bg-gradient-to-r from-sunset-400 to-sunset-500 bg-clip-text text-transparent"
                              whileHover={{ scale: 1.1 }}
                            >
                              {formatCurrency(auction.currentPrice)}
                            </motion.p>
                            <p className="text-white/40 text-sm font-medium">
                              {new Date(auction.endTime!).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
        
      </div>
    </div>
  );
}
