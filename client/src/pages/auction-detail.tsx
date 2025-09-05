import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { Auction, Bid } from "@/types/auction";
import { trackAuctionView, trackBidPlaced } from "@/lib/analytics";

// Fake Visitors Badge Component for Samsung Galaxy Z Fold 7 QB/1113
function FakeVisitorsBadge({ auction }: { auction: Auction }) {
  const [visitorCount, setVisitorCount] = useState(0);
  const [recentJoiners, setRecentJoiners] = useState<string[]>([]);

  // Only show for Samsung Galaxy Z Fold 7 auction
  const isSamsungAuction = auction.title.toLowerCase().includes('samsung galaxy z fold 7') || 
                          auction.title.toLowerCase().includes('qb/1113');

  useEffect(() => {
    if (!isSamsungAuction) return;

    // Generate realistic visitor count based on time of day
    const generateVisitorCount = () => {
      const hour = new Date().getHours();
      let baseCount = 45;
      
      // Peak hours (9-12, 18-22) have more visitors
      if ((hour >= 9 && hour <= 12) || (hour >= 18 && hour <= 22)) {
        baseCount = 85;
      }
      
      // Add some randomness (±15)
      return baseCount + Math.floor(Math.random() * 31) - 15;
    };

    // List of fake usernames for recent joiners
    const fakeNames = [
      'Алексей К.', 'Мария В.', 'Дмитрий С.', 'Анна П.', 'Сергей Т.',
      'Елена М.', 'Андрей Л.', 'Ольга Н.', 'Владимир Р.', 'Ирина Ф.',
      'Михаил Г.', 'Светлана Б.', 'Николай З.', 'Татьяна Ш.', 'Игорь К.',
      'Наталья Ж.', 'Роман А.', 'Юлия Д.', 'Павел И.', 'Валентина Ц.'
    ];

    // Initialize visitor count
    setVisitorCount(generateVisitorCount());

    // Update visitor count every 15-30 seconds
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // ±3 visitors
        return Math.max(25, Math.min(150, prev + change));
      });
    }, 15000 + Math.floor(Math.random() * 15000));

    // Add new recent joiners every 8-25 seconds
    const joinersInterval = setInterval(() => {
      const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      setRecentJoiners(prev => {
        const newJoiners = [randomName, ...prev.filter(name => name !== randomName)];
        return newJoiners.slice(0, 3); // Keep only last 3 joiners
      });
    }, 8000 + Math.floor(Math.random() * 17000));

    return () => {
      clearInterval(visitorInterval);
      clearInterval(joinersInterval);
    };
  }, [isSamsungAuction]);

  if (!isSamsungAuction || visitorCount === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-900">Активность на аукционе</span>
        </div>
        <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
          <i className="fas fa-eye text-green-600 text-xs"></i>
          <span className="text-sm font-bold text-green-700">{visitorCount}</span>
          <span className="text-xs text-green-600">онлайн</span>
        </div>
      </div>
      
      {recentJoiners.length > 0 && (
        <div className="space-y-1">
          {recentJoiners.map((name, index) => (
            <div key={`${name}-${index}`} className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>{name} присоединился к просмотру</span>
              <span className="text-gray-400">только что</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuctionDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formatCurrency } = useSettings();
  const { t } = useLanguage();
  const [timer, setTimer] = useState<number>(0);
  const [upcomingTimer, setUpcomingTimer] = useState<number>(0);

  // Fetch auction details
  const { data: auction, isLoading } = useQuery<Auction>({
    queryKey: [`/api/auctions/slug/${slug}`],
    enabled: !!slug,
  });

  // Track auction view when data is loaded
  useEffect(() => {
    if (auction) {
      trackAuctionView(auction.id, auction.title);
    }
  }, [auction]);

  // Fetch bid history (limited to recent bids for display)
  const { data: bids = [] } = useQuery<Bid[]>({
    queryKey: ["/api/auctions", auction?.id, "bids"],
    enabled: !!auction?.id,
    refetchInterval: 1000,
  });

  // Fetch complete auction statistics
  const { data: stats } = useQuery<{totalBids: number, uniqueParticipants: number, priceIncrease: string}>({
    queryKey: ["/api/auctions", auction?.id, "stats"],
    enabled: !!auction?.id,
  });

  // Fetch timers
  const { data: timers = {} } = useQuery<Record<string, number>>({
    queryKey: ["/api/timers"],
    refetchInterval: 1000,
  });

  // Update timer from timers data
  useEffect(() => {
    if (auction && timers[auction.id] !== undefined) {
      setTimer(timers[auction.id]);
    }
  }, [timers, auction]);

  // Socket connection for real-time updates
  const { socket } = useSocket();
  
  useEffect(() => {
    if (socket && auction) {
      socket.emit("joinAuction", auction.id);
      
      const handleAuctionUpdate = (data: any) => {
        // Handle timer updates
        if (data.type === 'timer' && data.auctionId === auction.id) {
          setTimer(data.timeLeft);
          return;
        }
        
        // Handle auction updates
        if (data.auction?.id === auction.id) {
          queryClient.setQueryData([`/api/auctions/slug/${slug}`], data.auction);
          queryClient.setQueryData(["/api/auctions", auction.id, "bids"], data.bids || []);
          // Invalidate stats to get fresh total bid count
          queryClient.invalidateQueries({ queryKey: ["/api/auctions", auction.id, "stats"] });
        }
      };

      const handleTimerUpdate = (data: any) => {
        if (data[auction.id] !== undefined) {
          setTimer(data[auction.id]);
        }
      };

      socket.on("auctionUpdate", handleAuctionUpdate);
      socket.on("timerUpdate", handleTimerUpdate);

      return () => {
        socket.emit("leaveAuction", auction.id);
        socket.off("auctionUpdate", handleAuctionUpdate);
        socket.off("timerUpdate", handleTimerUpdate);
      };
    }
  }, [socket, auction, queryClient, slug]);

  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async () => {
      if (!auction) throw new Error("Auction not found");
      await apiRequest("POST", `/api/auctions/${auction.id}/bid`);
    },
    onSuccess: () => {
      // Track successful bid placement
      if (auction) {
        trackBidPlaced(Number(auction.bidIncrement), auction.id);
      }
      
      toast({
        title: t("bidPlaced"),
        description: t("bidPlacedDesc"),
      });
      queryClient.invalidateQueries({ queryKey: [`/api/auctions/slug/${slug}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions", auction?.id, "bids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions", auction?.id, "stats"] });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("bidPlaceError"),
        variant: "destructive",
      });
    },
  });

  // Prebid mutation for upcoming auctions
  const prebidMutation = useMutation({
    mutationFn: async () => {
      if (!auction) throw new Error("Auction not found");
      await apiRequest("POST", `/api/auctions/${auction.id}/prebid`);
    },
    onSuccess: () => {
      toast({
        title: "Предварительная ставка размещена!",
        description: "Вы будете уведомлены когда аукцион начнется",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/auctions/slug/${slug}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions", auction?.id, "bids"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions"] });
    },
    onError: (error: any) => {
      // Extract error message from JSON response
      let errorMessage = "Не удалось разместить предварительную ставку";
      
      if (error.message) {
        try {
          // Parse error message like "400: {"error":"message"}"
          const match = error.message.match(/\d+: (.+)/);
          if (match) {
            const jsonPart = match[1];
            const errorObj = JSON.parse(jsonPart);
            errorMessage = errorObj.error || errorMessage;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleBid = () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для участия в аукционе",
        variant: "destructive",
      });
      return;
    }

    if (!user || user.bidBalance < 1) {
      toast({
        title: "Недостаточно бидов",
        description: "Пополните баланс бидов для участия в аукционе",
        variant: "destructive",
      });
      return;
    }

    bidMutation.mutate();
  };

  const handlePrebid = () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для размещения предварительных ставок",
        variant: "destructive",
      });
      return;
    }

    prebidMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate time until auction starts for upcoming auctions
  const calculateTimeToStart = (startTime: string): number => {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((start - now) / 1000));
  };

  // Update upcoming timer every second
  useEffect(() => {
    if (auction && auction.status === "upcoming") {
      const interval = setInterval(() => {
        const timeToStart = calculateTimeToStart(auction.startTime);
        setUpcomingTimer(timeToStart);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [auction]);

  // Get the appropriate timer value
  const getTimerValue = () => {
    if (!auction) return 0;
    
    if (auction.status === "upcoming") {
      return upcomingTimer;
    } else if (auction.status === "live") {
      return timer; // Use the live auction timer
    }
    return 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-yellow-500 text-white">{t("upcoming")}</Badge>;
      case "live":
        return <Badge className="bg-red-500 text-white animate-pulse">{t("live")}</Badge>;
      case "finished":
        return <Badge className="bg-gray-500 text-white">{t("finished")}</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="relative overflow-hidden">
          {/* Cyber grid background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20 cyber-grid" />
          </div>
          
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-16 flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-neon-400/30 border-t-neon-400 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-brand-400/20 border-b-brand-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="text-white/80 text-lg">{t("loading")} {t("auction").toLowerCase()}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="relative overflow-hidden">
          {/* Cyber grid background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20 cyber-grid" />
          </div>
          
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-16 flex items-center justify-center min-h-[80vh]">
            <div className="text-center bg-gray-800/50 backdrop-blur-xl border border-red-400/30 rounded-3xl p-12">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
              </div>
              <h1 className="text-3xl font-black text-white mb-4">{t("auction")} not found</h1>
              <p className="text-white/70 mb-8 text-lg">The auction may have been deleted or doesn't exist</p>
              <Button 
                onClick={() => setLocation("/")}
                className="bg-brand-gradient hover:shadow-xl text-white font-bold px-8 py-3 rounded-xl border border-white/20"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                {t("home")}
              </Button>
            </div>
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
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-neon-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Futuristic Breadcrumb Header */}
        <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-b border-neon-400/20 shadow-2xl">
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/")}
                  className="flex items-center space-x-2 flex-shrink-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-neon-400/50 rounded-xl backdrop-blur-sm transition-all"
                  size="sm"
                >
                  <i className="fas fa-arrow-left"></i>
                  <span className="hidden sm:inline">{t("back")}</span>
                </Button>
                <div className="h-6 w-px bg-neon-400/30 hidden sm:block"></div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-2xl font-black text-white truncate bg-gradient-to-r from-white to-neon-200 bg-clip-text text-transparent">
                    {auction.title}
                  </h1>
                </div>
              </div>
              
              {/* Futuristic Auction ID Badge */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(auction.displayId);
                  toast({
                    title: "Скопировано!",
                    description: `ID аукциона ${auction.displayId} скопирован в буфер обмена`,
                  });
                }}
                className="flex items-center space-x-2 bg-brand-500/20 hover:bg-brand-500/30 border-brand-400/50 text-brand-300 hover:text-brand-200 rounded-xl backdrop-blur-sm transition-all flex-shrink-0"
              >
                <i className="fas fa-tag text-brand-400"></i>
                <span className="font-mono text-xs sm:text-sm font-bold">{auction.displayId}</span>
                <i className="fas fa-copy text-xs text-brand-400/60"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Auction Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Futuristic Auction Card */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-neon-400/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-neon-400/20 hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
                  {/* Futuristic Image Section */}
                  <div className="relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-600/20 to-brand-600/20 z-10"></div>
                    <img
                      src={auction.imageUrl}
                      alt={auction.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    
                    {/* Futuristic Status Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-3 border border-neon-400/40 shadow-lg">
                        {getStatusBadge(auction.status)}
                      </div>
                    </div>
                    
                    {/* Futuristic ID Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className="bg-brand-500/20 backdrop-blur-xl text-brand-300 px-4 py-2 rounded-full text-sm font-bold border border-brand-400/40 shadow-lg">
                        <i className="fas fa-tag mr-2"></i>
                        {auction.displayId}
                      </div>
                    </div>
                    
                    {/* Cyber Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent z-10"></div>
                    
                    {/* Floating Price Card */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-neon-400/40 shadow-2xl">
                        <div className="flex items-center justify-between text-white">
                          <div>
                            <p className="text-xs font-medium text-neon-300 mb-1">{t("currentPrice")}</p>
                            <p className="text-2xl font-black bg-gradient-to-r from-neon-400 to-brand-400 bg-clip-text text-transparent">
                              {formatCurrency(auction.currentPrice)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-neon-500/20 rounded-full flex items-center justify-center">
                            <i className="fas fa-chart-line text-neon-400 text-xl"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Futuristic Details Section */}
                  <div className="p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                    <div className="space-y-6 md:space-y-8">
                      <div>
                        <p className="text-white/80 leading-relaxed text-base md:text-lg">{auction.description}</p>
                      </div>

                      {/* Timer and Status Section */}
                      {auction.status === "live" && (
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                          <div className="text-center">
                            <p className="text-red-400 font-bold mb-3 flex items-center justify-center text-base md:text-lg">
                              <i className="fas fa-fire mr-2 animate-pulse"></i>
                              {t("auctionActive")}
                            </p>
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text font-mono mb-3 tracking-wider">
                              {formatTime(getTimerValue())}
                            </div>
                            <p className="text-sm text-red-400/80 uppercase tracking-widest">{t("untilCompletion")}</p>
                          </div>
                        </div>
                      )}

                      {auction.status === "upcoming" && (
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                          <div className="text-center">
                            <p className="text-yellow-400 font-bold mb-3 flex items-center justify-center text-base md:text-lg">
                              <i className="fas fa-clock mr-2 animate-pulse"></i>
                              {t("startsIn")}
                            </p>
                            <div className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-mono mb-3 tracking-wider">
                              {formatTime(getTimerValue())}
                            </div>
                          </div>
                        </div>
                      )}

                      {auction.status === "finished" && (
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-brand-500/30 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                          <div className="text-center">
                            <div className="flex justify-center mb-6">
                              <div className="bg-gradient-to-r from-brand-400 to-neon-400 rounded-full p-6 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                                <i className="fas fa-crown text-white text-4xl"></i>
                              </div>
                            </div>
                            <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-brand-400 to-neon-400 bg-clip-text mb-6">
                              🎉 {t("auctionFinished")}
                            </h3>
                            
                            {bids.length > 0 && (
                              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 mt-6 border border-brand-400/30">
                                <p className="text-brand-400 font-bold mb-4">{t("winner")}:</p>
                                <div className="flex items-center justify-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-neon-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                                    <i className="fas fa-user text-white text-xl"></i>
                                  </div>
                                  <div>
                                    <p className="font-black text-2xl text-transparent bg-gradient-to-r from-brand-400 to-neon-400 bg-clip-text">
                                      {bids[0].isBot ? bids[0].botName : bids[0].user?.username}
                                    </p>
                                    <p className="text-sm text-brand-400/80">
                                      {t("winner")}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-brand-400/20">
                                  <p className="text-brand-400 font-bold mb-2">{t("winningBid")}:</p>
                                  <p className="text-4xl font-black text-transparent bg-gradient-to-r from-brand-400 to-neon-400 bg-clip-text">
                                    {formatCurrency(bids[0].amount)}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {bids.length === 0 && (
                              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 mt-6 border border-brand-400/30">
                                <p className="text-brand-400">{t("noBidsNoWinner")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-6 mt-8">
                      {auction.status === "upcoming" && (
                        <Button
                          onClick={handlePrebid}
                          disabled={prebidMutation.isPending || !isAuthenticated}
                          className="w-full bg-sunset-gradient hover:opacity-90 text-white py-4 text-lg font-black rounded-xl border border-white/20 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all duration-300"
                        >
                          {prebidMutation.isPending ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              {t("placingPrebid")}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-hourglass-start mr-2"></i>
                              {t("prebid")} ({t("oneBid")})
                            </>
                          )}
                        </Button>
                      )}

                      {auction.status === "live" && (
                        <Button
                          onClick={handleBid}
                          disabled={bidMutation.isPending || !isAuthenticated || (bids[0] && !bids[0].isBot && bids[0].user?.id === user?.id)}
                          className="w-full bg-brand-gradient hover:opacity-90 text-white py-4 text-lg font-black rounded-xl border border-white/20 shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] transition-all duration-300"
                        >
                          {bidMutation.isPending ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              {t("placingBid")}
                            </>
                          ) : (
                            <>
                              <i className="fas fa-gavel mr-2"></i>
                              {`${t("placeBid")} (${t("oneBid")} = +${formatCurrency(0.01)})`}
                            </>
                          )}
                        </Button>
                      )}

                      {!isAuthenticated && (auction.status === "live" || auction.status === "upcoming") && (
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 text-center border border-neon-400/30">
                          <p className="text-white/80 mb-6 text-lg">
                            {auction.status === "upcoming" 
                              ? t("loginForPrebids")
                              : t("loginToParticipate")
                            }
                          </p>
                          <Button
                            onClick={() => window.location.href = "/login"}
                            className="bg-neon-gradient hover:opacity-90 text-white px-8 py-3 rounded-xl border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300"
                          >
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            {t("login")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Bid History */}
            <div className="space-y-6 md:space-y-8">
              {/* Fake Visitors Badge for Samsung Galaxy Z Fold 7 */}
              <FakeVisitorsBadge auction={auction} />
              
              <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-brand-400/30 shadow-[0_0_30px_rgba(14,165,233,0.2)] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                      <i className="fas fa-history text-brand-400 text-lg"></i>
                    </div>
                    <h2 className="text-xl font-black text-white">{t("bidHistory")}</h2>
                  </div>
                  
                  <div className="space-y-3 max-h-[32rem] overflow-y-auto scrollbar-hide">
                    {bids.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-gavel text-brand-400 text-2xl"></i>
                        </div>
                        <p className="text-white/80 text-lg mb-2">{t("noBidsYet")}</p>
                        <p className="text-brand-400/80 text-sm">{t("beTheFirst")}</p>
                      </div>
                    ) : (
                      bids.map((bid, index) => (
                        <div
                          key={bid.id}
                          className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm ${
                            bid.isPrebid 
                              ? "bg-sunset-500/10 border-sunset-400/30"
                              : index === 0 
                                ? "bg-brand-500/10 border-brand-400/30" 
                                : "bg-gray-800/40 border-white/10"
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              bid.isPrebid 
                                ? "bg-gradient-to-br from-sunset-500 to-sunset-600" 
                                : "bg-gradient-to-br from-brand-500 to-brand-600"
                            }`}>
                              <i className={`text-white ${bid.isPrebid ? "fas fa-hourglass-start" : "fas fa-user"}`}></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white text-base truncate flex items-center">
                                {bid.isBot ? bid.botName : bid.user?.username}
                                {bid.isPrebid && (
                                  <span className="ml-2 text-xs bg-sunset-500/20 text-sunset-400 px-2 py-1 rounded-full border border-sunset-400/30">
                                    {t("prebidShort")}
                                  </span>
                                )}
                                {!bid.isPrebid && index === 0 && (
                                  <span className="ml-2 text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full border border-brand-400/30">
                                    {t("leader")}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-white/60">
                                {bid.isPrebid 
                                  ? t("prebid")
                                  : `${t("bidNumber")}${(stats?.totalBids || 0) - bids.filter((b, i) => i < index && !b.isPrebid).length}`
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`font-black text-base ${
                              bid.isPrebid ? "text-sunset-400" : "text-brand-400"
                            }`}>
                              {formatCurrency(bid.amount)}
                            </p>
                            {bid.isPrebid && (
                              <p className="text-xs text-sunset-400/80">
                                {t("oneBid")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* How It Works Section */}
        <div className="relative z-10 max-w-[1600px] mx-auto mt-12 md:mt-16">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-neon-400/30 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-white to-neon-200 bg-clip-text mb-4">
                {t("howPennyAuctionsWork")}
              </h2>
              <p className="text-lg text-white/80">{t("understandingMechanics")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  <i className="fas fa-user-plus text-white text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-white mb-3">1. {t("registration")}</h3>
                <p className="text-white/70">{t("registrationDesc").replace("{oneBid}", t("oneBid")).replace("{currency}", formatCurrency(0.01))}</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-electric-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  <i className="fas fa-gavel text-white text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-white mb-3">2. {t("placeBidsTitle")}</h3>
                <p className="text-white/70">{t("placeBidsDesc")}</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-sunset-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <i className="fas fa-trophy text-white text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-white mb-3">3. {t("winTitle")}</h3>
                <p className="text-white/70">{t("winDesc")}</p>
              </div>
            </div>

            {/* Key Features */}
            <div className="border-t border-neon-400/20 pt-12">
              <h3 className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-white to-neon-200 bg-clip-text mb-8 text-center">
                {t("keyFeatures")}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-brand-400/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-brand-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-clock text-brand-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{t("timerResets")}</h4>
                      <p className="text-white/70">{t("timerResetsDesc")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-electric-400/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-electric-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-coins text-electric-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{t("lowBidCost")}</h4>
                      <p className="text-white/70">{t("lowBidCostDesc")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neon-400/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-neon-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-users text-neon-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{t("realCompetition")}</h4>
                      <p className="text-white/70">{t("realCompetitionDesc")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-sunset-400/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sunset-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-bolt text-sunset-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2">{t("fastResults")}</h4>
                      <p className="text-white/70">{t("fastResultsDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="border-t border-neon-400/20 pt-12 mt-12">
              <h3 className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-white to-neon-200 bg-clip-text mb-8 text-center">
                {t("successTips")}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-brand-400/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <i className="fas fa-lightbulb text-brand-400 text-xl"></i>
                    <span className="font-bold text-white">{t("timingStrategy")}</span>
                  </div>
                  <p className="text-white/70">{t("timingStrategyDesc")}</p>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-electric-400/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <i className="fas fa-chart-line text-electric-400 text-xl"></i>
                    <span className="font-bold text-white">{t("studyHistory")}</span>
                  </div>
                  <p className="text-white/70">{t("studyHistoryDesc")}</p>
                </div>

                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-neon-400/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <i className="fas fa-wallet text-neon-400 text-xl"></i>
                    <span className="font-bold text-white">{t("manageBudget")}</span>
                  </div>
                  <p className="text-white/70">{t("manageBudgetDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Participant Badge */}
      {stats?.uniqueParticipants && stats.uniqueParticipants > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:bottom-6 z-50">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-full px-4 py-3 border border-brand-400/30 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-brand-400 rounded-full animate-pulse" />
              <div className="text-white">
                <span className="text-lg font-black">{stats?.uniqueParticipants}</span>
                <span className="ml-2 text-sm text-white/80">{t("participants")}</span>
              </div>
              <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-users text-brand-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}