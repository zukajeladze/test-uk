import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { Header } from '@/components/header';
import { trackTopUp } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { AnimatedText, AnimatedHeading, StaggeredList } from '@/components/ui/animated-text';
import goldBagImage from '@assets/img_1755139968219.png';

// Bid packages data
const bidPackages = [
  {
    id: 1,
    title: "50 ставок",
    bids: 50,
    price: 750,
    originalPrice: 1000,
    savings: 250,
    popular: false,
    description: "Идеально для начинающих"
  },
  {
    id: 2,
    title: "100 ставок",
    bids: 100,
    price: 1500,
    originalPrice: 2000,
    savings: 500,
    popular: false,
    description: "Для активных участников"
  },
  {
    id: 3,
    title: "250 ставок",
    bids: 250,
    price: 3750,
    originalPrice: 5000,
    savings: 1250,
    popular: true,
    description: "Самый выгодный выбор"
  },
  {
    id: 4,
    title: "500 ставок",
    bids: 500,
    price: 7500,
    originalPrice: 10000,
    savings: 2500,
    popular: false,
    description: "Для профессионалов"
  },
  {
    id: 5,
    title: "1000 ставок",
    bids: 1000,
    price: 15000,
    originalPrice: 20000,
    savings: 5000,
    popular: false,
    description: "Максимальный пакет"
  }
];

