import { Link } from "wouter";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black text-white border-t border-neon-400/20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 cyber-grid" />
        <motion.div 
          className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-xl"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(14, 165, 233, 0.3)",
                    "0 0 30px rgba(14, 165, 233, 0.5)",
                    "0 0 20px rgba(14, 165, 233, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-gavel text-white text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-white to-neon-300 bg-clip-text text-transparent">
                {settings?.siteName || "Deshevshe.ua"}
              </h3>
            </motion.div>
            <p className="text-white/70 leading-relaxed">
              {settings?.footerDescription || "Первая пенни-аукционная платформа в Украине. Выигрывайте премиальные товары за копейки с нашей честной и прозрачной системой аукционов."}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: 'fab fa-facebook', color: 'brand' },
                { icon: 'fab fa-instagram', color: 'electric' },
                { icon: 'fab fa-telegram', color: 'neon' },
                { icon: 'fab fa-whatsapp', color: 'sunset' }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className={`w-12 h-12 bg-gray-800/60 backdrop-blur-sm border border-${social.color}-400/30 hover:border-${social.color}-400/60 rounded-2xl flex items-center justify-center transition-all duration-300`}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: `rgba(14, 165, 233, 0.1)`
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`${social.icon} text-white/80 hover:text-${social.color}-400 text-lg transition-colors duration-300`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <h4 className="text-xl font-black bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", icon: "fas fa-home", label: t("home") },
                { href: "/auctions", icon: "fas fa-gavel", label: t("auctions") },
                { href: "/how-it-works", icon: "fas fa-question-circle", label: t("howItWorks") },
                { href: "/topup", icon: "fas fa-credit-card", label: t("topUpBalance") }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center space-x-3 text-white/70 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-white/5"
                  >
                    <motion.i 
                      className={`${link.icon} text-electric-400 group-hover:text-electric-300 transition-colors duration-300`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <h4 className="text-xl font-black bg-gradient-to-r from-neon-400 to-neon-500 bg-clip-text text-transparent">
              {t("support")}
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/support", icon: "fas fa-headset", label: t("customerSupport") },
                { href: "/auction-rules", icon: "fas fa-file-alt", label: t("auctionRules") },
                { href: "/privacy-policy", icon: "fas fa-shield-alt", label: t("privacyPolicy") },
                { href: "/terms-of-service", icon: "fas fa-balance-scale", label: t("termsOfService") }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center space-x-3 text-white/70 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-white/5"
                  >
                    <motion.i 
                      className={`${link.icon} text-neon-400 group-hover:text-neon-300 transition-colors duration-300`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <motion.button 
                  onClick={() => {
                    localStorage.removeItem("cookie-consent");
                    localStorage.removeItem("cookie-preferences");
                    window.location.reload();
                  }}
                  className="group flex items-center space-x-3 text-white/70 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-white/5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.i 
                    className="fas fa-cookie-bite text-neon-400 group-hover:text-neon-300 transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="font-medium">{t("cookieSettings")}</span>
                </motion.button>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <h4 className="text-xl font-black bg-gradient-to-r from-sunset-400 to-sunset-500 bg-clip-text text-transparent">
              {t("contactUs")}
            </h4>
            <div className="space-y-4">
              {[
                { icon: "fas fa-map-marker-alt", text: "вул. Хрещатик, 15, Київ, 01001, Україна", color: 'brand' },
                { icon: "fas fa-phone", text: "+996 (555) 123-456", color: 'electric' },
                { icon: "fas fa-envelope", text: "info@Deshevshe.ua", color: 'neon' },
                { icon: "fas fa-clock", text: t("support24x7"), color: 'sunset' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 text-white/70 p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.i 
                    className={`${contact.icon} text-${contact.color}-400`}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="font-medium text-sm">{contact.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="border-t border-neon-400/20 mt-16 pt-12"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { 
                value: "1,247", 
                label: settings?.language === "ru" ? "Активных пользователей" : 
                       settings?.language === "en" ? "Active Users" : 
                       settings?.language === "ka" ? "აქტიური მომხმარებლები" : 
                       "Активных пользователей",
                color: 'brand',
                icon: 'fas fa-users'
              },
              { 
                value: "2.8M", 
                label: settings?.language === "ru" ? "Сохранено покупателями" : 
                       settings?.language === "en" ? "Saved by Buyers" : 
                       settings?.language === "ka" ? "შეზოგილი მყიდველების მიერ" : 
                       "Сохранено покупателями",
                color: 'electric',
                icon: 'fas fa-piggy-bank'
              },
              { 
                value: "356", 
                label: t("completedAuctions"),
                color: 'neon',
                icon: 'fas fa-trophy'
              },
              { 
                value: "97%", 
                label: t("satisfiedCustomers"),
                color: 'sunset',
                icon: 'fas fa-heart'
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl p-6 border border-${stat.color}-400/20 hover:border-${stat.color}-400/40 transition-all duration-300`}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.i 
                  className={`${stat.icon} text-${stat.color}-400 text-2xl mb-3`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                />
                <motion.div 
                  className={`text-3xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 bg-clip-text text-transparent`}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-white/60 mt-2 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          className="border-t border-neon-400/20 mt-12 pt-8"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: "fas fa-shield-check", text: t("securePayments"), color: 'brand' },
                { icon: "fas fa-award", text: t("licensedPlatform"), color: 'electric' },
                { icon: "fas fa-handshake", text: t("fairAuctions"), color: 'sunset' }
              ].map((trust, index) => (
                <motion.div 
                  key={index}
                  className={`flex items-center space-x-2 text-${trust.color}-400 text-sm font-medium`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.i 
                    className={trust.icon}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  />
                  <span>{trust.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {/* SSL Secure Badge */}
              <motion.div 
                className="flex items-center bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 px-4 py-2 rounded-2xl text-xs font-bold text-green-400"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-lock mr-2"></i>
                SSL Secure
              </motion.div>
              
              {/* Payment Security Badge */}
              <motion.div 
                className="flex items-center bg-gradient-to-r from-brand-500/20 to-brand-600/20 backdrop-blur-sm border border-brand-400/30 px-4 py-2 rounded-2xl text-xs font-bold text-brand-400"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(14, 165, 233, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                256-bit
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="border-t border-neon-400/20 mt-8 pt-8"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} {settings?.siteName || "Deshevshe.ua"}. 
              {settings?.language === "ru" && " Все права защищены."}
              {settings?.language === "en" && " All rights reserved."}
              {settings?.language === "ka" && " ყველა უფლება დაცულია."}
              {!settings?.language && " Все права защищены."}
            </p>
            <motion.p 
              className="text-neon-400 text-sm font-medium"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(34, 211, 238, 0.5)",
                  "0 0 20px rgba(34, 211, 238, 0.7)",
                  "0 0 10px rgba(34, 211, 238, 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {settings?.language === "ru" && "Первая пенни-аукционная платформа в Украине"}
              {settings?.language === "en" && "First penny auction platform in Kyrgyzstan"}
              {settings?.language === "ka" && "პირველი პენი აუქციონის პლატფორმა ყირგიზეთში"}
              {!settings?.language && "Первая пенни-аукционная платформа в Украине"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}