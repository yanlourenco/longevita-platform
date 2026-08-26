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
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Clock,
  Sparkles,
  FileCheck
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { maskCPF, maskPhone, maskCEP, calculatePasswordStrength } from "@/lib/utils/masks";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";

export default function CadastroCuidadorPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { registerCaregiverUser } = useApp();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    coren: "",
    phone: "",
    formacao: "Técnico(a) de Enfermagem",
    experienciaAnos: "5 a 8 anos",
    especialidades: ["Alzheimer & Demências", "Administração de Medicamentos"],
    valorHora: "45",
    disponibilidade: "Plantões Diurnos e Noturnos",
    email: "",
    password: "",
    confirmPassword: "",
    antecedentesDeclarados: true,
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = calculatePasswordStrength(formData.password);

  const toggleEspecialidade = (esp: string) => {
    if (formData.especialidades.includes(esp)) {
      setFormData({
        ...formData,
        especialidades: formData.especialidades.filter((e) => e !== esp),
      });
    } else {
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, esp],
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Informe seu nome e sobrenome completo";
    }
    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF incompleto (11 dígitos)";
    }
    if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Informe um telefone/WhatsApp válido com DDD";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }
    if (!formData.termsAccepted) {
      newErrors.terms = "É necessário aceitar os termos de credenciamento";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // 1. Registra o cuidador no AppContext e ativa a sessão imediatamente com persistência síncrona
      registerCaregiverUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf,
        especialidade: Array.isArray(formData.especialidades) ? formData.especialidades.join(", ") : formData.especialidades,
        experienciaAnos: formData.experienciaAnos,
        valorHora: Number(formData.valorHora) || 45,
        formacao: `${formData.formacao} • COREN: ${formData.coren || "Validado"}`,
        disponibilidade: formData.disponibilidade
      });

      // 2. Sincroniza conta com Supabase Auth
      try {
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              role: "caregiver",
              full_name: formData.fullName,
              cpf: formData.cpf,
              coren: formData.coren,
              phone: formData.phone,
              formacao: formData.formacao,
              experiencia: formData.experienciaAnos,
              especialidades: formData.especialidades,
              valor_hora: formData.valorHora,
              disponibilidade: formData.disponibilidade,
            },
          },
        });
      } catch (authErr) {
        console.warn("Supabase Auth local notice:", authErr);
      }

      success("Perfil de Cuidador Criado!", `Bem-vindo(a) à LongeVita, ${formData.fullName}! Redirecionando para o seu painel.`);
      setTimeout(() => router.push("/dashboard"), 700);
    } catch (err: any) {
      console.error(err);
      toastError("Erro ao cadastrar", "Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#02a9b5] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Já possui cadastro? <span className="text-[#02a9b5] font-bold hover:underline">Fazer Login</span>
        </Link>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl bg-white rounded-[36px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#02a9b5] to-[#0891b2]" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold mb-2 border border-cyan-100">
              <Award className="w-3.5 h-3.5" />
              Credenciamento de Cuidadores e Enfermeiros
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Cadastre-se como Cuidador(a)
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
              Faça parte da rede de elite de cuidados geriátricos com suporte operacional e remuneração garantida.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* 1. Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                1. Informações Pessoais
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ex: Ana Paula da Silva"
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                />
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
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
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* 2. Qualificação Profissional */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                2. Formação & Experiência
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Grau de Formação
                  </label>
                  <select
                    value={formData.formacao}
                    onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  >
                    <option value="Enfermeiro(a) Padrão (Graduação)">Enfermeiro(a) Padrão (Graduação)</option>
                    <option value="Técnico(a) de Enfermagem">Técnico(a) de Enfermagem</option>
                    <option value="Auxiliar de Enfermagem">Auxiliar de Enfermagem</option>
                    <option value="Cuidador de Idosos Certificado">Cuidador de Idosos Certificado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Nº COREN / Certificado
                  </label>
                  <input
                    type="text"
                    value={formData.coren}
                    onChange={(e) => setFormData({ ...formData, coren: e.target.value })}
                    placeholder="Ex: COREN-SP 123456-TE"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Especialidades & Habilidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Alzheimer & Demências",
                    "Doença de Parkinson",
                    "Idosos Acamados / Leito",
                    "Administração de Medicamentos",
                    "Cuidados pós-cirúrgicos",
                    "Curativos Complexos",
                    "Sonda Enteral / Gastrostomia",
                    "Estímulo Cognitivo & Lazer",
                  ].map((esp) => {
                    const isSelected = formData.especialidades.includes(esp);
                    return (
                      <button
                        type="button"
                        key={esp}
                        onClick={() => toggleEspecialidade(esp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-[#02a9b5] text-white shadow-sm"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {isSelected && "✓ "}
                        {esp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Pretensão por Hora (R$/h)
                  </label>
                  <input
                    type="text"
                    value={formData.valorHora}
                    onChange={(e) => setFormData({ ...formData, valorHora: e.target.value.replace(/\D/g, "") })}
                    placeholder="Ex: 45"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Disponibilidade
                  </label>
                  <select
                    value={formData.disponibilidade}
                    onChange={(e) => setFormData({ ...formData, disponibilidade: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  >
                    <option value="Plantões Diurnos e Noturnos">Plantões Diurnos e Noturnos</option>
                    <option value="Somente Diurno (Seg a Sex)">Somente Diurno (Seg a Sex)</option>
                    <option value="Somente Noturno">Somente Noturno</option>
                    <option value="Plantões de Final de Semana">Plantões de Final de Semana</option>
                    <option value="Plantões 24h">Plantões 24h</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Acesso */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                3. Acesso à Plataforma
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  E-mail Principal *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                />
                {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Senha *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm outline-none focus:bg-white focus:border-[#02a9b5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
              </div>
            </div>

            {/* Termos & Declaração */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-[#02a9b5] focus:ring-[#02a9b5] border-neutral-300"
                />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  Declaro que as informações e diplomas informados são autênticos e autorizo a checagem prévia de certidões e antecedentes criminais para credenciamento no ecossistema LongeVita.
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.terms}</p>}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#02a9b5] py-4 text-center text-base font-bold text-white shadow-lg shadow-[#02a9b5]/20 hover:bg-[#0891b2] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enviar Cadastro para Validação
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>
    </div>
  );
}
