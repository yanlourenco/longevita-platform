"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Heart,
  Sparkles,
  User,
  Phone,
  ArrowRight,
  Presentation
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { useApp, UserProfile } from "@/context/AppContext";

export default function HomePage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { users, loginUser, switchUser, registerFamilyUser } = useApp();

  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [selectedRole, setSelectedRole] = useState<"family" | "caregiver" | "admin">("family");
  const [isLoading, setIsLoading] = useState(false);

  // Form states - Login
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form states - Cadastro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrors({ identifier: "Informe seu e-mail ou CPF" });
      return;
    }

    setIsLoading(true);
    try {
      const logged = loginUser(identifier, selectedRole);
      if (logged) {
        setTimeout(() => {
          if (identifier.toLowerCase().includes("admin") || selectedRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 400);
        return;
      }

      if (selectedRole === "admin" || identifier.toLowerCase().includes("admin")) {
        loginUser("admin-1", "admin");
        success("Acesso Master Autorizado", "Bem-vindo ao Painel ADM.");
        router.push("/admin");
        return;
      }

      const matchingRoleUser = users.find((u) => u.role === selectedRole);
      if (matchingRoleUser) {
        switchUser(matchingRoleUser.id);
        success("Acesso Concedido", `Entrando como ${matchingRoleUser.name}.`);
        router.push(matchingRoleUser.role === "admin" ? "/admin" : "/dashboard");
        return;
      }

      loginUser(identifier, selectedRole);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toastError("Erro ao entrar", "Tente novamente ou selecione um perfil de teste.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrors({ form: "Preencha todos os campos obrigatórios." });
      return;
    }

    setIsLoading(true);
    try {
      registerFamilyUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
      });

      success("Cadastro Realizado!", "Conta criada com sucesso. Acessando painel...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      toastError("Erro ao cadastrar", "Verifique seus dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (u: UserProfile) => {
    switchUser(u.id);
    if (u.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row selection:bg-[#72b63f] selection:text-white font-sans overflow-x-hidden">
      {/* ========================================================================= */}
      {/* METADE ESQUERDA (50%): IMAGEM REFERENTE À LONGEVITA COM OVERLAY BRAND    */}
      {/* ========================================================================= */}
      <div className="w-full md:w-1/2 min-h-[380px] md:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/longevita_hero.png"
            alt="LongeVita Cuidado de Idosos"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-90 hover:scale-100 transition-transform duration-700"
          />
          {/* Gradient Overlay in LongeVita Brand Tones */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/80 to-[#02a9b5]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/90 via-[#070b12]/60 to-transparent" />
        </div>

        {/* Top Header on Image */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo size="md" clickable={false} />
          <Link
            href="/swot"
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Presentation className="w-4 h-4 text-[#72b63f]" />
            <span>Ver Slides SWOT</span>
          </Link>
        </div>

        {/* Center Content on Image */}
        <div className="relative z-10 max-w-lg my-auto py-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#72b63f]/20 border border-[#72b63f]/40 text-[#72b63f] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Cuidado que conecta
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Tecnologia e carinho para a saúde de quem você mais ama.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Conectamos famílias a cuidadores qualificados com acompanhamento em tempo real, diário de bordo e botão de emergência SOS.
          </p>
        </div>

        {/* Bottom Footer on Image */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} LongeVita • Plataforma de Gestão de Cuidados.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* METADE DIREITA (50%): ÁREA DE LOGIN OU CADASTRO                           */}
      {/* ========================================================================= */}
      <div className="w-full md:w-1/2 min-h-screen bg-slate-950 flex flex-col justify-center p-6 sm:p-12 lg:p-16 z-10">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Seletor de Modo: Login vs Cadastro */}
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setMode("login");
                setErrors({});
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === "login"
                  ? "bg-[#02a9b5] text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Entrar na Conta</span>
            </button>

            <button
              onClick={() => {
                setMode("cadastro");
                setErrors({});
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === "cadastro"
                  ? "bg-[#72b63f] text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Criar Nova Conta</span>
            </button>
          </div>

          {/* Seletor de Perfil (Família / Cuidador / ADM) */}
          <div className="flex gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => setSelectedRole("family")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === "family"
                  ? "bg-slate-800 text-white border border-[#72b63f]/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
              <span>Família</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("caregiver")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === "caregiver"
                  ? "bg-slate-800 text-white border border-[#02a9b5]/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#02a9b5]" />
              <span>Cuidador</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole("admin");
                setIdentifier("admin@longevita.com.br");
                setPassword("admin123");
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === "admin"
                  ? "bg-slate-800 text-white border border-purple-500/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>ADM</span>
            </button>
          </div>

          {/* Test Profiles Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#72b63f]" />
                Acesso Rápido de Teste (1 Clique)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all hover:scale-105"
                >
                  <div className="font-bold text-xs text-white truncate">{u.name.split(" ")[0]}</div>
                  <div className="text-[10px] text-slate-400 font-mono capitalize">{u.role === "family" ? "Família" : u.role === "caregiver" ? "Cuidador" : "ADM"}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MODES: LOGIN FORM */}
          {mode === "login" && (
            <motion.form
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  E-mail ou CPF
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) setErrors({});
                    }}
                    placeholder="exemplo@email.com ou CPF"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#02a9b5] transition-colors"
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#02a9b5] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-slate-950 font-bold text-sm shadow-lg shadow-[#02a9b5]/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* MODES: CADASTRO FORM */}
          {mode === "cadastro" && (
            <motion.form
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#72b63f] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#72b63f] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#72b63f] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#72b63f] transition-colors"
                  />
                </div>
              </div>

              {errors.form && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#72b63f] hover:bg-[#619c35] text-slate-950 font-bold text-sm shadow-lg shadow-[#72b63f]/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Cadastro & Entrar</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
