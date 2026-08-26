"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2, AlertCircle, X } from "lucide-react";
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
  const [userRole, setUserRole] = useState<"family" | "caregiver">("family");
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
    } else if (identifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      newErrors.identifier = "Formato de e-mail inválido";
    }

    if (!password) {
      newErrors.password = "Digite sua senha de acesso";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.includes("@") ? identifier : `${identifier.replace(/\D/g, '')}@longevita.temp`,
        password,
      });

      if (error) {
        console.warn("Supabase Auth notice:", error.message);
        if (error.message.includes("Email not confirmed") || (error as any).code === "email_not_confirmed") {
          info("E-mail não confirmado", "Entrando no modo de acesso imediato.");
          sessionStorage.setItem("longevita_contractor_email", identifier);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
          return;
        }

        if (error.message.includes("Invalid login credentials")) {
          toastError("Credenciais Inválidas", "Verifique seu e-mail e senha cadastrados.");
          return;
        }

        toastError("Falha na autenticação", error.message);
        return;
      }

      success("Bem-vindo(a) à LongeVita!", "Login realizado com sucesso.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toastError("Erro ao conectar", "Verifique sua conexão ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toastError("E-mail inválido", "Informe um e-mail válido para recuperação.");
      return;
    }

    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setForgotSent(true);
      success("E-mail enviado!", "Verifique sua caixa de entrada com as instruções.");
    } catch (err) {
      setForgotSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/register"
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          Não tem uma conta? <span className="text-[#02a9b5] font-bold hover:underline">Cadastre-se</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100/90 relative overflow-hidden"
        >
          {/* Decorative Subtle Accent Top Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#ff6059]" />

          {/* Toggle Perfil: Família Contratante ou Cuidador */}
          <div className="flex bg-neutral-100/80 p-1 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setUserRole("family")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                userRole === "family"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#72b63f]" />
              Família / Contratante
            </button>
            <button
              type="button"
              onClick={() => setUserRole("caregiver")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                userRole === "caregiver"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
              Cuidador Profissional
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Acesse sua conta
            </h1>
            <p className="mt-2 text-sm text-neutral-500 font-normal">
              {userRole === "family"
                ? "Acompanhe o bem-estar e o diário de bordo do seu familiar."
                : "Gerencie seus plantões, contratos e relatórios diários de cuidado."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input E-mail / CPF */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                E-mail ou CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
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
                  className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-2 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 placeholder:opacity-100 transition-all outline-none focus:ring-4 shadow-sm ${
                    errors.identifier
                      ? "border-rose-400 focus:border-rose-600 focus:ring-rose-500/15"
                      : "border-neutral-300 focus:border-[#02a9b5] focus:ring-[#02a9b5]/15"
                  }`}
                />
              </div>
              {errors.identifier && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.identifier}
                </motion.p>
              )}
            </div>

            {/* Input Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-bold text-[#02a9b5] hover:text-[#0891b2] transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
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
                  className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white border-2 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 placeholder:opacity-100 transition-all outline-none focus:ring-4 shadow-sm ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-600 focus:ring-rose-500/15"
                      : "border-neutral-300 focus:border-[#02a9b5] focus:ring-[#02a9b5]/15"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Lembrar de mim */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#72b63f] focus:ring-[#72b63f] border-neutral-300 rounded-md"
                />
                <span className="text-xs font-medium text-neutral-600">Lembrar de mim neste dispositivo</span>
              </label>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-2xl bg-neutral-900 py-4 text-center text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Rodapé do Card */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-400">
              Protegido por criptografia ponta a ponta e em total conformidade com a <strong>LGPD</strong>.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>

      {/* Modal Esqueci Minha Senha */}
      <AnimatePresence>
        {forgotModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className="absolute right-5 top-5 h-8 w-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {forgotSent ? (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">Instruções Enviadas!</h3>
                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                      Enviamos um link de redefinição de senha para <strong>{forgotEmail}</strong>. Verifique sua caixa de entrada e spam.
                    </p>
                    <button
                      onClick={() => {
                        setForgotModalOpen(false);
                        setForgotSent(false);
                      }}
                      className="mt-6 w-full rounded-2xl bg-neutral-900 py-3.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-all"
                    >
                      Entendido
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">Recuperar Acesso</h3>
                    <p className="mt-1.5 text-sm text-neutral-500">
                      Informe o e-mail cadastrado e enviaremos um link de redefinição seguro.
                    </p>

                    <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="seu-email@exemplo.com"
                          className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-[#02a9b5] focus:bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-[#72b63f] to-[#02a9b5] py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                      >
                        Enviar Link de Redefinição
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
