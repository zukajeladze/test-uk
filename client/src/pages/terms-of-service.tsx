import { useDocumentTitle } from "@/hooks/use-document-title";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  useDocumentTitle("Условия использования - Deshevshe.ua | Пользовательское соглашение");

  const termssections = [
    {
      title: "1. Общие условия",
      content: [
        "Настоящие Условия использования регулируют порядок использования сервиса Deshevshe.ua.",
        "Регистрируясь на сайте и используя наши услуги, вы соглашаетесь с данными условиями в полном объеме.",
        "Если вы не согласны с какими-либо положениями, пожалуйста, прекратите использование сервиса.",
        "Администрация оставляет за собой право изменять условия использования без предварительного уведомления."
      ]
    },
    {
      title: "2. Описание сервиса",
      content: [
        "Deshevshe.ua - это платформа для проведения пенни-аукционов в Кыргызской Республике.",
        "Сервис позволяет пользователям участвовать в аукционах, делать ставки и приобретать товары по выигрышным ценам.",
        "Все аукционы проводятся в соответствии с правилами, опубликованными на сайте.",
        "Администрация не гарантирует постоянную доступность сервиса и может приостанавливать работу для технического обслуживания."
      ]
    },
    {
      title: "3. Регистрация и аккаунт пользователя",
      content: [
        "Для участия в аукционах необходима регистрация на сайте.",
        "При регистрации вы обязуетесь предоставить достоверную и актуальную информацию.",
        "Вы несете полную ответственность за сохранность данных своего аккаунта.",
        "Запрещается создание множественных аккаунтов одним пользователем.",
        "Администрация имеет право заблокировать аккаунт при нарушении правил."
      ]
    },
    {
      title: "4. Правила участия в аукционах",
      content: [
        "Участие в аукционах возможно только после пополнения баланса бидов.",
        "Каждая ставка списывает один бид с баланса пользователя.",
        "Потраченные биды не возвращаются независимо от результата аукциона.",
        "Победитель аукциона обязан оплатить финальную стоимость товара в течение 48 часов.",
        "При отказе от покупки товар может быть предложен следующему участнику."
      ]
    },
    {
      title: "5. Платежи и возвраты",
      content: [
        "Все платежи на сайте производятся в сомах Кыргызской Республики.",
        "Администрация принимает оплату банковскими картами и электронными кошельками.",
        "Биды не подлежат возврату в денежном эквиваленте.",
        "Возврат средств возможен только в случае технических ошибок системы.",
        "Все спорные вопросы по платежам рассматриваются в индивидуальном порядке."
      ]
    },
    {
      title: "6. Интеллектуальная собственность",
      content: [
        "Все материалы сайта (дизайн, тексты, логотипы) являются собственностью Deshevshe.ua.",
        "Пользователям запрещается копировать, распространять или использовать материалы сайта без письменного разрешения.",
        "Торговые марки и логотипы третьих лиц используются с соответствующими разрешениями.",
        "Нарушение авторских прав влечет ответственность в соответствии с законодательством."
      ]
    }
  ];

  const prohibitions = [
    "Использование автоматических программ и скриптов",
    "Попытки взлома или нарушения работы сайта",
    "Размещение вредоносного контента",
    "Мошеннические действия и обман других пользователей",
    "Нарушение авторских прав третьих лиц",
    "Распространение спама и рекламы",
    "Оскорбительное поведение по отношению к другим пользователям",
    "Попытки обхода технических ограничений сайта"
  ];

  const liabilityItems = [
    {
      title: "Ограничение ответственности",
      description: "Deshevshe.ua не несет ответственности за косвенные убытки, упущенную выгоду или моральный вред."
    },
    {
      title: "Качество товаров",
      description: "Администрация стремится предоставлять точную информацию о товарах, но не гарантирует отсутствие ошибок."
    },
    {
      title: "Технические сбои",
      description: "В случае технических проблем администрация принимает меры по их устранению в кратчайшие сроки."
    },
    {
      title: "Действия пользователей",
      description: "Каждый пользователь несет личную ответственность за свои действия на платформе."
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
                  className="fas fa-file-contract"
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
                  Условия использования
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Пользовательское соглашение определяет правила и условия использования платформы Deshevshe.ua.
                </AnimatedText>
                
                <motion.div 
                  className="flex items-center space-x-6 text-white/60 text-sm bg-gray-800/50 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <span>Вступили в силу: 01.01.2025</span>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <StaggeredList 
            className="space-y-8"
            stagger={0.1}
            delay={0.1}
          >
            {termssections.map((section, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-neon-400/30 transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="p-8">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center">
                    <motion.div 
                      className="w-8 h-8 bg-electric-gradient rounded-xl flex items-center justify-center mr-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-white text-sm font-black">{index + 1}</span>
                    </motion.div>
                    {section.title}
                  </h3>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-white/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggeredList>

          {/* Prohibited Actions */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-red-400/20 overflow-hidden"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(239, 68, 68, 0.2)"
            }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <motion.i 
                  className="fas fa-exclamation-triangle text-red-400 text-2xl mr-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div>
                  <h3 className="text-2xl font-black text-white">Запрещенные действия</h3>
                  <p className="text-white/70 mt-2">
                    Следующие действия строго запрещены и могут привести к блокировке аккаунта
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prohibitions.map((prohibition, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start p-4 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-400/20"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <i className="fas fa-times-circle text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                    <span className="text-white/80 text-sm">{prohibition}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Liability and Contact Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Liability */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-brand-400/20 overflow-hidden"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 25px 50px rgba(14, 165, 233, 0.2)"
              }}
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <motion.i 
                    className="fas fa-balance-scale text-brand-400 text-2xl mr-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div>
                    <h3 className="text-2xl font-black text-white">Ответственность и гарантии</h3>
                    <p className="text-white/70 mt-2">
                      Важная информация об ограничениях ответственности и предоставляемых гарантиях
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {liabilityItems.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 bg-gray-700/50 backdrop-blur-sm border border-white/10 hover:border-brand-400/30 rounded-xl transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <h4 className="font-black text-white mb-2">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-neon-400/20 overflow-hidden"
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
              }}
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center">
                  <motion.i 
                    className="fas fa-envelope text-neon-400 text-2xl mr-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h3 className="text-2xl font-black text-white">Контактная информация</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "fas fa-envelope", text: "legal@Deshevshe.ua", color: 'brand' },
                    { icon: "fas fa-phone", text: "+996 XXX XXX XXX", color: 'electric' },
                    { icon: "fas fa-map-marker-alt", text: "г. Бишкек, Кыргызская Республика", color: 'neon' }
                  ].map((contact, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-3 text-white/70"
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <i className={`${contact.icon} text-${contact.color}-400`}></i>
                      <span className="font-medium">{contact.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/20">
                  <div className="flex items-center mb-4">
                    <motion.i 
                      className="fas fa-edit text-sunset-400 text-xl mr-3"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <h4 className="text-xl font-black text-white">Изменения условий</h4>
                  </div>
                  <div className="space-y-3 text-white/70 text-sm">
                    <p>Администрация имеет право изменять условия использования в любое время.</p>
                    <p>Изменения вступают в силу с момента публикации на сайте.</p>
                    <p>Продолжение использования сервиса означает согласие с новыми условиями.</p>
                    <Badge className="mt-3 bg-sunset-gradient text-white font-bold">
                      Версия 1.0
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}