"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  Building2,
  Heart
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const supabase = createClient();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [userRole, setUserRole] = useState<"family" | "caregiver" | "admin">("family");
  const [isLoading, setIsLoading] = useState(false);

  // Modal Esqueci Minha Senha
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Erros de validação
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Informe seu e-mail ou CPF";
    }
    if (!password) {
      newErrors.password = "Informe sua senha de acesso";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Reconhecimento de Admin para Demonstração
      if (
        identifier.toLowerCase().includes("admin") ||
        identifier === "admin@longevita.com.br" ||
        userRole === "admin"
      ) {
        success("Acesso Master Autorizado", "Bem-vindo ao Painel de Gestão & Demonstração.");
        router.push("/admin");
        return;
      }

      // Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.includes("@") ? identifier : `${identifier.replace(/\D/g, '')}@longevita.temp`,
        password,
      });

      if (error) {
        console.warn("Supabase Auth notice:", error.message);
        if (error.message.includes("Email not confirmed") || (error as any).code === "email_not_confirmed") {
          info("Acesso Imediato", "Entrando no ambiente operacional.");
          sessionStorage.setItem("longevita_contractor_email", identifier);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
          return;
        }

        if (error.message.includes("Invalid login credentials")) {
          toastError("Credenciais Inválidas", "Verifique o e-mail e a senha cadastrados.");
          return;
        }

        toastError("Falha na Autenticação", error.message);
        return;
      }

      success("Autenticação Confirmada", "Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toastError("Erro de Conexão", "Verifique sua conexão ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminQuickAccess = () => {
    setIdentifier("admin@longevita.com.br");
    setPassword("admin123");
    setUserRole("admin");
    success("Acesso Master Carregado", "Redirecionando para o Painel de Governança Executiva.");
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toastError("E-mail Inválido", "Informe um endereço de e-mail válido.");
      return;
    }

    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setForgotSent(true);
      success("Instruções Enviadas", "Verifique sua caixa de entrada.");
    } catch (err) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Top Navbar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
        <Logo size="md" />
        <Link
          href="/"
          className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          Não tem uma conta? <span className="text-[#028490] hover:underline">Cadastre-se</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-neutral-200/80 relative overflow-hidden"
        >
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5]" />

          {/* Banner de Acesso Administrativo */}
          <div className="mb-6 p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#72b63f] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Acesso Administrativo (ADM)
              </span>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-md font-bold">1 Clique</span>
            </div>
            <p className="text-xs text-neutral-300 mb-3">
              Ambiente de gestão geral, homologação de profissionais e auditoria.
            </p>
            <button
              type="button"
              onClick={handleAdminQuickAccess}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#72b63f] to-[#02a9b5] text-xs font-bold text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
            >
              Entrar como ADM
            </button>
          </div>

          {/* Toggle Perfil: Família Contratante, Cuidador ou Admin */}
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200">
            <button
              type="button"
              onClick={() => setUserRole("family")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                userRole === "family"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Heart className="w-3 h-3 text-[#72b63f]" />
              Família
            </button>
            <button
              type="button"
              onClick={() => setUserRole("caregiver")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                userRole === "caregiver"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Stethoscope className="w-3 h-3 text-[#02a9b5]" />
              Cuidador
            </button>
            <button
              type="button"
              onClick={() => {
                setUserRole("admin");
                setIdentifier("admin@longevita.com.br");
                setPassword("admin123");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                userRole === "admin"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-[#02a9b5]" />
              Admin
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
              Acesse sua conta
            </h1>
            <p className="mt-1 text-xs text-neutral-600 font-medium">
              {userRole === "family"
                ? "Acompanhe o estado de saúde e o diário de bordo do seu familiar."
                : userRole === "caregiver"
                ? "Gerencie seus plantões, contratos e relatórios diários de cuidado."
                : "Acesso de governança e auditoria da plataforma."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input E-mail / CPF */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                E-mail ou CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                  }}
                  placeholder="exemplo@email.com ou 000.000.000-00"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-neutral-900 font-medium placeholder:text-neutral-500 transition-all outline-none focus:ring-2 ${
                    errors.identifier
                      ? "border-rose-400 focus:border-rose-600 focus:ring-rose-500/15"
                      : "border-neutral-300 focus:border-[#02a9b5] focus:ring-[#02a9b5]/15"
                  }`}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Input Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-bold text-[#028490] hover:underline transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white border text-sm text-neutral-900 font-medium placeholder:text-neutral-500 transition-all outline-none focus:ring-2 ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-600 focus:ring-rose-500/15"
                      : "border-neutral-300 focus:border-[#02a9b5] focus:ring-[#02a9b5]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 py-3.5 text-center text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#72b63f]" />
                    Entrar na Plataforma
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Modal Esqueci a Senha */}
      <AnimatePresence>
        {forgotModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-neutral-200 relative"
              >
                <button
                  onClick={() => setForgotModalOpen(false)}
                  className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Recuperar Senha</h3>
                <p className="text-xs text-neutral-600 mb-4">
                  Informe o e-mail cadastrado para receber as instruções de redefinição.
                </p>
                {forgotSent ? (
                  <div className="py-4 text-center">
                    <CheckCircle2 className="w-10 h-10 text-[#72b63f] mx-auto mb-2" />
                    <p className="text-xs text-neutral-700 font-medium">
                      E-mail enviado! Verifique sua caixa de entrada.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-[#02a9b5]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#02a9b5] text-white text-xs font-bold hover:bg-[#028490] transition-colors"
                    >
                      Enviar Link de Redefinição
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <footer className="py-6 text-center text-xs text-neutral-500 font-medium">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>
    </div>
  );
}
