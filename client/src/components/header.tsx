import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { Link, useLocation } from "wouter";
import { AuthModal } from "@/components/auth-modal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSocket } from "@/hooks/use-socket";

export function Header() {
  const { user, isAuthenticated, logout, refetch } = useAuth();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { socket } = useSocket();

  // Listen for bid balance updates
  useEffect(() => {
    if (!socket || !isAuthenticated || !user) return;

    const handleBidBalanceUpdate = (data: { userId: string; newBalance: number }) => {
      if (data.userId === user.id) {
        // Refetch user data to get updated bid balance
        refetch();
      }
    };

    socket.on("bidBalanceUpdate", handleBidBalanceUpdate);

    return () => {
      socket.off("bidBalanceUpdate", handleBidBalanceUpdate);
    };
  }, [socket, isAuthenticated, user, refetch]);

  const handleLogout = () => {
    logout();
    setLocation("/");
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: "/", icon: "fas fa-home", label: t("home") },
    { href: "/auctions", icon: "fas fa-gavel", label: t("auctions") },
    { href: "/how-it-works", icon: "fas fa-question-circle", label: t("howItWorks") },
  ];

  return (
    <>
      <motion.header 
        className="bg-gray-900/95 backdrop-blur-xl border-b border-neon-400/20 sticky top-0 z-40 shadow-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90"></div>
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <Link href="/" className="group flex items-center space-x-3 hover:opacity-90 transition-all duration-300 flex-shrink-0">
              <motion.div 
                className="relative w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)"
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.i 
                  className="fas fa-gavel text-white text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Glowing ring effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-neon-400/30"
                  animate={{ 
                    borderColor: [
                      "rgba(34, 211, 238, 0.3)",
                      "rgba(34, 211, 238, 0.6)",
                      "rgba(34, 211, 238, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-xl font-black bg-gradient-to-r from-white to-neon-300 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {settings?.siteName || "Deshevshe.ua"}
                </motion.h1>
                <p className="text-xs text-white/70 font-medium">
                  {settings?.headerTagline || "Пенни-аукционы в Украине"}
                </p>
              </div>
              <div className="sm:hidden">
                <motion.h1 
                  className="text-lg font-black bg-gradient-to-r from-white to-neon-300 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {settings?.siteName || "Deshevshe.ua"}
                </motion.h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-6 py-3 rounded-full transition-all duration-200 font-bold text-sm ${
                    location === item.href 
                      ? "bg-brand-gradient text-white shadow-lg" 
                      : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <i className={`${item.icon} mr-2 text-xs`}></i>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              {isAuthenticated && user ? (
                <>
                  {/* Balance Display */}
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 px-4 py-2 rounded-full">
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="fas fa-coins text-green-400"></i>
                      <span className="font-bold text-white">{user.bidBalance} {t("bids")}</span>
                    </div>
                  </div>
                  
                  <Link href="/topup">
                    <Button 
                      size="sm"
                      className="bg-electric-gradient text-white h-9 px-4 rounded-full font-bold"
                    >
                      <i className="fas fa-plus mr-2 text-xs"></i>
                      {t("topUpBalance")}
                    </Button>
                  </Link>

                  {/* Username with Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-neon-400/50 rounded-full h-10 px-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-brand-gradient rounded-full flex items-center justify-center">
                            <i className="fas fa-user text-white text-xs"></i>
                          </div>
                          <span className="font-bold text-white text-sm">{user.username}</span>
                          <i className="fas fa-chevron-down text-white/60 text-xs"></i>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-gray-800/95 backdrop-blur-xl border border-neon-400/20 rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer text-white hover:text-neon-400 hover:bg-white/10">
                          <i className="fas fa-user mr-3 text-white/60"></i>
                          {t("profile")}
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center cursor-pointer text-white hover:text-neon-400 hover:bg-white/10">
                            <i className="fas fa-cog mr-3 text-white/60"></i>
                            {t("adminPanel")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer"
                      >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        {t("logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-brand-gradient hover:bg-brand-700 text-white shadow-lg rounded-full h-10 px-6 font-bold"
                >
                  <i className="fas fa-sign-in-alt mr-2 text-xs"></i>
                  {t("login")}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden bg-white/10 hover:bg-white/20 border border-white/20 hover:border-neon-400/50 rounded-full h-10 w-10 backdrop-blur-sm"
                >
                  <i className="fas fa-bars text-white text-sm"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 bg-gray-900/95 backdrop-blur-xl border-l border-neon-400/20">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <SheetHeader className="p-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-neon-400/20">
                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div 
                        className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-xl"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)"
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.i 
                          className="fas fa-gavel text-white text-xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </motion.div>
                      <div>
                        <SheetTitle className="text-white text-xl font-black bg-gradient-to-r from-white to-neon-300 bg-clip-text text-transparent">
                          {settings?.siteName || "Deshevshe.ua"}
                        </SheetTitle>
                        <p className="text-white/70 text-sm font-medium">
                          {settings?.language === "ru" && "Пенни-аукционы"}
                          {settings?.language === "en" && "Penny Auctions"}
                          {settings?.language === "ka" && "პენი აუქციონები"}
                          {!settings?.language && "Пенни-аукционы"}
                        </p>
                      </div>
                    </motion.div>
                  </SheetHeader>

                  {/* User Section */}
                  <div className="p-6">
                    {isAuthenticated && user ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <Link href="/profile" onClick={handleNavClick}>
                          <div className="flex items-center space-x-4 p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-neon-400/20 hover:border-neon-400/40 hover:bg-gray-700/60 transition-all duration-200 cursor-pointer">
                            <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                              <i className="fas fa-user text-white text-lg"></i>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-white">{user.username}</p>
                              <div className="flex items-center space-x-2 text-sm text-white/70">
                                <i className="fas fa-coins text-green-400"></i>
                                <span className="font-semibold">{user.bidBalance} {t("bids")}</span>
                              </div>
                            </div>
                            <i className="fas fa-chevron-right text-neon-400"></i>
                          </div>
                        </Link>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-xl text-center backdrop-blur-sm">
                            <i className="fas fa-trophy text-green-400 text-lg mb-1"></i>
                            <p className="text-xs text-white/60 font-medium">{t("wonAuctions")}</p>
                            <p className="font-bold text-green-400">0</p>
                          </div>
                          <div className="p-3 bg-brand-500/20 border border-brand-400/30 rounded-xl text-center backdrop-blur-sm">
                            <i className="fas fa-gavel text-brand-400 text-lg mb-1"></i>
                            <p className="text-xs text-white/60 font-medium">{t("bids")}</p>
                            <p className="font-bold text-brand-400">-</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-neon-400/20">
                          <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <i className="fas fa-user text-white text-xl"></i>
                          </div>
                          <h3 className="font-bold text-white mb-2">
                            {settings?.language === "ru" && "Добро пожаловать!"}
                            {settings?.language === "en" && "Welcome!"}
                            {settings?.language === "ka" && "კეთილი იყოს თქვენი მობრძანება!"}
                            {!settings?.language && "Добро пожаловать!"}
                          </h3>
                          <p className="text-sm text-white/70 mb-4">
                            {settings?.language === "ru" && "Войдите, чтобы начать участвовать в аукционах"}
                            {settings?.language === "en" && "Login to start participating in auctions"}
                            {settings?.language === "ka" && "შედით აუქციონებში მონაწილეობისთვის"}
                            {!settings?.language && "Войдите, чтобы начать участвовать в аукционах"}
                          </p>
                          <Button 
                            onClick={() => {
                              setShowAuthModal(true);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-brand-gradient text-white shadow-lg rounded-xl h-11 font-bold"
                          >
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            {t("login")} / {t("register")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-neon-400/20" />

                  {/* Navigation */}
                  <div className="flex-1 p-6">
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href} onClick={handleNavClick}>
                          <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                            location === item.href 
                              ? "bg-brand-gradient text-white shadow-lg" 
                              : "hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-neon-400/30 backdrop-blur-sm"
                          }`}>
                            <i className={`${item.icon} text-sm`}></i>
                            <span className="font-bold">{item.label}</span>
                            {location === item.href && (
                              <i className="fas fa-chevron-right ml-auto text-xs"></i>
                            )}
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* Top Up Link for authenticated users */}
                    {isAuthenticated && (
                      <>
                        <Separator className="my-4 bg-neon-400/20" />
                        <div className="space-y-2">
                          <Link href="/topup" onClick={handleNavClick}>
                            <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-400/30 hover:border-green-400/50 transition-all duration-200 backdrop-blur-sm">
                              <i className="fas fa-plus text-sm"></i>
                              <span className="font-bold">{t("topUpBalance")}</span>
                              <i className="fas fa-chevron-right ml-auto text-xs"></i>
                            </div>
                          </Link>
                        </div>
                      </>
                    )}

                    {isAuthenticated && user?.role === 'admin' && (
                      <>
                        <Separator className="my-4 bg-neon-400/20" />
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white/60 uppercase tracking-wide px-4">{t("admin")}</h4>
                          <Link href="/admin" onClick={handleNavClick}>
                            <div className="flex items-center space-x-3 p-4 rounded-xl bg-sunset-500/20 hover:bg-sunset-500/30 text-sunset-400 border border-sunset-400/30 hover:border-sunset-400/50 transition-all duration-200 backdrop-blur-sm">
                              <i className="fas fa-cog text-sm"></i>
                              <span className="font-bold">{t("controlPanel")}</span>
                            </div>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer Actions */}
                  {isAuthenticated && (
                    <div className="p-6 border-t border-neon-400/20 bg-gray-800/60">
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="w-full border-red-400/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50 rounded-xl h-11 backdrop-blur-sm bg-red-500/10 font-bold"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        {t("logout")}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          refetch();
          setShowAuthModal(false);
        }}
      />
    </>
  );
}