export default function TopUp() {
  const { t } = useLanguage();

  useEffect(() => {
    // Set page title
    document.title = `${t('topUpBalance')} - Deshevshe.ua`;
    
    // Set viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(meta);
    }
    
    // Set description meta tag
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', 'Пополните баланс для участия в аукционах Deshevshe.ua');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Пополните баланс для участия в аукционах Deshevshe.ua';
      document.head.appendChild(meta);
    }
  }, [t]);

  const handleBuyPackage = (packageId: number) => {
    const paymentUrls: { [key: number]: string } = {
      1: 'https://oplata.info/asp2/pay_wm.asp?id_d=5276665&lang=ru-RU', // 50 ставок
      2: 'https://oplata.info/asp2/pay_wm.asp?id_d=5355201&lang=ru-RU', // 100 ставок
      3: 'https://oplata.info/asp2/pay_wm.asp?id_d=5355203&lang=ru-RU', // 250 ставок
      4: 'https://oplata.info/asp2/pay_wm.asp?id_d=5355213&lang=ru-RU', // 500 ставок
      5: 'https://oplata.info/asp2/pay_wm.asp?id_d=5355214&lang=ru-RU'  // 1000 ставок
    };

    const url = paymentUrls[packageId];
    if (url) {
      // Find the package to get the price for tracking
      const selectedPackage = bidPackages.find(pkg => pkg.id === packageId);
      if (selectedPackage) {
        // Track the purchase initiation
        trackTopUp(selectedPackage.price);
      }
      
      window.open(url, '_blank');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} сом`;
  };

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
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-sunset-500/10 rounded-full blur-2xl"
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-electric-400 to-electric-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-coins"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
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
                  {t('topUpBalance')}
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Выберите пакет бидов и начните выигрывать в аукционах уже сегодня
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          {/* Bid Packages Grid */}
          <StaggeredList 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
            stagger={0.1}
            delay={0.1}
          >
            {bidPackages.map((pkg) => (
              <motion.div 
                key={pkg.id} 
                className={`relative bg-gray-800/60 backdrop-blur-sm rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  pkg.popular 
                    ? 'border-sunset-400/50 shadow-2xl' 
                    : 'border-white/20 hover:border-electric-400/50'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: pkg.popular 
                    ? "0 30px 60px rgba(249, 115, 22, 0.3)" 
                    : "0 25px 50px rgba(34, 211, 238, 0.3)"
                }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="bg-sunset-gradient text-white px-6 py-3 rounded-full text-sm font-black shadow-2xl flex items-center space-x-2 border border-white/20 backdrop-blur-sm">
                      <motion.span 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        ⭐
                      </motion.span>
                      <span>ПОПУЛЯРНЫЙ</span>
                    </div>
                  </motion.div>
                )}

                <div className="p-8">
                  {/* Gold Coins Bag Image */}
                  <motion.div 
                    className="w-28 h-28 mx-auto mb-8 relative"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <img 
                      src={goldBagImage}
                      alt="Gold coins bag"
                      className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                  </motion.div>

                  {/* Package Title */}
                  <h3 className="text-2xl font-black text-white text-center mb-4">
                    {pkg.title}
                  </h3>

                  {/* Bids Count */}
                  <div className="text-center mb-6">
                    <motion.div 
                      className={`text-4xl font-black mb-2 ${
                        pkg.popular 
                          ? 'bg-gradient-to-r from-sunset-400 to-sunset-500 bg-clip-text text-transparent' 
                          : 'bg-gradient-to-r from-electric-400 to-electric-500 bg-clip-text text-transparent'
                      }`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {pkg.bids}
                    </motion.div>
                    <div className="text-white/60 font-bold uppercase tracking-wide">
                      {pkg.bids === 1 ? 'бид' : 'бидов'}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 text-center mb-6 font-medium">
                    {pkg.description}
                  </p>

                  {/* Pricing */}
                  <div className="text-center mb-8 space-y-3">
                    <motion.div 
                      className="text-3xl font-black text-white"
                      whileHover={{ scale: 1.1 }}
                    >
                      {formatCurrency(pkg.price)}
                    </motion.div>
                    <div className="text-white/40 line-through font-bold">
                      {formatCurrency(pkg.originalPrice)}
                    </div>
                    <motion.div 
                      className="inline-block bg-green-500/20 border border-green-400/30 text-green-400 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm"
                      animate={{ 
                        boxShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.3)",
                          "0 0 20px rgba(34, 197, 94, 0.5)",
                          "0 0 10px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Экономия {formatCurrency(pkg.savings)}
                    </motion.div>
                  </div>

                  {/* Buy Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleBuyPackage(pkg.id)}
                      className={`w-full h-14 rounded-2xl font-black text-lg transition-all duration-300 relative overflow-hidden group ${
                        pkg.popular 
                          ? 'bg-sunset-gradient hover:shadow-2xl text-white border border-white/20 backdrop-blur-sm' 
                          : 'bg-electric-gradient hover:shadow-xl text-white border border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Купить сейчас</span>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </StaggeredList>

          {/* Features Section */}
          <StaggeredList 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            stagger={0.15}
            delay={0.1}
          >
            {[
              { icon: "fas fa-shield-alt", title: "Безопасная оплата", desc: "Все платежи защищены SSL шифрованием и проходят через надежную платежную систему", color: 'brand' },
              { icon: "fas fa-bolt", title: "Мгновенное зачисление", desc: "Биды поступят на ваш счет автоматически сразу после успешной оплаты", color: 'electric' },
              { icon: "fas fa-headset", title: "Поддержка 24/7", desc: "Наша команда поддержки готова помочь вам в любое время дня и ночи", color: 'neon' }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-neon-400/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                }}
              >
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                  animate={{ 
                    boxShadow: [
                      `0 0 20px rgba(14, 165, 233, 0.3)`,
                      `0 0 30px rgba(14, 165, 233, 0.5)`,
                      `0 0 20px rgba(14, 165, 233, 0.3)`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </motion.div>
                <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </StaggeredList>

          {/* How it Works */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-brand-400/20 overflow-hidden"
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
            }}
          >
            <div className="p-12">
              <AnimatedHeading 
                level={2}
                className="text-4xl font-black text-white text-center mb-12"
                animation="whipInUp"
                delay={0.1}
              >
                Как это работает
              </AnimatedHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { step: 1, title: "Выберите пакет", desc: "Выберите подходящий пакет бидов из представленных выше", color: 'brand' },
                  { step: 2, title: "Оплатите покупку", desc: "Безопасно оплатите выбранный пакет любым удобным способом", color: 'electric' },
                  { step: 3, title: "Начните участвовать", desc: "Биды автоматически зачислятся и вы сможете участвовать в аукционах", color: 'sunset' }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl shadow-2xl`}
                      animate={{ 
                        boxShadow: [
                          `0 0 20px rgba(14, 165, 233, 0.3)`,
                          `0 0 30px rgba(14, 165, 233, 0.5)`,
                          `0 0 20px rgba(14, 165, 233, 0.3)`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="text-xl font-black text-white mb-4">{step.title}</h3>
                    <p className="text-white/70 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}