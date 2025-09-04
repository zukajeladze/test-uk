import { useDocumentTitle } from "@/hooks/use-document-title";
import { useSettings } from "@/hooks/use-settings";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AuctionRules() {
  useDocumentTitle("Правила аукционов -  Deshevshe.ua | Условия участия в пенни-аукционах");
  const { formatCurrency } = useSettings();
  const { t } = useLanguage();

  const rulesSections = [
    {
      icon: "fas fa-play-circle",
      title: "Как начать участие",
      color: "green",
      rules: [
        "Зарегистрируйтесь на сайте  Deshevshe.ua",
        "Пополните баланс бидов через удобный способ оплаты",
        "Выберите интересующий вас аукцион",
        "Дождитесь начала аукциона и начинайте делать ставки"
      ]
    },
    {
      icon: "fas fa-gavel",
      title: "Правила ставок",
      color: "blue",
      rules: [
        `Каждая ставка стоит ${t("oneBid")} из вашего баланса`,
        `Ставка увеличивает цену товара на ${formatCurrency(0.01)}`,
        "Время аукциона продлевается на 10-15 секунд после каждой ставки",
        "Ставки нельзя отменить после их размещения",
        "Минимальный интервал между ставками одного пользователя - 1 секунда"
      ]
    },
    {
      icon: "fas fa-trophy",
      title: "Определение победителя",
      color: "yellow",
      rules: [
        "Побеждает пользователь, сделавший последнюю ставку",
        "Аукцион завершается, когда таймер достигает 0",
        "Победитель оплачивает финальную цену товара",
        "Товар резервируется за победителем на 48 часов",
        "При отказе от покупки товар переходит к предыдущему участнику"
      ]
    },
    {
      icon: "fas fa-coins",
      title: "Биды и оплата",
      color: "orange",
      rules: [
        "Биды списываются сразу при размещении ставки",
        "Потраченные биды не возвращаются независимо от результата",
        "Минимальная покупка - 10 бидов",
        "Биды действительны в течение 365 дней с момента покупки",
        "Неиспользованные биды не подлежат возврату в денежном эквиваленте"
      ]
    }
  ];

  const prohibitedActions = [
    "Использование автоматических программ и ботов",
    "Создание множественных аккаунтов одним пользователем",
    "Попытки взлома или нарушения работы сайта",
    "Оскорбительное поведение в отношении других участников",
    "Попытки мошенничества или обмана системы",
    "Продажа или передача аккаунта третьим лицам"
  ];

  const deliveryRules = [
    {
      title: "Самовывоз",
      description: "Бесплатно из офиса в Бишкеке",
      time: "В рабочие дни с 9:00 до 18:00"
    },
    {
      title: "Доставка по Бишкеку",
      description: "Курьерская доставка",
      time: "200 сом, 1-2 рабочих дня"
    },
    {
      title: "Доставка по регионам",
      description: "Почтовая служба или транспортные компании",
      time: "По тарифам перевозчика, 3-7 дней"
    }
  ];

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
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-sunset-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl"
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-sunset-400 to-sunset-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-balance-scale"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
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
                  level={1}
                  className="text-4xl lg:text-6xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  Правила аукционов
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Ознакомьтесь с правилами участия в пенни-аукционах  Deshevshe.ua для честной и безопасной игры.
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          {/* Main Rules */}
          <StaggeredList 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            stagger={0.1}
            delay={0.1}
          >
            {rulesSections.map((section, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-neon-400/30 transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br from-${section.color === 'green' ? 'brand' : section.color === 'blue' ? 'electric' : section.color === 'yellow' ? 'sunset' : 'neon'}-500 to-${section.color === 'green' ? 'brand' : section.color === 'blue' ? 'electric' : section.color === 'yellow' ? 'sunset' : 'neon'}-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl`}
                      animate={{ 
                        boxShadow: [
                          "0 0 20px rgba(14, 165, 233, 0.3)",
                          "0 0 30px rgba(14, 165, 233, 0.5)",
                          "0 0 20px rgba(14, 165, 233, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <i className={`${section.icon} text-white text-2xl`}></i>
                    </motion.div>
                    <h3 className="text-2xl font-black text-white">{section.title}</h3>
                  </div>
                  <ul className="space-y-4">
                    {section.rules.map((rule, ruleIndex) => (
                      <motion.li 
                        key={ruleIndex} 
                        className="flex items-start"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.i 
                          className="fas fa-check-circle text-green-400 mr-4 mt-1 flex-shrink-0"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: ruleIndex * 0.2 }}
                        />
                        <span className="text-white/80 leading-relaxed">{rule}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </StaggeredList>

          {/* Additional Sections in Grid */}
          <div className="grid grid-cols-1 gap-12">
            {/* Prohibited Actions */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-red-400/20 overflow-hidden"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 25px 50px rgba(239, 68, 68, 0.2)"
              }}
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <motion.i 
                    className="fas fa-ban text-red-400 text-2xl mr-4"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div>
                    <h3 className="text-2xl font-black text-white">Запрещенные действия</h3>
                    <p className="text-white/70 mt-2">
                      Нарушение этих правил приведет к блокировке аккаунта без возмещения средств
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prohibitedActions.map((action, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start p-4 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-400/20"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <i className="fas fa-times-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                      <span className="text-white/80 text-sm">{action}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Delivery Rules */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-brand-400/20 overflow-hidden"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
              }}
            >
              <div className="p-8">
                <div className="flex items-center mb-8">
                  <motion.i 
                    className="fas fa-shipping-fast text-brand-400 text-2xl mr-4"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div>
                    <h3 className="text-2xl font-black text-white">Правила доставки</h3>
                    <p className="text-white/70 mt-2">Условия получения выигранных товаров</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {deliveryRules.map((delivery, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center p-6 bg-gray-700/50 backdrop-blur-sm border border-white/10 hover:border-brand-400/30 rounded-2xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <h4 className="font-black text-white mb-3">{delivery.title}</h4>
                      <p className="text-white/70 mb-4">{delivery.description}</p>
                      <Badge className="bg-brand-gradient text-white font-bold">
                        {delivery.time}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-sunset-400/20 overflow-hidden"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 25px 50px rgba(249, 115, 22, 0.2)"
              }}
            >
              <div className="p-8">
                <div className="flex items-center mb-8">
                  <motion.i 
                    className="fas fa-exclamation-triangle text-sunset-400 text-2xl mr-4"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h3 className="text-2xl font-black text-white">Важные замечания</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Ответственность участника", desc: "Участвуя в аукционах, вы соглашаетесь с тем, что понимаете принцип работы пенни-аукционов и принимаете возможные риски.", color: 'sunset' },
                    { title: "Техническая поддержка", desc: "При технических проблемах во время аукциона немедленно обратитесь в службу поддержки. Компенсация возможна только при подтвержденных технических неполадках.", color: 'brand' },
                    { title: "Честная игра", desc: " Deshevshe.ua стремится обеспечить честные и прозрачные аукционы для всех участников. Мы постоянно мониторим систему для предотвращения мошенничества.", color: 'electric' }
                  ].map((note, index) => (
                    <motion.div 
                      key={index} 
                      className={`p-6 bg-gradient-to-br from-${note.color}-500/10 to-${note.color}-600/5 border border-${note.color}-400/20 rounded-2xl backdrop-blur-sm`}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <h4 className={`font-black text-${note.color}-400 mb-3`}>{note.title}</h4>
                      <p className="text-white/70 text-sm leading-relaxed">{note.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}