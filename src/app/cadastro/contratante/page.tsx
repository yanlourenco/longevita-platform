"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Clock,
  HeartHandshake,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Briefcase
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { maskCPF, maskPhone, maskCEP, fetchViaCEP, calculatePasswordStrength } from "@/lib/utils/masks";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";

export default function CadastroContratantePage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { registerFamilyUser } = useApp();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Formulário do Contratante
  const [formData, setFormData] = useState({
    // Etapa 1: Dados Pessoais
    fullName: "",
    cpf: "",
    rg: "",
    birthDate: "",
    phone: "",
    relationshipToSenior: "Filho(a)",

    // Etapa 2: Endereço do Cuidado
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    residenceType: "Casa",

    // Etapa 3: Necessidades de Contratação
    careType: "Plantão Diurno (8h às 18h)",
    frequency: "5 dias por semana (Seg a Sex)",
    urgency: "Para início imediato",

    // Etapa 4: Acesso
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleCepChange = async (value: string) => {
    const masked = maskCEP(value);
    setFormData((prev) => ({ ...prev, cep: masked }));

    const rawCep = value.replace(/\D/g, "");
    if (rawCep.length === 8) {
      setIsSearchingCep(true);
      const result = await fetchViaCEP(rawCep);
      setIsSearchingCep(false);

      if (result) {
        setFormData((prev) => ({
          ...prev,
          street: result.logradouro || "",
          neighborhood: result.bairro || "",
          city: result.localidade || "",
          state: result.uf || "",
        }));
        success("Endereço localizado!", `${result.localidade} - ${result.uf}`);
      } else {
        toastError("CEP não encontrado", "Por favor preencha o logradouro manualmente.");
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Informe seu nome e sobrenome completo";
    }
    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido ou incompleto (11 dígitos)";
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Informe um telefone/WhatsApp válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP incompleto (8 dígitos)";
    }
    if (!formData.street.trim()) {
      newErrors.street = "Informe o nome da rua / avenida";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Informe o número da residência";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Informe um e-mail válido";
    }
    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    if (!formData.termsAccepted) {
      newErrors.terms = "Você deve aceitar os termos de uso e privacidade da LGPD";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      // Criação de conta no Supabase Auth
      try {
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              role: "contractor",
              full_name: formData.fullName,
              cpf: formData.cpf,
              phone: formData.phone,
            },
          },
        });
      } catch (authErr) {
        console.warn("Supabase Auth local notice:", authErr);
      }

      // Registra a nova Família/Contratante no ecossistema reativo
      registerFamilyUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        address: {
          street: `${formData.street}, ${formData.number}`,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }
      });

      // Salva dados no sessionStorage de suporte caso precise no step do assistido
      sessionStorage.setItem("longevita_temp_family_address", `${formData.street}, ${formData.number} - ${formData.neighborhood}, ${formData.city}`);
      sessionStorage.setItem("longevita_temp_family_phone", formData.phone);
      sessionStorage.setItem("longevita_temp_family_rel", formData.relationshipToSenior);

      success("Cadastro Concluído!", "Sua conta de contratante LongeVita foi criada. Vamos cadastrar seu familiar assistido!");
      setTimeout(() => {
        router.push("/assistido/novo");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toastError("Erro ao finalizar", "Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-neutral-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <Logo size="md" />
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Já possui conta? <span className="text-[#72b63f] font-bold hover:underline">Fazer Login</span>
        </Link>
      </header>

      {/* Stepper Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-8 pb-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#0891b2] transition-all duration-500 z-0"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 1 ? "bg-[#72b63f] text-white shadow-md shadow-[#72b63f]/30" : "bg-neutral-200 text-neutral-500"
              }`}
            >
              1
            </div>
            <span className="text-[11px] font-bold text-neutral-700 mt-1.5 hidden sm:block">Dados Pessoais</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 2 ? "bg-[#02a9b5] text-white shadow-md shadow-[#02a9b5]/30" : "bg-white border-2 border-neutral-300 text-neutral-400"
              }`}
            >
              2
            </div>
            <span className="text-[11px] font-bold text-neutral-700 mt-1.5 hidden sm:block">Endereço & Rotina</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 3 ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/30" : "bg-white border-2 border-neutral-300 text-neutral-400"
              }`}
            >
              3
            </div>
            <span className="text-[11px] font-bold text-neutral-700 mt-1.5 hidden sm:block">Acesso & Segurança</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-white rounded-[36px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100/90 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#ff6059]" />

          {/* Header do Form */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Portal do Contratante Familiar
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              {step === 1 && "Cadastre-se como Contratante"}
              {step === 2 && "Local de Atendimento & Preferências"}
              {step === 3 && "Crie seu Acesso Seguro"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
              {step === 1 && "Seus dados como responsável legal pela contratação de cuidadores."}
              {step === 2 && "Onde os cuidadores prestarão atendimento com segurança e geolocalização."}
              {step === 3 && "Protegido por criptografia e em total conformidade com a LGPD."}
            </p>
          </div>

          {/* ETAPA 1: DADOS PESSOAIS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nome Completo do Contratante *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Mariana Albuquerque de Castro"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                  />
                  {errors.cpf && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cpf}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                    placeholder="(11) 98765-4321"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Grau de Parentesco com o Idoso
                  </label>
                  <select
                    value={formData.relationshipToSenior}
                    onChange={(e) => setFormData({ ...formData, relationshipToSenior: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                  >
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Neto(a)">Neto(a)</option>
                    <option value="Cônjuge">Cônjuge / Esposo(a)</option>
                    <option value="Sobrinho(a)">Sobrinho(a)</option>
                    <option value="Irmão / Irmã">Irmão / Irmã</option>
                    <option value="Tutor / Curador Legal">Tutor / Curador Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    RG (Opcional para contrato)
                  </label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                    placeholder="00.000.000-0"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                  />
                </div>
              </div>

              {/* Botão Avançar */}
              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-neutral-900 px-8 py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                  Continuar: Endereço do Cuidado
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 2: ENDEREÇO & PREFERÊNCIAS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    CEP do Atendimento *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                    />
                    {isSearchingCep && (
                      <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-[#02a9b5] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  {errors.cep && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cep}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Rua / Logradouro *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Ex: Rua Oscar Freire"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                  {errors.street && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.street}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                  {errors.number && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.number}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    placeholder="Apto 42"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Jardins"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Cidade/UF
                  </label>
                  <input
                    type="text"
                    value={`${formData.city}${formData.state ? ` / ${formData.state}` : ''}`}
                    readOnly
                    placeholder="São Paulo / SP"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-100/70 border border-neutral-200 text-sm text-neutral-600 outline-none"
                  />
                </div>
              </div>

              {/* Preferências de Plantão */}
              <div className="pt-3 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Tipo de Cuidado Desejado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Plantão Diurno (8h às 18h)",
                    "Plantão Noturno (12h / 24h)",
                    "Folguista / Finais de Semana",
                  ].map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setFormData({ ...formData, careType: option })}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all ${
                        formData.careType === option
                          ? "bg-cyan-50 border-[#02a9b5] text-cyan-900 ring-2 ring-[#02a9b5]/20"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100/80"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões de Navegação */}
              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl px-5 py-3.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-neutral-900 px-8 py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                  Continuar: Criar Acesso
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: ACESSO & SEGURANÇA */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  E-mail de Acesso *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Senha */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Senha *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Força:</span>
                        <span className="font-bold text-neutral-800">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repita a senha"
                      className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#72b63f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Termos & LGPD */}
              <div className="pt-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#72b63f] focus:ring-[#72b63f] border-neutral-300"
                  />
                  <span className="text-xs text-neutral-600 leading-relaxed">
                    Concordo com os <strong>Termos de Contratação</strong> e autorizo a gestão segura de cuidadores e dados de saúde sob a <strong>LGPD (Lei 13.709/2018)</strong>.
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.terms}</p>}
              </div>

              {/* Botões */}
              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl px-5 py-3.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-2xl bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#0891b2] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#02a9b5]/20 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Finalizar Cadastro do Contratante
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>
    </div>
  );
}
