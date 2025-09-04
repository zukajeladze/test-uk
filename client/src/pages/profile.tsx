import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Auction, Bid, UserStats } from "@/types/auction";

interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bidBalance: number;
  createdAt: string;
}

interface WonAuction {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  finalPrice: number;
  wonAt: string;
}

export default function Profile() {
  const { user, isAuthenticated, refetch: refetchAuth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formatCurrency } = useSettings();
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Fetch user profile
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/users/profile"],
    enabled: isAuthenticated,
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  // Fetch user statistics
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/users/stats"],
    enabled: isAuthenticated,
  });

  // Fetch won auctions
  const { data: wonAuctions = [] } = useQuery<WonAuction[]>({
    queryKey: ["/api/users/won-auctions"],
    enabled: isAuthenticated,
  });

  // Fetch recent bids
  const { data: recentBids = [] } = useQuery<Bid[]>({
    queryKey: ["/api/users/recent-bids"],
    enabled: isAuthenticated,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest("PUT", "/api/users/profile", data),
    onSuccess: () => {
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDesc"),
      });
      setIsEditing(false);
      refetchAuth();
      queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
    },
    onError: (error: any) => {
      let errorMessage = t("updateProfileError");
      
      // Parse error response to show specific validation errors
      if (error.message && error.message.includes("400:")) {
        try {
          const errorData = JSON.parse(error.message.split("400: ")[1]);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If parsing fails, check for common error patterns
          if (error.message.includes("+996")) {
            errorMessage = "Введите номер в формате +996XXXXXXXXX";
          } else if (error.message.includes("email")) {
            errorMessage = "Введите корректный email адрес";
          }
        }
      }
      
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const formatDate = (dateString: string) => {
    const localeMap = {
      'ru': 'ru-RU',
      'en': 'en-US', 
      'ka': 'ka-GE'
    };
    
    return new Date(dateString).toLocaleDateString(localeMap[language as keyof typeof localeMap] || 'ru-RU', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="max-w-[1600px] mx-auto px-6 py-20 text-center">
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-12 border border-red-400/20"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <motion.i 
              className="fas fa-exclamation-triangle text-red-400 text-6xl mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h1 className="text-3xl font-black text-white mb-4">{t("error")}</h1>
            <p className="text-white/70 mb-8 text-lg">{t("loginRequired")}</p>
            <Link href="/">
              <Button className="bg-brand-gradient text-white font-bold px-8 py-3 rounded-xl">
                {t("home")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="max-w-[1600px] mx-auto px-6 py-20 text-center">
          <motion.div 
            className="w-20 h-20 border-4 border-neon-400/30 border-t-neon-400 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/80 text-lg">{t("loading")}...</p>
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
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-20">
          {/* Breadcrumb */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" className="flex items-center space-x-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10">
                    <i className="fas fa-arrow-left"></i>
                    <span>{t("back")}</span>
                  </Button>
                </motion.div>
              </Link>
              <div className="text-sm text-white/60">
                <span>{t("home")}</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span className="text-white font-medium">{t("profileTitle")}</span>
              </div>
            </div>
          </motion.div>

          {/* Profile Header with Number + Content Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Giant User Icon */}
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
                <motion.i 
                  className="fas fa-user"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: [
                      "drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))",
                      "drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))",
                      "drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-electric-400 to-electric-600 mx-auto lg:mx-0 mt-4"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.1 }}
              />
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
                  {t("profileTitle")}
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-2xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  {t("profileDescription")}
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Form */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-neon-400/30 transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <motion.i 
                        className="fas fa-edit text-brand-400 text-xl"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <h3 className="text-2xl font-black text-white">{t("personalInfo")}</h3>
                    </div>
                    {!isEditing ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={() => setIsEditing(true)} 
                          className="bg-electric-gradient text-white font-bold px-6 py-2 rounded-xl border border-white/20"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          {t("editButton")}
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="flex space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            onClick={() => setIsEditing(false)} 
                            variant="outline"
                            className="bg-gray-700/50 border-white/20 text-white hover:bg-gray-600/50"
                          >
                            {t("cancel")}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            onClick={handleSubmit}
                            disabled={updateProfileMutation.isPending}
                            className="bg-brand-gradient text-white font-bold"
                          >
                            {updateProfileMutation.isPending ? `${t("loading")}...` : t("save")}
                          </Button>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username" className="text-white/80 font-medium mb-2 block">{t("username")}</Label>
                      <Input
                        id="username"
                        value={profile?.username || ""}
                        disabled
                        className="bg-gray-700/50 border-white/20 text-white/60 h-12 rounded-xl"
                      />
                      <p className="text-xs text-white/40 mt-2">{t("username")} cannot be changed</p>
                    </div>
                    <div>
                      <Label htmlFor="bidBalance" className="text-white/80 font-medium mb-2 block">{t("bidBalance")}</Label>
                      <Input
                        id="bidBalance"
                        value={`${formatCurrency(profile?.bidBalance || 0)} бидов`}
                        disabled
                        className="bg-gray-700/50 border-white/20 text-white/60 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-white/80 font-medium mb-2 block">{t("firstName")} *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        required
                        placeholder={`Enter your ${t("firstName").toLowerCase()}`}
                        className={`h-12 rounded-xl ${!isEditing ? 'bg-gray-700/50 border-white/20 text-white/60' : 'bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white'}`}
                      />
                      <p className="text-xs text-white/40 mt-2">{t("minimumTwoChars")}</p>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white/80 font-medium mb-2 block">{t("lastName")} *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        required
                        placeholder={`Enter your ${t("lastName").toLowerCase()}`}
                        className={`h-12 rounded-xl ${!isEditing ? 'bg-gray-700/50 border-white/20 text-white/60' : 'bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white'}`}
                      />
                      <p className="text-xs text-white/40 mt-2">{t("minimumTwoChars")}</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white/80 font-medium mb-2 block">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="example@mail.com"
                      className={`h-12 rounded-xl ${!isEditing ? 'bg-gray-700/50 border-white/20 text-white/60' : 'bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white'}`}
                    />
                    <p className="text-xs text-white/40 mt-2">{t("validEmailRequired")}</p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white/80 font-medium mb-2 block">{t("phone")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="+996501234567"
                      className={`h-12 rounded-xl ${!isEditing ? 'bg-gray-700/50 border-white/20 text-white/60' : 'bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white'}`}
                    />
                    <p className="text-xs text-white/40 mt-2">{t("phoneFormat")}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dateOfBirth" className="text-white/80 font-medium mb-2 block">{t("dateOfBirth")}</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        disabled={!isEditing}
                        className={`h-12 rounded-xl ${!isEditing ? 'bg-gray-700/50 border-white/20 text-white/60' : 'bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white'}`}
                      />
                      <p className="text-xs text-white/40 mt-2">{t("mustBe18OrOlder")}</p>
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-white/80 font-medium mb-2 block">{t("gender")}</Label>
                      {isEditing ? (
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                          <SelectTrigger className="h-12 bg-gray-800/60 backdrop-blur-sm border-white/20 focus:border-neon-400/50 text-white rounded-xl">
                            <SelectValue placeholder={t("selectGender")} />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800/95 backdrop-blur-xl border-neon-400/20 rounded-xl">
                            <SelectItem value="male" className="text-white hover:bg-white/10">{t("male")}</SelectItem>
                            <SelectItem value="female" className="text-white hover:bg-white/10">{t("female")}</SelectItem>
                            <SelectItem value="other" className="text-white hover:bg-white/10">{t("other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={formData.gender ? (formData.gender === "male" ? t("male") : formData.gender === "female" ? t("female") : t("other")) : ""}
                          disabled
                          className="bg-gray-700/50 border-white/20 text-white/60 h-12 rounded-xl"
                        />
                      )}
                      <p className="text-xs text-white/40 mt-2">{t("genderRequired")}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <p className="text-white/60 flex items-center">
                      <i className="fas fa-calendar mr-3 text-brand-400"></i>
                      {t("registrationDate")}: {profile ? formatDate(profile.createdAt) : "Unknown"}
                    </p>
                  </div>
                </form>
                </div>
              </motion.div>

              {/* Won Auctions */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-sunset-400/20 overflow-hidden"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 25px 50px rgba(249, 115, 22, 0.2)"
                }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <motion.i 
                      className="fas fa-trophy text-sunset-400 text-xl"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <h3 className="text-2xl font-black text-white">{t("wonAuctions")}</h3>
                    <Badge className="bg-sunset-gradient text-white font-bold px-3 py-1 rounded-full">
                      {wonAuctions.length}
                    </Badge>
                  </div>
                  
                  {wonAuctions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-700/30 rounded-2xl border border-white/10">
                      <motion.i 
                        className="fas fa-trophy text-white/30 text-6xl mb-6"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <p className="text-white/70 mb-2 text-lg font-bold">{t("noWonAuctions")}</p>
                      <p className="text-white/50">{t("participateToWinPrizes")}</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {wonAuctions.map((auction) => (
                        <motion.div 
                          key={auction.id} 
                          className="bg-gray-700/50 backdrop-blur-sm border border-white/10 hover:border-sunset-400/30 rounded-2xl p-6 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={auction.imageUrl}
                              alt={auction.title}
                              className="w-16 h-16 object-cover rounded-xl border-2 border-white/20"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-white truncate">{auction.title}</h4>
                              <p className="text-sm text-white/60">
                                {t("won")} {formatDate(auction.wonAt)}
                              </p>
                              <p className="text-xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                                {formatCurrency(auction.finalPrice)}
                              </p>
                              <Link href={`/auction/${auction.slug}`}>
                                <Button className="mt-3 bg-sunset-gradient text-white font-bold px-4 py-2 rounded-xl text-sm">
                                  <i className="fas fa-external-link-alt mr-2"></i>
                                  {t("view")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Statistics */}
            <div className="space-y-8">
              {/* User Statistics */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-brand-400/20 overflow-hidden"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
                }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-8">
                    <motion.i 
                      className="fas fa-chart-bar text-brand-400 text-xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <h3 className="text-2xl font-black text-white">{t("statistics")}</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { icon: "fas fa-gavel", label: t("activeBids"), value: stats?.activeBids || 0, color: 'brand' },
                      { icon: "fas fa-clock", label: t("activePrebids"), value: stats?.activePrebids || 0, color: 'electric' },
                      { icon: "fas fa-trophy", label: t("wonAuctionsCount"), value: stats?.wonAuctions || 0, color: 'sunset' },
                      { icon: "fas fa-coins", label: t("totalSpent"), value: formatCurrency(stats?.totalSpent || 0), color: 'neon', subtitle: `(${t("bidsAndPrebids")})` },
                      { icon: "fas fa-percentage", label: t("successRate"), value: `${stats?.activeBids && stats.activeBids > 0 ? Math.round(((stats.wonAuctions || 0) / stats.activeBids) * 100) : 0}%`, color: 'electric' }
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        className={`p-6 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border border-${stat.color}-400/20 rounded-2xl backdrop-blur-sm`}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
                            animate={{ 
                              boxShadow: [
                                `0 0 10px rgba(14, 165, 233, 0.3)`,
                                `0 0 20px rgba(14, 165, 233, 0.5)`,
                                `0 0 10px rgba(14, 165, 233, 0.3)`
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          >
                            <i className={`${stat.icon} text-white`}></i>
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                            <p className={`text-2xl font-black text-${stat.color}-400`}>{stat.value}</p>
                            {stat.subtitle && (
                              <p className="text-xs text-white/40">{stat.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-electric-400/20 overflow-hidden"
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
                }}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <motion.i 
                      className="fas fa-history text-electric-400 text-xl"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <h3 className="text-2xl font-black text-white">{t("lastBids")}</h3>
                  </div>
                  
                  {recentBids.length === 0 ? (
                    <div className="text-center py-8 bg-gray-700/30 rounded-2xl border border-white/10">
                      <motion.i 
                        className="fas fa-history text-white/30 text-4xl mb-4"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-white/70 font-bold">{t("noRecentBids")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {recentBids.slice(0, 10).map((bid) => (
                        <motion.div 
                          key={bid.id} 
                          className="flex items-center justify-between p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-electric-400/30 transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                              <i className="fas fa-gavel text-white text-xs"></i>
                            </div>
                            <div>
                              <p className="font-bold text-white truncate max-w-[120px]">
                                Аукцион #{bid.auctionId.slice(-4)}
                              </p>
                              <p className="text-xs text-white/60">
                                {formatDate(bid.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className="font-black text-electric-400">{formatCurrency(bid.amount)}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <Link href="/bid-history">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full bg-electric-gradient text-white font-bold h-12 rounded-xl">
                          <i className="fas fa-external-link-alt mr-2"></i>
                          {t("viewFullHistory")}
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}