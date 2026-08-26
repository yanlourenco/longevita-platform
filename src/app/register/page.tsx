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
  ArrowRight,
  ShieldCheck,
  Building,
  Home
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { maskCPF, maskPhone, maskCEP, fetchViaCEP, calculatePasswordStrength } from "@/lib/utils/masks";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const { registerFamilyUser } = useApp();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = calculatePasswordStrength(formData.password);

  // Manipulador de CEP com consulta automática na API ViaCEP
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
        toastError("CEP não encontrado", "Preencha o endereço manualmente se necessário.");
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Informe seu nome completo (nome e sobrenome)";
    }

    const rawCpf = formData.cpf.replace(/\D/g, "");
    if (rawCpf.length !== 11) {
      newErrors.cpf = "CPF incompleto (11 dígitos)";
    }

    const rawPhone = formData.phone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      newErrors.phone = "Informe um número de telefone com DDD válido";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas digitadas não coincidem";
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "É necessário aceitar as diretrizes de privacidade e LGPD";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Criação de usuário via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            cpf: formData.cpf,
            phone: formData.phone,
            address: {
              cep: formData.cep,
              street: formData.street,
              number: formData.number,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state,
            },
            role: "family_contractor",
          },
        },
      });

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

      success("Conta Criada com Sucesso!", "Agora vamos cadastrar o perfil do seu familiar.");
      setTimeout(() => router.push("/assistido/novo"), 600);
    } catch (err: any) {
      console.error(err);
      toastError("Erro no cadastro", "Tente novamente ou verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/login"
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          Já tem cadastro? <span className="text-[#72b63f] font-bold hover:underline">Fazer Login</span>
        </Link>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white rounded-[36px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100/90 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#ff6059]" />

          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cadastro de Família Contratante
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Crie sua conta LongeVita
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
              Preencha seus dados para conectar cuidadores qualificados com a máxima segurança jurídica e cuidado integral.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Bloco 1: Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                1. Informações Pessoais
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
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
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10 transition-all"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
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
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10 transition-all"
                    />
                  </div>
                  {errors.cpf && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.cpf}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
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
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10 transition-all"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Bloco 2: Localização / Endereço com Busca de CEP */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                2. Endereço Principal (Local de Atendimento)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    CEP *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="00000-000"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] focus:ring-4 focus:ring-[#02a9b5]/10 transition-all"
                    />
                    {isSearchingCep && (
                      <div className="absolute right-3 top-3.5 w-4 h-4 border-2 border-[#02a9b5] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Rua / Avenida
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Ex: Av. Paulista"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] transition-all"
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
                    placeholder="Bela Vista"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                    className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 3: Segurança e Acesso */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-2">
                3. Dados de Acesso
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  E-mail Principal *
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
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10 transition-all"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Senha */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Senha de Acesso *
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
                      className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Medidor de Força da Senha */}
                  {formData.password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Força da senha:</span>
                        <span className="font-bold text-neutral-700">{passwordStrength.label}</span>
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
                      className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] transition-all"
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
            </div>

            {/* Termos & LGPD */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded text-[#72b63f] focus:ring-[#72b63f] border-neutral-300"
                />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  Concordo com os <strong>Termos de Uso</strong> e autorizo o tratamento de dados pessoais e sensíveis para fins exclusivos de assistência e saúde sob conformidade da <strong>LGPD (Lei 13.709/2018)</strong>.
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.terms}</p>}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#0891b2] py-4 text-center text-base font-bold text-white shadow-lg shadow-[#02a9b5]/20 hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Concluir Cadastro e Adicionar Familiar
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
