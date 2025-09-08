import { useDocumentTitle } from "@/hooks/use-document-title";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import { AnimatedText, AnimatedHeading, StaggeredList } from "@/components/ui/animated-text";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Support() {
  useDocumentTitle("Служба поддержки - Deshevshe.ua | Помощь и поддержка пользователей");

  const supportMethods = [
    {
      icon: "fas fa-envelope",
      title: "Электронная почта",
      description: "Напишите нам на email для получения подробной помощи",
      contact: "support@Deshevshe.ua",
      responseTime: "В течение 24 часов",
      color: "blue"
    },
    {
      icon: "fab fa-whatsapp",
      title: "WhatsApp",
      description: "Быстрая помощь через мессенджер WhatsApp",
      contact: "+996 XXX XXX XXX",
      responseTime: "В рабочее время",
      color: "green"
    },
    {
      icon: "fab fa-telegram",
      title: "Telegram",
      description: "Свяжитесь с нами через Telegram для оперативной поддержки",
      contact: "@deshevshe_support",
      responseTime: "В рабочее время",
      color: "blue"
    }
  ];

  const faqItems = [
    {
      question: "Как начать участвовать в аукционах?",
      answer: "Зарегистрируйтесь на сайте, пополните баланс бидов и выберите интересующий вас аукцион. Каждая ставка стоит один бид."
    },
    {
      question: "Что такое пенни-аукцион?",
      answer: "Пенни-аукцион - это тип аукциона, где цена товара увеличивается на небольшую сумму с каждой ставкой, а время аукциона продлевается."
    },
    {
      question: "Как пополнить баланс бидов?",
      answer: "Перейдите в свой профиль и выберите 'Пополнить баланс'. Доступны различные способы оплаты: банковские карты, электронные кошельки."
    },
    {
      question: "Что происходит, если я выиграл аукцион?",
      answer: "Поздравляем! После победы с вами свяжется наша служба поддержки для организации доставки товара или его получения."
    },
    {
      question: "Можно ли вернуть потраченные биды?",
      answer: "Биды, потраченные в ходе аукциона, не возвращаются. Это стандартное правило пенни-аукционов."
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
            className="absolute top-1/4 left-1/6 w-64 h-64 bg-neon-500/10 rounded-full blur-3xl"
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
                className="text-8xl lg:text-9xl font-black bg-gradient-to-b from-neon-400 to-neon-600 bg-clip-text text-transparent leading-none"
                animate={{ 
                  backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.i 
                  className="fas fa-headset"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
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
                  level={1}
                  className="text-4xl lg:text-6xl font-black text-white leading-tight"
                  animation="whipInUp"
                  delay={0.1}
                >
                  Служба поддержки
                </AnimatedHeading>
                
                <AnimatedText 
                  className="text-xl text-white/80 leading-relaxed max-w-3xl"
                  animation="calmInUp"
                  delay={0.2}
                >
                  Мы готовы помочь вам в любое время. Выберите удобный способ связи или найдите ответы на часто задаваемые вопросы.
                </AnimatedText>
              </div>
            </div>
          </motion.div>

          {/* Contact Methods */}
          <StaggeredList 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            stagger={0.15}
            delay={0.1}
          >
            {supportMethods.map((method, index) => (
              <motion.div 
                key={index} 
                className="text-center bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-neon-400/30 transition-all duration-300 overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)"
                }}
              >
                <div className="p-8">
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-br from-${method.color === 'blue' ? 'brand' : method.color === 'green' ? 'electric' : 'neon'}-500 to-${method.color === 'blue' ? 'brand' : method.color === 'green' ? 'electric' : 'neon'}-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                    animate={{ 
                      boxShadow: [
                        `0 0 20px rgba(14, 165, 233, 0.3)`,
                        `0 0 30px rgba(14, 165, 233, 0.5)`,
                        `0 0 20px rgba(14, 165, 233, 0.3)`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <i className={`${method.icon} text-white text-2xl`}></i>
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-4">{method.title}</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">{method.description}</p>
                  <div className="space-y-3">
                    <p className="font-black text-white text-lg">{method.contact}</p>
                    <p className="text-white/60 text-sm font-medium">{method.responseTime}</p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className={`w-full mt-4 bg-${method.color === 'blue' ? 'brand' : method.color === 'green' ? 'electric' : 'neon'}-gradient text-white font-bold h-12 rounded-xl border border-white/20`}>
                        Связаться
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggeredList>

          {/* FAQ Section */}
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
                  className="fas fa-question-circle text-brand-400 text-2xl mr-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div>
                  <h3 className="text-2xl font-black text-white">Часто задаваемые вопросы</h3>
                  <p className="text-white/70 mt-2">
                    Ответы на самые популярные вопросы о работе Deshevshe.ua
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-brand-400/30 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <h4 className="text-lg font-black text-white mb-3">
                      {item.question}
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {item.answer}
                    </p>
                    {index < faqItems.length - 1 && <div className="mt-6 h-px bg-white/20" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Working Hours */}
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-electric-400/20 overflow-hidden"
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 25px 50px rgba(34, 211, 238, 0.2)"
            }}
          >
            <div className="p-8">
              <div className="flex items-center mb-8">
                <motion.i 
                  className="fas fa-clock text-electric-400 text-2xl mr-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <h3 className="text-2xl font-black text-white">Режим работы поддержки</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-black text-white text-lg">Онлайн поддержка</h4>
                  <div className="space-y-3 text-white/70">
                    <div className="flex justify-between p-3 bg-gray-700/50 rounded-xl">
                      <span>Понедельник - Пятница:</span>
                      <span className="font-bold text-white">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-700/50 rounded-xl">
                      <span>Суббота:</span>
                      <span className="font-bold text-white">10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-700/50 rounded-xl">
                      <span>Воскресенье:</span>
                      <span className="font-bold text-white">Выходной</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-white text-lg">Email поддержка</h4>
                  <div className="space-y-3 text-white/70">
                    <p className="p-3 bg-gray-700/50 rounded-xl">Работает круглосуточно</p>
                    <p className="p-3 bg-gray-700/50 rounded-xl">Ответ в течение 24 часов</p>
                    <p className="p-3 bg-gray-700/50 rounded-xl">Все дни недели</p>
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