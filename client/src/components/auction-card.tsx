import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { createSlug } from "@/lib/utils";
import type { Auction, Bid } from "@/types/auction";

interface AuctionCardProps {
  auction: Auction;
  bids: Bid[];
  timeLeft: number;
}

export function AuctionCard({ auction, bids, timeLeft }: AuctionCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formatCurrency } = useSettings();
  const { t } = useLanguage();

  const bidMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/auctions/${auction.id}/bid`);
    },
    onSuccess: () => {
      toast({
        title: t("bidSuccess"),
        description: t("bidSuccessDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auctions"] });
    },
    onError: (error: any) => {
      toast({
        title: t("error"),
        description: error.message || t("bidError"),
        variant: "destructive",
      });
    },
  });

  const lastBid = bids[0];
  const isUserLeading = !!(user && lastBid && !lastBid.isBot && lastBid.user?.id === user.id);
  const nextBidAmount = (parseFloat(auction.currentPrice) + parseFloat(auction.bidIncrement)).toFixed(2);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      toast({
        title: t("authRequired"),
        description: t("loginToBid"),
        variant: "destructive",
      });
      return;
    }

    if (user && user.bidBalance < 1) {
      toast({
        title: t("insufficientFunds"),
        description: t("insufficientBids"),
        variant: "destructive",
      });
      return;
    }

    bidMutation.mutate();
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-neon-400/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-neon-400/20 hover:shadow-2xl transition-all duration-500">
      <div className="relative group">
        {/* Image with overlay */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-600/20 to-brand-600/20 z-10" />
          <img
            src={auction.imageUrl}
            alt={auction.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-3 border border-red-500/40 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 font-bold text-sm">{t("live")}</span>
              </div>
            </div>
          </div>
          
          {/* ID Badge */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-brand-500/20 backdrop-blur-xl text-brand-300 px-4 py-2 rounded-full text-sm font-bold border border-brand-400/40 shadow-lg">
              <i className="fas fa-tag mr-2" />
              {auction.displayId}
            </div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent z-10" />
          
          {/* Timer Badge */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-xs font-medium text-red-300 mb-1">{t("timeLeft")}</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-mono">
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-clock text-red-400 text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <Link href={`/auction/${createSlug(auction.title, auction.displayId)}`} className="block">
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white truncate bg-gradient-to-r from-white to-neon-200 bg-clip-text text-transparent mb-2">
              {auction.title}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-6">{auction.description}</p>

            {/* Current Price */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-medium text-neon-300 mb-1">{t("currentPrice")}</p>
                <p className="text-xl font-black bg-gradient-to-r from-neon-400 to-brand-400 bg-clip-text text-transparent">
                  {formatCurrency(nextBidAmount)}
                </p>
              </div>
              <div className="w-10 h-10 bg-neon-500/20 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-neon-400 text-lg" />
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handlePlaceBid}
              disabled={bidMutation.isPending || !isAuthenticated || isUserLeading}
              className="w-full bg-brand-gradient hover:opacity-90 text-white py-4 text-lg font-black rounded-xl border border-white/20 shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bidMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  {t("placingBid")}
                </>
              ) : (
                <>
                  <i className="fas fa-gavel mr-2" />
                  {`${t("placeBid")} (+${formatCurrency(auction.bidIncrement)})`}
                </>
              )}
            </Button>

            {/* Last Bid Info */}
            {lastBid && (
              <div className="mt-4 bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-brand-400/20">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lastBid.isBot 
                      ? "bg-gradient-to-br from-sunset-500 to-sunset-600" 
                      : "bg-gradient-to-br from-brand-500 to-brand-600"
                  }`}>
                    <i className={`text-white ${lastBid.isBot ? "fas fa-robot" : "fas fa-user"}`} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm flex items-center">
                      {lastBid.isBot ? lastBid.botName : lastBid.user?.username}
                      <span className="ml-2 text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full border border-brand-400/30">
                        {t("lastBid")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
