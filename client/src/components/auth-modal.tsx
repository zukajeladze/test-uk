import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useSettings } from "@/hooks/use-settings";
import { trackRegistration } from "@/lib/analytics";

// Schema factories to use with translations
const createLoginSchema = (t: any) => z.object({
  username: z.string().min(1, t("enterLogin")),
  password: z.string().min(1, t("enterPassword")),
});

const createRegisterSchema = (t: any) => z.object({
  username: z.string().min(3, t("loginMinLength")),
  email: z.string().email(t("invalidEmailFormat")),
  password: z.string().min(6, t("passwordMinLength")),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("passwordsDoNotMatch"),
  path: ["confirmPassword"],
});

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [validationState, setValidationState] = useState({
    username: { valid: null, message: "" },
    email: { valid: null, message: "" }
  });
  const [validatingField, setValidatingField] = useState<string | null>(null);
  const { toast } = useToast();
  const { login, register, loginPending, registerPending } = useAuth();
  const { t } = useLanguage();
  const { siteName } = useSettings();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Live validation functions
  const validateField = async (field: 'username' | 'email', value: string) => {
    if (!value || value.length < 3) {
      setValidationState(prev => ({
        ...prev,
        [field]: { valid: null, message: "" }
      }));
      return;
    }
    
    setValidatingField(field);
    try {
      const response = await fetch(`/api/auth/validate-${field}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      
      const data = await response.json();
      
      setValidationState(prev => ({
        ...prev,
        [field]: { valid: data.valid, message: data.message }
      }));
    } catch (error) {
      setValidationState(prev => ({
        ...prev,
        [field]: { valid: false, message: "Ошибка проверки" }
      }));
    } finally {
      setValidatingField(null);
    }
  };

  // Debounced validation
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const debouncedValidateUsername = debounce((value: string) => validateField('username', value), 500);
  const debouncedValidateEmail = debounce((value: string) => validateField('email', value), 500);

  const handleLogin = async (data: LoginData) => {
    try {
      await login(data);
      toast({
        title: t("welcome"),
        description: t("loginSuccess"),
      });
      onLoginSuccess();
      onClose();
      loginForm.reset();
    } catch (error: any) {
      toast({
        title: t("loginError"),
        description: error.message || t("invalidCredentials"),
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      
      // Track successful registration
      trackRegistration();
      
      toast({
        title: t("registrationSuccess"),
        description: t("registrationSuccessDesc"),
      });
      onLoginSuccess();
      onClose();
      registerForm.reset();
      // Welcome modal will automatically show from useAuth hook
    } catch (error: any) {
      toast({
        title: t("registrationError"),
        description: error.message || t("registrationFailed"),
        variant: "destructive",
      });
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none md:w-[95vw] md:max-w-lg md:mx-auto md:h-auto md:max-h-[90vh] md:rounded-3xl md:p-0 bg-gray-900/95 backdrop-blur-xl border border-neon-400/20 shadow-2xl overflow-y-auto">
        <div className="flex flex-col h-full relative">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 rounded-3xl"></div>
          <motion.div 
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Header Section */}
          <div className="relative z-10 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border-b border-neon-400/20 px-6 py-8 md:px-8 md:py-6">
            <DialogHeader className="space-y-4 text-center">
              <motion.div 
                className="flex items-center justify-center space-x-4"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                <motion.div 
                  className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-xl"
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
                    className="fas fa-gavel text-white text-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
                <DialogTitle className="text-3xl md:text-2xl font-black bg-gradient-to-r from-white to-neon-300 bg-clip-text text-transparent">
                  {siteName}
                </DialogTitle>
              </motion.div>
              <p className="text-white/70 leading-relaxed max-w-sm mx-auto">
                {t("joinExcitingWorld")}
              </p>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="relative z-10 flex-1 px-6 py-6 md:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/60 backdrop-blur-sm border border-white/10 p-1 rounded-2xl h-12 mb-8">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 font-bold rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-sign-in-alt mr-2 text-sm"></i>
                  {t("login")}
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 font-bold rounded-xl transition-all duration-300"
                >
                  <i className="fas fa-user-plus mr-2 text-sm"></i>
                  {t("register")}
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-black text-white">{t("welcome")}</h3>
                  <p className="text-white/70">{t("loginToYourAccount")}</p>
                </div>

                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="login-username" className="text-sm font-bold text-white/80 flex items-center">
                      <i className="fas fa-user mr-2 text-electric-400 text-xs"></i>
                      {t("username")}
                    </Label>
                    <Input
                      id="login-username"
                      placeholder={t("enterLogin")}
                      className="h-12 bg-gray-800/60 backdrop-blur-sm border border-white/20 focus:border-neon-400/50 focus:ring-neon-400/20 rounded-xl text-white placeholder:text-white/40"
                      {...loginForm.register("username")}
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-sm text-red-400 flex items-center">
                        <i className="fas fa-exclamation-circle mr-2 text-xs"></i>
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-sm font-bold text-white/80 flex items-center">
                      <i className="fas fa-lock mr-2 text-electric-400 text-xs"></i>
                      {t("password")}
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={t("enterPassword")}
                      className="h-12 bg-gray-800/60 backdrop-blur-sm border border-white/20 focus:border-neon-400/50 focus:ring-neon-400/20 rounded-xl text-white placeholder:text-white/40"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-400 flex items-center">
                        <i className="fas fa-exclamation-circle mr-2 text-xs"></i>
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-brand-gradient hover:shadow-xl text-white font-bold rounded-xl border border-white/20 backdrop-blur-sm relative overflow-hidden group"
                      disabled={loginPending}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        {loginPending ? (
                          <>
                            <motion.i 
                              className="fas fa-spinner text-sm"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>{t("loggingIn")}</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-in-alt text-sm"></i>
                            <span>{t("loginToAccount")}</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-black text-white">{t("createAccount")}</h3>
                  <p className="text-white/70">{t("registerAndGetBids")}</p>
                </div>

                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-sm font-bold text-white/80 flex items-center">
                      <i className="fas fa-user mr-2 text-electric-400 text-xs"></i>
                      {t("username")} *
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-username"
                        placeholder={t("chooseUniqueUsername")}
                        className={`h-12 bg-gray-800/60 backdrop-blur-sm border border-white/20 focus:border-neon-400/50 focus:ring-neon-400/20 rounded-xl text-white placeholder:text-white/40 pr-12 ${
                          validationState.username?.valid === true ? 'border-green-400' :
                          validationState.username?.valid === false ? 'border-red-400' : ''
                        }`}
                        {...registerForm.register("username", {
                          onChange: (e) => {
                            setValidationState(prev => ({
                              ...prev,
                              username: { valid: null, message: "" }
                            }));
                            debouncedValidateUsername(e.target.value);
                          }
                        })}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validatingField === 'username' && (
                          <i className="fas fa-spinner fa-spin text-slate-400 text-sm"></i>
                        )}
                        {validatingField !== 'username' && validationState.username?.valid === true && (
                          <i className="fas fa-check-circle text-green-500 text-sm"></i>
                        )}
                        {validatingField !== 'username' && validationState.username?.valid === false && (
                          <i className="fas fa-times-circle text-red-500 text-sm"></i>
                        )}
                      </div>
                    </div>
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500 flex items-center">
                        <i className="fas fa-exclamation-circle mr-1 text-xs"></i>
                        {registerForm.formState.errors.username.message}
                      </p>
                    )}
                    {validationState.username?.message && !registerForm.formState.errors.username && (
                      <p className={`text-sm flex items-center ${validationState.username.valid ? 'text-green-600' : 'text-red-500'}`}>
                        <i className={`fas ${validationState.username.valid ? 'fa-check' : 'fa-times'} mr-1 text-xs`}></i>
                        {validationState.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center">
                      <i className="fas fa-envelope mr-2 text-slate-400 text-xs"></i>
                      Email *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className={`h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg bg-white pr-10 ${
                          validationState.email?.valid === true ? 'border-green-500' :
                          validationState.email?.valid === false ? 'border-red-500' : ''
                        }`}
                        {...registerForm.register("email", {
                          onChange: (e) => {
                            setValidationState(prev => ({
                              ...prev,
                              email: { valid: null, message: "" }
                            }));
                            debouncedValidateEmail(e.target.value);
                          }
                        })}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validatingField === 'email' && (
                          <i className="fas fa-spinner fa-spin text-slate-400 text-sm"></i>
                        )}
                        {validatingField !== 'email' && validationState.email?.valid === true && (
                          <i className="fas fa-check-circle text-green-500 text-sm"></i>
                        )}
                        {validatingField !== 'email' && validationState.email?.valid === false && (
                          <i className="fas fa-times-circle text-red-500 text-sm"></i>
                        )}
                      </div>
                    </div>
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                    {validationState.email?.message && !registerForm.formState.errors.email && (
                      <p className={`text-sm flex items-center ${validationState.email.valid ? 'text-green-600' : 'text-red-500'}`}>
                        <i className={`fas ${validationState.email.valid ? 'fa-check' : 'fa-times'} mr-1 text-xs`}></i>
                        {validationState.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-slate-700 flex items-center">
                      <i className="fas fa-lock mr-2 text-slate-400 text-xs"></i>
                      {t("password")} *
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={t("passwordMinLength")}
                      className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg bg-white"
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500 flex items-center">
                        <i className="fas fa-exclamation-circle mr-1 text-xs"></i>
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 flex items-center">
                      <i className="fas fa-lock mr-2 text-slate-400 text-xs"></i>
                      {t("confirmPassword")} *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t("repeatPassword")}
                      className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg bg-white"
                      {...registerForm.register("confirmPassword")}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center">
                        <i className="fas fa-exclamation-circle mr-1 text-xs"></i>
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-electric-gradient hover:shadow-xl text-white font-bold rounded-xl border border-white/20 backdrop-blur-sm relative overflow-hidden group mt-6"
                      disabled={registerPending}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        {registerPending ? (
                          <>
                            <motion.i 
                              className="fas fa-spinner text-sm"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <span>{t("registering")}</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus text-sm"></i>
                            <span>{t("createAccount")}</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>

                <motion.div 
                  className="mt-6 p-4 bg-gradient-to-r from-brand-500/10 to-electric-500/10 backdrop-blur-sm rounded-2xl border border-brand-400/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center space-x-2 text-sm text-brand-400">
                    <motion.i 
                      className="fas fa-info-circle"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="font-medium">{t("registerAndGetBidsInfo")}</span>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Footer with Terms */}
            <div className="mt-8 pt-6 border-t border-neon-400/20 text-center">
              <p className="text-xs text-white/60 mb-3">{t("byRegisteringYouAgree")}</p>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <Link href="/terms-of-service" onClick={onClose} className="text-neon-400 hover:text-neon-300 hover:underline font-medium">
                  {t("termsOfService")}
                </Link>
                <span className="text-white/40">{t("and")}</span>
                <Link href="/privacy-policy" onClick={onClose} className="text-neon-400 hover:text-neon-300 hover:underline font-medium">
                  {t("privacyPolicy")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}