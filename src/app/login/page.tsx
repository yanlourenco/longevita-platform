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
  Heart,
  Sparkles
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import { useApp, UserProfile } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const { users, currentUser, loginUser, switchUser, setUserRole } = useApp();
  const supabase = createClient();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRoleTab, setSelectedRoleTab] = useState<"family" | "caregiver" | "admin">("family");
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // 1. Tenta autenticar pelo AppContext (contas cadastradas, novos cuidadores e pré-existentes)
      const logged = loginUser(identifier, selectedRoleTab);
      if (logged) {
        setTimeout(() => {
          if (identifier.toLowerCase().includes("admin") || selectedRoleTab === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 400);
        return;
      }

      // 2. Reconhecimento de Admin
      if (
        identifier.toLowerCase().includes("admin") ||
        identifier === "admin@longevita.com.br" ||
        selectedRoleTab === "admin"
      ) {
        loginUser("admin-1", "admin");
        success("Acesso Master Autorizado", "Bem-vindo ao Painel de Governança & Auditoria.");
        router.push("/admin");
        return;
      }

      // 3. Fallback: Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.includes("@") ? identifier : `${identifier.replace(/\D/g, "")}@longevita.temp`,
        password: password || "12345678",
      });

      if (!error && data?.user) {
        const meta = data.user.user_metadata || {};
        const inferredRole: "family" | "caregiver" | "admin" = meta.role === "contractor" ? "family" : (meta.role === "caregiver" ? "caregiver" : (meta.role === "admin" ? "admin" : (selectedRoleTab as "family" | "caregiver" | "admin")));
        loginUser(data.user.email || identifier, inferredRole);
        success("Autenticação Confirmada", `Login realizado com sucesso.`);
        router.push(inferredRole === "admin" ? "/admin" : "/dashboard");
        return;
      }

      // Se falhar no Supabase, usa login garantido pelo papel selecionado
      const matchingRoleUser = users.find((u) => u.role === selectedRoleTab);
      if (matchingRoleUser) {
        switchUser(matchingRoleUser.id);
        success("Acesso Concedido", `Entrando como ${matchingRoleUser.name}.`);
        router.push((matchingRoleUser.role as string) === "admin" ? "/admin" : "/dashboard");
        return;
      }

      loginUser(identifier, selectedRoleTab);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toastError("Erro de Conexão", "Verifique seus dados ou utilize o Acesso Rápido.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: UserProfile) => {
    switchUser(user.id);
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
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
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 flex flex-col items-center justify-center">
        {/* Banner de Seletor Rápido de Contas (1 Clique) */}
        <div className="w-full mb-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2 border border-[#72b63f]/25">
              <Sparkles className="w-3.5 h-3.5" />
              Acesso Rápido com Contas Cadastradas (1 Clique)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Escolha seu perfil para entrar e testar os vínculos
            </h2>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Cada perfil acessa exclusivamente os seus próprios contratos, assistidos e propostas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              const isFamily = u.role === "family";
              const isCaregiver = u.role === "caregiver";

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 group relative interactive-card ${
                    isCurrent
                      ? "bg-white border-[#02a9b5] shadow-md ring-2 ring-[#02a9b5]/20"
                      : "bg-white border-neutral-200 hover:border-neutral-300 shadow-sm"
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm ${
                        isFamily
                          ? "bg-[#72b63f]"
                          : isCaregiver
                          ? "bg-[#02a9b5]"
                          : "bg-neutral-900"
                      }`}
                    >
                      {isFamily ? "F" : isCaregiver ? "C" : "A"}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#028490] transition-colors">
                        {u.name}
                      </h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isFamily
                            ? "bg-[#72b63f]/10 text-[#558a2e]"
                            : isCaregiver
                            ? "bg-[#02a9b5]/10 text-[#028490]"
                            : "bg-neutral-900 text-white"
                        }`}
                      >
                        {isFamily ? "Família" : isCaregiver ? "Cuidador" : "ADM"}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 font-medium line-clamp-2 leading-tight">
                      {u.subtitle || u.email}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[#028490] group-hover:translate-x-0.5 transition-transform">
                      <span>Acessar perfil</span>
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Formulário de Login Tradicional */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-9 shadow-sm border border-neutral-200/80 relative overflow-hidden"
        >
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5]" />

          {/* Toggle Perfil */}
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-6 border border-neutral-200">
            <button
              type="button"
              onClick={() => setSelectedRoleTab("family")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRoleTab === "family"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Heart className="w-3 h-3 text-[#72b63f]" />
              Família
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleTab("caregiver")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRoleTab === "caregiver"
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
                setSelectedRoleTab("admin");
                setIdentifier("admin@longevita.com.br");
                setPassword("admin123");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRoleTab === "admin"
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
              Acesso por E-mail / CPF
            </h1>
            <p className="mt-1 text-xs text-neutral-600 font-medium">
              {selectedRoleTab === "family"
                ? "Entre para acompanhar seus assistidos e cuidadores vinculados."
                : selectedRoleTab === "caregiver"
                ? "Entre para gerenciar seus plantões e oportunidades abertas."
                : "Acesso de governança executiva e auditoria."}
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
