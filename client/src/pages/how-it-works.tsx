import { Header } from "@/components/header";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";

export default function HowItWorks() {
  const { formatCurrency } = useSettings();
  const { t } = useLanguage();
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
      
        <main className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-16 space-y-32">
          
          {/* Hero Section with Number + Content Grid */}
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-brand-400 to-brand-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ?
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-brand-400 to-brand-600 mx-auto lg:mx-0 mt-4"
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
                  {t("howPennyAuctionsWorkTitle")}
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-2xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  {t("simpleGuideSubtitle")}
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          {/* Steps Section with Number + Content Grid */}
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-neon-400 to-neon-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                03
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-neon-400 to-neon-600 mx-auto lg:mx-0 mt-4"
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
                  className="text-4xl lg:text-5xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  ПРОСТЫЕ ШАГИ
                </AnimatedHeading>
              </div>

              {/* Steps Grid */}
              <StaggeredList 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                stagger={0.15}
                delay={0.1}
              >
                {[
                  { number: 1, color: 'brand', icon: 'fas fa-user-plus' },
                  { number: 2, color: 'electric', icon: 'fas fa-coins' },
                  { number: 3, color: 'sunset', icon: 'fas fa-trophy' }
                ].map((step, index) => (
                  <motion.div 
                    key={step.number}
                    className="text-center bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-neon-400/30 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <motion.div 
                      className={`w-24 h-24 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                      animate={{ 
                        boxShadow: [
                          `0 0 20px rgba(14, 165, 233, 0.3)`,
                          `0 0 40px rgba(14, 165, 233, 0.5)`,
                          `0 0 20px rgba(14, 165, 233, 0.3)`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <span className="text-white text-3xl font-black">{step.number}</span>
                    </motion.div>
                    <h3 className="text-xl font-black text-white mb-4">
                      {step.number === 1 && t("step1Title")}
                      {step.number === 2 && t("step2Title")}
                      {step.number === 3 && t("step3Title")}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {step.number === 1 && t("step1Desc")}
                      {step.number === 2 && t("step2Desc")}
                      {step.number === 3 && t("step3Desc")}
                    </p>
                  </motion.div>
                ))}
              </StaggeredList>
            </div>
          </motion.div>

          {/* Rules Section with Number + Content Grid */}
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
                transition={{ duration: 5, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-lightbulb"
                  animate={{ 
                    filter: [
                      "brightness(1)",
                      "brightness(1.5)",
                      "brightness(1)"
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
                  level={2}
                  className="text-4xl lg:text-5xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  {t("howItWorksTitle")}
                </AnimatedHeading>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Rules */}
                <motion.div 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-neon-400/20"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
                  }}
                >
                  <h3 className="text-xl font-black text-white mb-6">{t("basicRules")}</h3>
                  <div className="space-y-4">
                    {[
                      { icon: 'fas fa-check', color: 'brand', text: t("bidIncreasesPrice").replace("{currency}", formatCurrency(0.01)) },
                      { icon: 'fas fa-clock', color: 'electric', text: t("timerResets10Seconds") },
                      { icon: 'fas fa-trophy', color: 'sunset', text: t("lastParticipantWins") },
                      { icon: 'fas fa-coins', color: 'neon', text: t("fixedBidCost") }
                    ].map((rule, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <motion.div 
                          className={`w-8 h-8 bg-gradient-to-br from-${rule.color}-500 to-${rule.color}-600 rounded-full flex items-center justify-center mt-1 shadow-lg`}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <i className={`${rule.icon} text-white text-xs`}></i>
                        </motion.div>
                        <span className="text-white/80 leading-relaxed">{rule.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Example */}
                <motion.div 
                  className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-sunset-400/20"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(249, 115, 22, 0.2)"
                  }}
                >
                  <h3 className="text-xl font-black text-white mb-6">{t("auctionExample")}</h3>
                  <motion.div 
                    className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 space-y-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">{t("startingPrice")}</span>
                      <span className="font-bold text-white">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">{t("after50Bids").replace("{currency}", formatCurrency(0.01))}</span>
                      <span className="font-bold text-white">{formatCurrency(0.50)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">{t("retailPrice")}</span>
                      <span className="text-red-400 line-through font-bold">{formatCurrency(150000)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/20 pt-4">
                      <span className="text-sm font-bold text-white">{t("winnerPrice")}</span>
                      <motion.span 
                        className="font-black text-green-400 text-xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {formatCurrency(0.50)}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Tips Section with Number + Content Grid */}
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
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-star"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-sunset-400 to-sunset-600 mx-auto lg:mx-0 mt-4"
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
                  className="text-4xl lg:text-5xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  {t("successfulParticipationTips")}
                </AnimatedHeading>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column Tips */}
                <div className="space-y-6">
                  {[
                    { icon: 'fas fa-eye', color: 'brand', title: t("observeBeforeParticipating"), desc: t("observeDesc") },
                    { icon: 'fas fa-clock', color: 'electric', title: t("chooseTimingTitle"), desc: t("chooseTimingDesc") },
                    { icon: 'fas fa-target', color: 'sunset', title: t("setLimits"), desc: t("setLimitsDesc") }
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-neon-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br from-${tip.color}-500 to-${tip.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <i className={`${tip.icon} text-white text-sm`}></i>
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-black text-white mb-2">{tip.title}</h4>
                        <p className="text-white/70 text-sm leading-relaxed">{tip.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Right Column Tips */}
                <div className="space-y-6">
                  {[
                    { icon: 'fas fa-users', color: 'neon', title: t("studyCompetitors"), desc: t("studyCompetitorsDesc") },
                    { icon: 'fas fa-chart-line', color: 'electric', title: t("followStatistics"), desc: t("followStatisticsDesc") },
                    { icon: 'fas fa-graduation-cap', color: 'brand', title: t("practice"), desc: t("practiceDesc") }
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-neon-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br from-${tip.color}-500 to-${tip.color}-600 rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <i className={`${tip.icon} text-white text-sm`}></i>
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-black text-white mb-2">{tip.title}</h4>
                        <p className="text-white/70 text-sm leading-relaxed">{tip.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section with Number + Content Grid */}
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-neon-400 to-neon-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-question-circle"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-neon-400 to-neon-600 mx-auto lg:mx-0 mt-4"
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
                  className="text-4xl lg:text-5xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  {t("faq")}
                </AnimatedHeading>
              </div>

              <StaggeredList 
                className="space-y-6"
                stagger={0.1}
                delay={0.1}
              >
                {[
                  { question: t("faqQuestion1"), answer: t("faqAnswer1") },
                  { question: t("faqQuestion2"), answer: t("faqAnswer2") },
                  { question: t("faqQuestion3"), answer: t("faqAnswer3") },
                  { question: t("faqQuestion4"), answer: t("faqAnswer4") }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-neon-400/30 transition-all duration-300"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    <h4 className="text-xl font-black text-white mb-4 leading-tight">
                      {faq.question}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </StaggeredList>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}