import { useDocumentTitle } from "@/hooks/use-document-title";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  useDocumentTitle("Політика конфіденційності - Deshevshe.ua");

  const privacySections = [
    {
      title: "1. Загальні положення",
      content: [
        "Ця Політика конфіденційності (далі — Політика) регулює порядок збору, зберігання, обробки, використання та захисту персональних даних користувачів вебсайту Deshevshe.ua (далі — Сайт), який належить та адмініструється ФОП Deshevshe.ua (далі — Оператор).",
        "Оператор обробляє персональні дані відповідно до Закону України «Про захист персональних даних» №2297-VI від 01.06.2010 р. та інших чинних нормативно-правових актів.",
        "Приймаючи умови цієї Політики, Користувач надає свою добровільну згоду на обробку своїх персональних даних, а також на отримання електронних повідомлень (включно з розсилкою та рекламою).",
        "У разі незгоди з умовами Політики Користувач повинен припинити використання Сайту."
      ]
    },
    {
      title: "2. Персональні дані, що збираються",
      content: [
        "Оператор може збирати наступні дані:",
        "• ім'я та прізвище (при реєстрації)",
        "• електронну адресу",
        "• номер телефону",
        "• IP-адресу, cookies, тип пристрою, інформацію про браузер",
        "• поведінку на сайті (участь в аукціонах, історія ставок)",
        "• адресу доставки (у разі виграшу)",
        "• інші дані, надані добровільно"
      ]
    },
    {
      title: "3. Цілі обробки даних",
      content: [
        "Збір і обробка персональних даних здійснюються з метою:",
        "• реєстрації та ідентифікації користувача",
        "• участі в аукціонах і функціонування сайту",
        "• зворотного зв'язку, технічної підтримки",
        "• виконання зобов'язань щодо доставки товарів",
        "• ведення статистики та аналітики",
        "• розсилки повідомлень, новин, рекламних пропозицій",
        "• персоналізації контенту та реклами",
        "• дотримання вимог законодавства України"
      ]
    },
    {
      title: "4. Рекламна розсилка та повідомлення",
      content: [
        "Оператор має право надсилати Користувачу:",
        "• повідомлення про активність в аукціонах",
        "• інформаційні повідомлення",
        "• маркетингові та рекламні матеріали (новини, акції, спеціальні пропозиції)",
        "Користувач може в будь-який час відмовитися від отримання рекламних листів, перейшовши за посиланням «відписатися» в електронному листі або звернувшись за email до служби підтримки."
      ]
    },
    {
      title: "5. Cookies та аналітика",
      content: [
        "Сайт використовує cookies і сторонні аналітичні інструменти, зокрема (але не обмежуючись):",
        "• Google Analytics",
        "• Facebook Pixel",
        "• інші рекламні та статистичні трекери",
        "Ці інструменти дозволяють:",
        "• аналізувати дії користувачів на сайті",
        "• підвищувати зручність використання",
        "• надавати персоналізовані пропозиції",
        "Користувач може вимкнути cookies у налаштуваннях браузера, проте це може вплинути на функціональність Сайту."
      ]
    },
    {
      title: "6. Передача даних третім особам",
      content: [
        "Оператор може передавати дані третім особам у таких випадках:",
        "• державним органам — у випадках, передбачених законом",
        "• партнерським службам (доставка, розсилка, платежі) — лише в необхідному обсязі",
        "• за згодою Користувача",
        "• при продажу або реорганізації бізнесу — за умови збереження конфіденційності",
        "Всі треті особи зобов'язані дотримуватись конфіденційності та захищати персональні дані відповідно до чинного законодавства України."
      ]
    },
    {
      title: "7. Зберігання та захист даних",
      content: [
        "Персональні дані зберігаються до досягнення цілей їх обробки або до моменту відкликання згоди Користувачем.",
        "Оператор вживає всіх необхідних заходів для запобігання несанкціонованому доступу, втрати, зміни або розповсюдження персональних даних."
      ]
    },
    {
      title: "8. Права Користувача",
      content: [
        "Користувач має право:",
        "• знати місцезнаходження та склад своїх персональних даних",
        "• отримувати інформацію про цілі та способи їх обробки",
        "• вимагати змінення, блокування або видалення своїх даних",
        "• відкликати згоду на обробку даних у будь-який момент",
        "• подати скаргу до Уповноваженого Верховної Ради України з прав людини"
      ]
    },
    {
      title: "9. Зміни до Політики",
      content: [
        "Оператор має право змінювати цю Політику в будь-який час без попереднього повідомлення.",
        "Нова редакція Політики набирає чинності з моменту її публікації на Сайті. Подальше використання Сайту означає згоду з оновленою редакцією."
      ]
    },
    {
      title: "10. Контактна інформація",
      content: [
        "Оператор персональних даних:",
        "Фізична особа – підприємець Deshevshe.ua",
        "Email: support@deshevshe.ua",
        "Сайт: https://deshevshe.ua",
        `Дата останнього оновлення: ${new Date().toLocaleDateString('uk-UA')}`
      ]
    }
  ];

  const userRights = [
    {
      title: "Право на повну та достовірну інформацію",
      description: "Ви маєте право отримувати повну й зрозумілу інформацію про товари, послуги та умови аукціону, розміщену на сайті."
    },
    {
      title: "Право на якість і безпеку товарів",
      description: "Усі товари й послуги, що пропонуються на сайті, мають відповідати встановленим стандартам якості та безпеки."
    },
    {
      title: "Право на вільну участь в аукціонах",
      description: "Ви можете брати участь в аукціонах на рівних умовах та відповідно до правил, опублікованих на сайті."
    },
    {
      title: "Право на захист персональних даних",
      description: "Ваші персональні дані захищені відповідно до Закону України «Про захист персональних даних» та Політики конфіденційності сайту."
    },
    {
      title: "Право на повернення та обмін",
      description: "У разі отримання товару неналежної якості або невідповідності опису, ви можете скористатися правом на повернення або обмін у строки, передбачені законодавством."
    },
    {
      title: "Право на звернення зі скаргами",
      description: "Ви можете звернутися до служби підтримки сайту або до органів захисту прав споживачів (наприклад, до Держпродспоживслужби) у разі порушення ваших прав."
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
                  Політика конфіденційності
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Ця Політика конфіденційності регулює порядок збору, зберігання, обробки, використання та захисту персональних даних користувачів вебсайту Deshevshe.ua. Використання Сайту означає згоду Користувача з цією Політикою.
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
                  <h3 className="text-2xl font-black text-white">Як захистити свої права?</h3>
                  <p className="text-white/70 mt-2">
                    Ми підготували для вас інструкцію щодо захисту ваших прав
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-black text-white">Основні кроки</h4>
                  <div className="space-y-3">
                    {[
                      { icon: "fas fa-book", text: "Ознайомтеся з умовами аукціону та правилами сайту", color: 'brand' },
                      { icon: "fas fa-file-alt", text: "Зберігайте всі документи та листування, пов'язані з покупкою", color: 'electric' },
                      { icon: "fas fa-envelope", text: "У разі виникнення запитань звертайтесь до служби підтримки: support@deshevshe.ua", color: 'neon' }
                    ].map((step, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center space-x-3 text-white/70"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <i className={`${step.icon} text-${step.color}-400`}></i>
                        <span className="font-medium">{step.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white">Додаткова інформація</h4>
                  <div className="space-y-3 text-white/70">
                    <p>За потреби звертайтеся до органів захисту прав споживачів</p>
                    <p>Гаряча лінія: 0-800-XXX-XXX</p>
                    <p>Email: support@deshevshe.ua</p>
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