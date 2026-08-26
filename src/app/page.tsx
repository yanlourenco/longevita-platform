"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Building2,
  Heart,
  SlidersHorizontal,
  Stethoscope,
  Clock,
  Sparkles
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { maskCPF, maskPhone, maskCEP, fetchViaCEP, calculatePasswordStrength } from "@/lib/utils/masks";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Formulário do Contratante
  const [formData, setFormData] = useState({
    // Etapa 1: Dados Pessoais
    fullName: "",
    cpf: "",
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

    // Etapa 3: Acesso e Preferências
    careType: "Plantão Diurno (8h às 18h)",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: true,
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
        success("Endereço Localizado", `${result.localidade} - ${result.uf}`);
      } else {
        toastError("CEP Não Encontrado", "Informe o endereço manualmente nos campos abaixo.");
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Informe o nome completo (nome e sobrenome)";
    }
    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF incompleto (11 dígitos requeridos)";
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Informe o telefone com DDD";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP incompleto (8 dígitos requeridos)";
    }
    if (!formData.street.trim()) {
      newErrors.street = "Informe o logradouro";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Informe o número";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Informe um endereço de e-mail válido";
    }
    if (formData.password.length < 8) {
      newErrors.password = "A senha deve conter no mínimo 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }
    if (!formData.termsAccepted) {
      newErrors.terms = "É necessário aceitar os termos de consentimento sob conformidade da LGPD";
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: "contractor",
            full_name: formData.fullName,
            cpf: formData.cpf,
            phone: formData.phone,
            relationship_to_senior: formData.relationshipToSenior,
            address: {
              cep: formData.cep,
              street: formData.street,
              number: formData.number,
              complement: formData.complement,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state,
            },
            care_preferences: {
              care_type: formData.careType,
            },
          },
        },
      });

      if (error) {
        console.error("Supabase SignUp Notice:", error.message);
      }

      sessionStorage.setItem("longevita_contractor_email", formData.email);
      sessionStorage.setItem("longevita_contractor_name", formData.fullName);
      success("Cadastro Realizado", "Conta registrada com sucesso na plataforma.");

      setTimeout(() => {
        router.push("/assistido/novo");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toastError("Cadastro Registrado", "Avançando para o cadastro do familiar assistido.");
      router.push("/assistido/novo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Top Navbar */}
      <header className="px-4 sm:px-8 py-4 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-40">
        <Logo size="md" />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="text-xs font-bold text-neutral-800 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2.5 rounded-xl border border-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
            Portal Executivo
          </Link>
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-neutral-800 hover:text-neutral-950 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 border border-neutral-200 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro/cuidador"
            className="hidden sm:inline-flex text-xs font-bold text-[#028490] bg-[#02a9b5]/10 hover:bg-[#02a9b5]/15 border border-[#02a9b5]/25 px-3.5 py-2.5 rounded-xl transition-colors"
          >
            Área do Cuidador
          </Link>
        </div>
      </header>

      {/* Stepper Wizard Progress */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-8 pb-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5] transition-all duration-500 z-0 rounded-full"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 1 ? "bg-[#72b63f] text-white shadow-sm shadow-[#72b63f]/30" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Dados Pessoais</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= 2 ? "bg-[#02a9b5] text-white shadow-sm shadow-[#02a9b5]/30" : "bg-white border-2 border-neutral-300 text-neutral-500"
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Endereço do Atendimento</span>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 3 ? "bg-neutral-900 text-white shadow-sm shadow-neutral-900/30" : "bg-white border-2 border-neutral-300 text-neutral-500"
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Credenciais de Acesso</span>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral-200/80 relative overflow-hidden"
        >
          {/* Subtle Brand Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#72b63f]" />

          {/* Header do Card */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2.5 border border-[#72b63f]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#72b63f]" />
              Cadastro de Família Contratante • Plataforma Segura
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              {step === 1 && "Identificação do Responsável"}
              {step === 2 && "Localização do Atendimento"}
              {step === 3 && "Configuração de Segurança"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 font-medium">
              {step === 1 && "Informe os dados do responsável pela contratação e acompanhamento dos plantões."}
              {step === 2 && "Endereço onde o assistido reside para validação de rota e geolocalização."}
              {step === 3 && "Criptografia de ponta a ponta e total conformidade com a LGPD (Lei 13.709/2018)."}
            </p>
          </div>

          {/* ETAPA 1: DADOS PESSOAIS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Mariana Albuquerque Santos"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] focus:ring-2 focus:ring-[#72b63f]/20 transition-all"
                  />
                </div>
                {errors.fullName && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    CPF *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] focus:ring-2 focus:ring-[#72b63f]/20 transition-all"
                    />
                  </div>
                  {errors.cpf && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.cpf}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                      placeholder="(11) 98765-4321"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] focus:ring-2 focus:ring-[#72b63f]/20 transition-all"
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Grau de Parentesco com o Idoso(a)
                </label>
                <select
                  value={formData.relationshipToSenior}
                  onChange={(e) => setFormData({ ...formData, relationshipToSenior: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium outline-none focus:border-[#72b63f]"
                >
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Neto(a)">Neto(a)</option>
                  <option value="Cônjuge">Cônjuge / Esposo(a)</option>
                  <option value="Sobrinho(a)">Sobrinho(a)</option>
                  <option value="Irmão / Irmã">Irmão / Irmã</option>
                  <option value="Tutor / Curador Legal">Tutor / Curador Legal</option>
                </select>
              </div>

              {/* Botão Avançar */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto rounded-xl bg-[#72b63f] hover:bg-[#63a035] px-7 py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Prosseguir para Endereço
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 2: ENDEREÇO & BUSCA CEP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      className="w-full px-3.5 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                    />
                    {isSearchingCep && (
                      <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-[#02a9b5] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  {errors.cep && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.cep}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Logradouro *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Ex: Rua Oscar Freire"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                  />
                  {errors.street && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.street}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                  />
                  {errors.number && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.number}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    placeholder="Apto 42"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Jardins"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                    Cidade / UF
                  </label>
                  <input
                    type="text"
                    value={`${formData.city}${formData.state ? ` / ${formData.state}` : ''}`}
                    readOnly
                    placeholder="São Paulo / SP"
                    className="w-full px-3.5 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-sm text-neutral-700 font-bold outline-none"
                  />
                </div>
              </div>

              {/* Preferência de Plantão */}
              <div className="pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Regime de Atendimento Desejado
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    "Plantão Diurno (8h às 18h)",
                    "Plantão Noturno (12h/24h)",
                    "Finais de Semana",
                  ].map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setFormData({ ...formData, careType: option })}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        formData.careType === option
                          ? "bg-[#02a9b5]/10 border-[#02a9b5] text-[#028490] ring-1 ring-[#02a9b5]"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-[#02a9b5] hover:bg-[#0295a0] px-7 py-3 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Prosseguir para Senha
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: ACESSO & CRIAÇÃO DE SENHA */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
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
                    placeholder="responsavel@exemplo.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-neutral-600">
                        <span className="font-bold">Complexidade:</span>
                        <span className="font-bold text-neutral-900">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
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
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Consentimento LGPD */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#72b63f] focus:ring-[#72b63f] border-neutral-300"
                  />
                  <span className="text-xs text-neutral-600 leading-relaxed">
                    Declaro ciência dos <strong>Termos de Uso</strong> e autorizo o tratamento de dados de saúde sob estrita conformidade da <strong>LGPD (Lei 13.709/2018)</strong>.
                  </span>
                </label>
                {errors.terms && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.terms}</p>}
              </div>

              {/* Botões */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-neutral-900 hover:bg-neutral-800 px-8 py-3.5 text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 active:scale-98 disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#72b63f]" />
                      Finalizar e Cadastrar Familiar
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-500 font-medium">
        © {new Date().getFullYear()} LongeVita • Plataforma de Cuidado Geriátrico e Saúde Conectada.
      </footer>
    </div>
  );
}
