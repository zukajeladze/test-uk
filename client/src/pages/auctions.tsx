import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useLanguage } from "@/hooks/use-language";
import { useSocket } from "@/hooks/use-socket";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { UpcomingAuctionCard } from "@/components/upcoming-auction-card";
import { Button } from "@/components/ui/button";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { socketService } from "@/lib/socket";
import type { Auction } from "@/types/auction";

export default function Auctions() {
  const [timers, setTimers] = useState<Record<string, number>>({});
  const { t } = useLanguage();
  const { connected } = useSocket();

  useDocumentTitle(`${t("upcomingAuctions")} - Deshevshe.ua | Скоро начнутся новые торги`);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const auctionsPerPage = 12;
  
  const { data: auctionsData, isLoading } = useQuery<{
    live: Auction[];
    upcoming: Auction[];
    finished: Auction[];
  }>({
    queryKey: ["/api/auctions"],
  });

  // Fetch user's prebids to disable prebid button if already placed
  const { data: userPrebids } = useQuery<Array<{ auction: Auction }>>({
    queryKey: ["/api/prebids/user"],
    enabled: true,
    staleTime: 30000,
  });
  const userPrebidAuctionIds = new Set((userPrebids || []).map((p) => p.auction.id));
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
    return Math.max(0, Math.floor((start - currentTime) / 1000));
  };

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Socket connection for real-time updates
  useEffect(() => {
    if (connected) {
      socketService.onAuctionUpdate(() => {
        // Trigger rerender for any auction updates
        setCurrentTime(Date.now());
      });

      return () => {
        socketService.offAuctionUpdate();
      };
    }
  }, [connected]);

  // Pagination logic
  const upcomingAuctions = auctionsData?.upcoming || [];
  const sortedAuctions = upcomingAuctions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const totalPages = Math.ceil(sortedAuctions.length / auctionsPerPage);
  const startIndex = (currentPage - 1) * auctionsPerPage;
  const endIndex = startIndex + auctionsPerPage;
  const currentAuctions = sortedAuctions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 border-4 border-neon-400/30 border-t-neon-400 rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <AnimatedText 
              className="text-white/80 text-lg"
              animation="fadeIn"
              delay={0.1}
            >
              {t("loadingAuctions")}
            </AnimatedText>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Enhanced background */}
      <div className="relative overflow-hidden">
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
      
        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {/* Number + Content Grid Layout */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start mb-20"
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
                {String(sortedAuctions.length).padStart(2, '0')}
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-electric-400 to-electric-600 mx-auto lg:mx-0 mt-4"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Connection status */}
              <motion.div 
                className="mt-8 flex items-center justify-center lg:justify-start space-x-3"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
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
                  level={1}
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
                  {sortedAuctions.length} {t("auctionsAwaitingStart")}
                  {totalPages > 1 && (
                    <span className="ml-2 text-base text-white/60">
                      ({t("pageOf")} {currentPage} {t("of")} {totalPages})
                    </span>
                  )}
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          {/* Auction Content */}
          <div className="space-y-16">
            {!sortedAuctions.length ? (
              <motion.div 
                className="text-center py-32 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-electric-400/20"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.i 
                  className="fas fa-hourglass-half text-electric-400 text-8xl mb-8"
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <AnimatedText 
                  className="text-3xl font-black text-white mb-4"
                  animation="calmInUp"
                  delay={0.1}
                >
                  {t("noUpcomingAuctions")}
                </AnimatedText>
                <AnimatedText 
                  className="text-white/60 text-xl"
                  animation="fadeIn"
                  delay={0.2}
                >
                  {t("newAuctionsWillAppear")}
                </AnimatedText>
              </motion.div>
            ) : (
              <>
                <StaggeredList 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  stagger={0.1}
                  delay={0.1}
                >
                  {currentAuctions.map((auction) => (
                    <motion.div
                      key={auction.id}
                      whileHover={{ 
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <UpcomingAuctionCard
                        auction={auction}
                        startsIn={calculateTimeToStart(auction.startTime)}
                        prebidsCount={auction.prebidsCount || 0}
                        hasPrebid={userPrebidAuctionIds.has(auction.id)}
                      />
                    </motion.div>
                  )) || []}
                </StaggeredList>

                {/* Futuristic Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center items-center mt-16 space-x-3"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* First Page */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="bg-gray-800/60 border-neon-400/30 text-white hover:bg-neon-400/20 hover:border-neon-400/50 rounded-xl h-10 w-10 backdrop-blur-sm disabled:opacity-30"
                      >
                        <i className="fas fa-angle-double-left text-xs"></i>
                      </Button>
                    </motion.div>

                    {/* Previous Page */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-800/60 border-neon-400/30 text-white hover:bg-neon-400/20 hover:border-neon-400/50 rounded-xl h-10 w-10 backdrop-blur-sm disabled:opacity-30"
                      >
                        <i className="fas fa-angle-left text-xs"></i>
                      </Button>
                    </motion.div>

                    {/* Page Numbers */}
                    {(() => {
                      const pages = [];
                      const showPages = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                      let endPage = Math.min(totalPages, startPage + showPages - 1);
                      
                      if (endPage - startPage + 1 < showPages) {
                        startPage = Math.max(1, endPage - showPages + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant={currentPage === i ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(i)}
                              className={`min-w-[40px] h-10 rounded-xl font-bold backdrop-blur-sm ${
                                currentPage === i 
                                  ? "bg-brand-gradient text-white shadow-lg border-0" 
                                  : "bg-gray-800/60 border-neon-400/30 text-white hover:bg-neon-400/20 hover:border-neon-400/50"
                              }`}
                            >
                              {i}
                            </Button>
                          </motion.div>
                        );
                      }
                      return pages;
                    })()}

                    {/* Next Page */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-800/60 border-neon-400/30 text-white hover:bg-neon-400/20 hover:border-neon-400/50 rounded-xl h-10 w-10 backdrop-blur-sm disabled:opacity-30"
                      >
                        <i className="fas fa-angle-right text-xs"></i>
                      </Button>
                    </motion.div>

                    {/* Last Page */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-800/60 border-neon-400/30 text-white hover:bg-neon-400/20 hover:border-neon-400/50 rounded-xl h-10 w-10 backdrop-blur-sm disabled:opacity-30"
                      >
                        <i className="fas fa-angle-double-right text-xs"></i>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
        
        {/* Floating Sidebar for Desktop */}
        <motion.div 
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden xl:block"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          <motion.div 
            className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-neon-400/20 shadow-2xl max-w-xs"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(34, 211, 238, 0.3)"
            }}
          >
            <Sidebar />
          </motion.div>
        </motion.div>
        
        {/* Mobile Sidebar - Below content */}
        <div className="xl:hidden bg-gray-800/50 backdrop-blur-sm border-t border-neon-400/20">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}