import { useDocumentTitle } from "@/hooks/use-document-title";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  useDocumentTitle("Политика конфиденциальности -  Deshevshe.ua | Защита персональных данных");

  const privacySections = [
    {
      title: "1. Общие положения",
      content: [
        "Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сервиса  Deshevshe.ua.",
        "Администрация сайта обязуется соблюдать конфиденциальность персональных данных пользователей в соответствии с законодательством Кыргызской Республики.",
        "Политика применяется ко всей информации, которую  Deshevshe.ua может получить о пользователе во время использования сайта.",
        "Продолжая использование сайта, вы даете согласие на обработку персональных данных в соответствии с настоящей Политикой."
      ]
    },
    {
      title: "2. Персональные данные пользователей",
      content: [
        "Персональные данные - любая информация, относящаяся к прямо или косвенно определенному физическому лицу.",
        " Deshevshe.ua обрабатывает следующие категории персональных данных: имя пользователя, адрес электронной почты, номер телефона, IP-адрес.",
        "Персональные данные обрабатываются на основании согласия пользователя, полученного при регистрации на сайте.",
        "Пользователь имеет право отозвать согласие на обработку персональных данных в любое время."
      ]
    },
    {
      title: "3. Цели обработки данных",
      content: [
        "Персональные данные обрабатываются в следующих целях:",
        "• Регистрация и авторизация пользователей на сайте",
        "• Обеспечение участия в аукционах и проведение расчетов",
        "• Связь с пользователем для решения технических и спорных вопросов",
        "• Предоставление информации о новых аукционах и акциях",
        "• Обеспечение безопасности и предотвращение мошенничества",
        "• Анализ использования сайта для улучшения качества услуг"
      ]
    },
    {
      title: "4. Способы и сроки обработки",
      content: [
        "Обработка персональных данных осуществляется с использованием средств автоматизации и без таковых.",
        "Персональные данные хранятся на серверах, расположенных на территории стран с адекватным уровнем защиты данных.",
        "Персональные данные обрабатываются в течение срока, необходимого для достижения целей обработки.",
        "После достижения целей обработки или при отзыве согласия данные подлежат уничтожению в течение 30 дней."
      ]
    },
    {
      title: "5. Передача данных третьим лицам",
      content: [
        " Deshevshe.ua не передает персональные данные третьим лицам, за исключением случаев:",
        "• Получения явного согласия пользователя на передачу данных",
        "• Требования правоохранительных органов в рамках процедур, предусмотренных законодательством",
        "• Передачи партнерам для выполнения технических функций (с соблюдением конфиденциальности)",
        "• При реорганизации или продаже бизнеса (с уведомлением пользователей)"
      ]
    },
    {
      title: "6. Защита персональных данных",
      content: [
        " Deshevshe.ua принимает необходимые технические и организационные меры для защиты персональных данных:",
        "• Шифрование данных при передаче и хранении",
        "• Ограничение доступа к персональным данным только уполномоченным сотрудникам",
        "• Регулярное обновление систем безопасности",
        "• Мониторинг несанкционированного доступа к данным",
        "• Обучение персонала правилам обработки персональных данных"
      ]
    },
    {
      title: "7. Использование файлов cookie",
      content: [
        "Наш сайт использует файлы cookie и аналогичные технологии для улучшения пользовательского опыта.",
        "Cookie - это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта.",
        "Мы используем следующие типы cookie:",
        "• Необходимые cookie - обеспечивают базовую функциональность сайта (сессии, авторизация)",
        "• Аналитические cookie - помогают анализировать использование сайта для его улучшения",
        "• Функциональные cookie - запоминают ваши предпочтения и настройки",
        "Вы можете управлять настройками cookie через браузер или используя кнопку 'Настройки cookie' в футере сайта.",
        "Отключение необходимых cookie может ограничить функциональность сайта."
      ]
    }
  ];

  const userRights = [
    {
      title: "Право на доступ",
      description: "Получение информации о том, какие персональные данные обрабатываются"
    },
    {
      title: "Право на исправление",
      description: "Внесение изменений в неточные или неполные персональные данные"
    },
    {
      title: "Право на удаление",
      description: "Требование удаления персональных данных при отсутствии законных оснований для обработки"
    },
    {
      title: "Право на ограничение",
      description: "Ограничение обработки данных в определенных случаях"
    },
    {
      title: "Право на переносимость",
      description: "Получение персональных данных в структурированном, машиночитаемом формате"
    },
    {
      title: "Право на возражение",
      description: "Возражение против обработки персональных данных"
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
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-shield-alt"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: [
                      "drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))",
                      "drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))",
                      "drop-shadow(0 0 10px rgba(14, 165, 233, 0.5))"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
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
                  Политика конфиденциальности
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Мы серьезно относимся к защите ваших персональных данных и соблюдаем все требования законодательства о конфиденциальности.
                </AnimatedText>
                
                <motion.div 
                  className="text-white/60 text-sm bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <StaggeredList 
            className="space-y-8"
            stagger={0.1}
            delay={0.1}
          >
            {privacySections.map((section, index) => (
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
                      className="w-8 h-8 bg-brand-gradient rounded-xl flex items-center justify-center mr-4 shadow-lg"
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

          {/* User Rights Section */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-electric-400/20 overflow-hidden"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
            }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <motion.i 
                  className="fas fa-user-check text-electric-400 text-2xl mr-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div>
                  <h3 className="text-2xl font-black text-white">Права пользователей</h3>
                  <p className="text-white/70 mt-2">
                    В соответствии с законодательством о защите персональных данных вы имеете следующие права
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRights.map((right, index) => (
                  <motion.div 
                    key={index} 
                    className="p-6 bg-gray-700/50 backdrop-blur-sm border border-white/10 hover:border-electric-400/30 rounded-2xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <h4 className="font-black text-white mb-3">{right.title}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{right.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Cookies Section */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-sunset-400/20 overflow-hidden"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(249, 115, 22, 0.2)"
            }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <motion.i 
                  className="fas fa-cookie-bite text-sunset-400 text-2xl mr-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h3 className="text-2xl font-black text-white">Использование cookies и технологий отслеживания</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Необходимые cookies", desc: "Используются для обеспечения базовой функциональности сайта, включая авторизацию и безопасность сессий.", color: 'brand' },
                  { title: "Аналитические cookies", desc: "Помогают нам понимать, как пользователи взаимодействуют с сайтом, для улучшения пользовательского опыта.", color: 'electric' },
                  { title: "Функциональные cookies", desc: "Запоминают ваши предпочтения и настройки для персонализации взаимодействия с сайтом.", color: 'neon' }
                ].map((cookie, index) => (
                  <motion.div 
                    key={index}
                    className={`p-6 bg-gradient-to-br from-${cookie.color}-500/10 to-${cookie.color}-600/5 border border-${cookie.color}-400/20 rounded-2xl backdrop-blur-sm`}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <h4 className={`font-black text-${cookie.color}-400 mb-3`}>{cookie.title}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">{cookie.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-neon-400/20 overflow-hidden"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
            }}
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <motion.i 
                  className="fas fa-envelope text-neon-400 text-2xl mr-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div>
                  <h3 className="text-2xl font-black text-white">Контактная информация</h3>
                  <p className="text-white/70 mt-2">
                    По вопросам обработки персональных данных обращайтесь к нам
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-black text-white">Контакты для запросов</h4>
                  <div className="space-y-3">
                    {[
                      { icon: "fas fa-envelope", text: "privacy@ Deshevshe.ua", color: 'brand' },
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
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white">Время ответа</h4>
                  <div className="space-y-3 text-white/70">
                    <p>Стандартные запросы: в течение 7 рабочих дней</p>
                    <p>Срочные вопросы: в течение 2 рабочих дней</p>
                    <p>Технические проблемы: в течение 24 часов</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}