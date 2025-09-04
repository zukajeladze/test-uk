import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X, Settings } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already consented to cookies
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // Show banner after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-preferences", JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }));
    setIsVisible(false);
    window.location.reload(); // Reload to apply analytics
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary-only");
    localStorage.setItem("cookie-preferences", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }));
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("cookie-preferences", JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <motion.div 
        className="max-w-[1600px] mx-auto bg-gray-900/95 backdrop-blur-xl border border-neon-400/30 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 sm:p-6">
          {!showSettings ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Cookie className="h-6 w-6 sm:h-8 sm:w-8 text-sunset-400 flex-shrink-0 animate-pulse" />
                <div className="text-sm">
                  <p className="font-bold text-white mb-1 sm:mb-2">{t("weUseCookies")}</p>
                  <p className="text-white/70">
                    {t("cookieDescription")} 
                    <Link href="/privacy-policy" className="text-neon-400 hover:text-neon-300 hover:underline ml-1 font-medium">
                      {t("learnMore")}
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-neon-400/30 rounded-xl transition-colors"
                >
                  <Settings className="h-3 w-3 mr-2" />
                  {t("settings")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                  className="text-xs bg-gray-800/60 border-white/20 text-white hover:bg-gray-700/60 rounded-xl transition-colors"
                >
                  {t("onlyNecessary")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs bg-sunset-gradient hover:opacity-90 text-white font-bold rounded-xl border border-white/20 transition-opacity"
                >
                  {t("acceptAll")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReject}
                  className="p-2 bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-sunset-400 animate-pulse" />
                  <h3 className="font-bold text-white text-base sm:text-lg">{t("cookieSettings")}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-xl transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {[
                  { title: t("necessary"), desc: t("basicSiteWork"), color: 'brand' },
                  { title: t("analytical"), desc: t("siteImprovement"), color: 'electric' },
                  { title: t("functional"), desc: t("rememberSettings"), color: 'neon' }
                ].map((cookie, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-${cookie.color}-500/10 to-${cookie.color}-600/5 p-3 sm:p-4 rounded-xl border-l-2 border-${cookie.color}-400/50 hover:translate-x-1 transition-transform`}
                  >
                    <div className={`font-bold text-${cookie.color}-400`}>{cookie.title}</div>
                    <div className="text-white/70 mt-2 text-xs">{cookie.desc}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                  className="text-xs bg-gray-800/60 border-white/20 text-white hover:bg-gray-700/60 rounded-xl transition-colors"
                >
                  {t("onlyNecessary")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs bg-sunset-gradient hover:opacity-90 text-white font-bold rounded-xl border border-white/20 transition-opacity"
                >
                  {t("acceptAll")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}