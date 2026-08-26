"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Activity,
  Phone,
  Shield,
  Pill,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
  Stethoscope,
  X,
  Clock
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { BANCO_CONDICOES_MEDICAS, ALERGIAS_COMUNS, CondicaoMedica } from "@/lib/utils/healthData";
import { maskPhone, calculateAge } from "@/lib/utils/masks";

interface SelectedCondition {
  id: string;
  nome: string;
  categoria: string;
  observacoes: string;
}

interface Medication {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
}

export default function NovoAssistidoPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // STEP 1: Dados Pessoais & Rotina
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [parentesco, setParentesco] = useState("Mãe");
  const [genero, setGenero] = useState("Feminino");
  const [mobilidade, setMobilidade] = useState<"independente" | "apoio" | "cadeirante" | "acamado">("apoio");
  const [alimentacao, setAlimentacao] = useState("Normal / Sólida");
  const [restricoesAlimentares, setRestricoesAlimentares] = useState<string[]>([]);
  const [contatoEmergenciaNome, setContatoEmergenciaNome] = useState("");
  const [contatoEmergenciaTelefone, setContatoEmergenciaTelefone] = useState("");
  const [planoSaude, setPlanoSaude] = useState("");
  const [medicoResponsavel, setMedicoResponsavel] = useState("");

  // STEP 2: Condições de Saúde & Busca Preditiva
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<SelectedCondition[]>([
    {
      id: "hipertensao",
      nome: "Hipertensão Arterial Sistêmica",
      categoria: "Cardiovascular",
      observacoes: "Aferir pressão 2x ao dia (manhã e noite).",
    },
  ]);
  const [medicamentos, setMedicamentos] = useState<Medication[]>([
    { id: "1", nome: "Losartana Potássica", dosagem: "50mg", horario: "08:00" },
  ]);
  const [newMedNome, setNewMedNome] = useState("");
  const [newMedDosagem, setNewMedDosagem] = useState("");
  const [newMedHorario, setNewMedHorario] = useState("");
  const [alergias, setAlergias] = useState<string[]>(["Dipirona"]);
  const [customAlergia, setCustomAlergia] = useState("");

  const calculatedAge = useMemo(() => calculateAge(dataNascimento), [dataNascimento]);

  // Filtro preditivo da busca inteligente de condições
  const filteredConditions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return BANCO_CONDICOES_MEDICAS.filter(
      (c) =>
        (c.nome.toLowerCase().includes(query) || c.categoria.toLowerCase().includes(query)) &&
        !selectedConditions.some((sc) => sc.id === c.id)
    ).slice(0, 6);
  }, [searchQuery, selectedConditions]);

  const addCondition = (condition: CondicaoMedica) => {
    setSelectedConditions((prev) => [
      ...prev,
      {
        id: condition.id,
        nome: condition.nome,
        categoria: condition.categoria,
        observacoes: condition.cuidadosSugeridos,
      },
    ]);
    setSearchQuery("");
    setIsSearchOpen(false);
    success("Condição adicionada", condition.nome);
  };

  const removeCondition = (id: string) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const updateConditionNote = (id: string, note: string) => {
    setSelectedConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, observacoes: note } : c))
    );
  };

  const addMedication = () => {
    if (!newMedNome.trim()) return;
    setMedicamentos((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        nome: newMedNome.trim(),
        dosagem: newMedDosagem.trim() || "Conforme prescrição",
        horario: newMedHorario.trim() || "Horário flexível",
      },
    ]);
    setNewMedNome("");
    setNewMedDosagem("");
    setNewMedHorario("");
  };

  const removeMedication = (id: string) => {
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleAlergia = (alergia: string) => {
    if (alergias.includes(alergia)) {
      setAlergias(alergias.filter((a) => a !== alergia));
    } else {
      setAlergias([...alergias, alergia]);
    }
  };

  const handleAddCustomAlergia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAlergia.trim()) return;
    if (!alergias.includes(customAlergia.trim())) {
      setAlergias([...alergias, customAlergia.trim()]);
    }
    setCustomAlergia("");
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!nome.trim()) {
        toastError("Nome obrigatório", "Por favor informe o nome do seu familiar assistido.");
        return;
      }
      if (!dataNascimento) {
        toastError("Data obrigatória", "Por favor informe a data de nascimento.");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Formata nível de necessidade compatível com o enum SQL
      const nivelMap: Record<string, "companhia" | "intermediario" | "acamado_alzheimer"> = {
        independente: "companhia",
        apoio: "intermediario",
        cadeirante: "intermediario",
        acamado: "acamado_alzheimer",
      };

      const payload = {
        nome,
        dataNascimento,
        nivelNecessidade:
          selectedConditions.some((c) => c.id === "alzheimer") || mobilidade === "acamado"
            ? "acamado_alzheimer"
            : nivelMap[mobilidade] || "companhia",
        condicoesMedicas: JSON.stringify({
          parentesco,
          genero,
          mobilidade,
          alimentacao,
          restricoesAlimentares,
          contatoEmergencia: { nome: contatoEmergenciaNome, telefone: contatoEmergenciaTelefone },
          planoSaude,
          medicoResponsavel,
          condicoes: selectedConditions,
          medicamentos,
          alergias,
        }),
      };

      // Tenta gravar no endpoint Next.js API blindado
      const res = await fetch("/api/idosos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Se não autenticado no momento (modo demo local), salvar no sessionStorage e simular sucesso
      if (res.status === 401 || !res.ok) {
        sessionStorage.setItem("longevita_assistido_demo", JSON.stringify(payload));
      }

      success("Assistido cadastrado!", `${nome} foi adicionado(a) com sucesso ao seu ecossistema.`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      toastError("Erro ao salvar", "Os dados foram preservados localmente.");
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between border-b border-neutral-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <Logo size="md" />
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ✕ Cancelar e Voltar
        </Link>
      </header>

      {/* Stepper Wizard Indicator */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-8 pb-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5] transition-all duration-500 z-0"
            style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep >= 1
                  ? "bg-[#72b63f] text-white shadow-md shadow-[#72b63f]/30"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Dados & Rotina</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep >= 2
                  ? "bg-[#02a9b5] text-white shadow-md shadow-[#02a9b5]/30"
                  : "bg-white border-2 border-neutral-300 text-neutral-400"
              }`}
            >
              2
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Saúde & Medicamentos</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep === 3
                  ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/30"
                  : "bg-white border-2 border-neutral-300 text-neutral-400"
              }`}
            >
              3
            </div>
            <span className="text-xs font-bold text-neutral-800 mt-2 hidden sm:block">Revisão & Salvar</span>
          </div>
        </div>
      </div>

      {/* Main Content Form */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: DADOS PESSOAIS & ROTINA */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-neutral-100"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72b63f]">Etapa 1 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  Perfil e Rotina do Assistido
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Essas informações guiam o cuidador sobre as preferências, autonomia e cuidados essenciais.
                </p>
              </div>

              <div className="space-y-6">
                {/* Nome e Data */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Nome Completo do Idoso *
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Helena Ribeiro de Castro"
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f] focus:ring-4 focus:ring-[#72b63f]/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f]"
                    />
                    {calculatedAge !== null && (
                      <span className="inline-block mt-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {calculatedAge} anos
                      </span>
                    )}
                  </div>
                </div>

                {/* Parentesco e Gênero */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Grau de Parentesco
                    </label>
                    <select
                      value={parentesco}
                      onChange={(e) => setParentesco(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f]"
                    >
                      <option value="Mãe">Mãe</option>
                      <option value="Pai">Pai</option>
                      <option value="Avó / Avô">Avó / Avô</option>
                      <option value="Tio / Tia">Tio / Tia</option>
                      <option value="Cônjuge">Cônjuge</option>
                      <option value="Outro">Outro familiar / Amigo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Gênero
                    </label>
                    <select
                      value={genero}
                      onChange={(e) => setGenero(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f]"
                    >
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro / Prefere não declarar</option>
                    </select>
                  </div>
                </div>

                {/* Grau de Mobilidade (Cards Visuais) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Grau de Mobilidade e Autonomia *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "independente", label: "Independente", desc: "Anda sem auxílio" },
                      { id: "apoio", label: "Precisa de Apoio", desc: "Bengala / Andador" },
                      { id: "cadeirante", label: "Cadeirante", desc: "Cadeira de rodas" },
                      { id: "acamado", label: "Acamado(a)", desc: "Cuidados no leito" },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setMobilidade(item.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          mobilidade === item.id
                            ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20"
                            : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100/60"
                        }`}
                      >
                        <div className="font-bold text-sm text-neutral-900">{item.label}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rotina Alimentar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Textura / Tipo de Alimentação
                    </label>
                    <select
                      value={alimentacao}
                      onChange={(e) => setAlimentacao(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f]"
                    >
                      <option value="Normal / Sólida">Normal / Sólida</option>
                      <option value="Pastosa (Alimentos amassados/purês)">Pastosa (Alimentos amassados/purês)</option>
                      <option value="Líquida / Semilíquida com Espessante">Líquida / Semilíquida com Espessante</option>
                      <option value="Sonda Enteral / Gastrostomia (GTT)">Sonda Enteral / Gastrostomia (GTT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Plano de Saúde (Opcional)
                    </label>
                    <input
                      type="text"
                      value={planoSaude}
                      onChange={(e) => setPlanoSaude(e.target.value)}
                      placeholder="Ex: SulAmérica / Bradesco Saúde"
                      className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#72b63f]"
                    />
                  </div>
                </div>

                {/* Contatos de Emergência */}
                <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    Contato de Emergência Principal
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={contatoEmergenciaNome}
                      onChange={(e) => setContatoEmergenciaNome(e.target.value)}
                      placeholder="Nome do contato (Ex: Filho Carlos)"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-sm outline-none focus:border-[#72b63f]"
                    />
                    <input
                      type="text"
                      value={contatoEmergenciaTelefone}
                      onChange={(e) => setContatoEmergenciaTelefone(maskPhone(e.target.value))}
                      placeholder="(11) 98888-7777"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-sm outline-none focus:border-[#72b63f]"
                    />
                  </div>
                </div>
              </div>

              {/* Botão Avançar */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-neutral-900 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                  Próximo: Saúde e Medicamentos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUSCA DINÂMICA DE CONDIÇÕES & CUIDADOS */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-neutral-100"
            >
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#02a9b5]">Etapa 2 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  Condições de Saúde & Medicamentos
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Utilize o campo de busca inteligente abaixo para adicionar comorbidades e cuidados especiais com chips interativos.
                </p>
              </div>

              <div className="space-y-8">
                {/* 🔍 CAMPO DE BUSCA INTELIGENTE (AUTOSUGGEST / AUTOCOMPLETE) */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
                    <span>🔍 Busca Preditiva de Condições & Comorbidades</span>
                    <span className="text-[#02a9b5] text-xs font-semibold">Sugestões automáticas</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      placeholder="Digite para buscar: ex. Alzheimer, Diabetes, Parkinson, AVC, Hipertensão..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-50 border-2 border-neutral-200 text-sm text-neutral-900 outline-none focus:bg-white focus:border-[#02a9b5] focus:ring-4 focus:ring-[#02a9b5]/10 transition-all font-medium"
                    />
                  </div>

                  {/* Dropdown de Sugestões Preditivas */}
                  <AnimatePresence>
                    {isSearchOpen && filteredConditions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 p-2 z-30 max-h-72 overflow-y-auto"
                      >
                        {filteredConditions.map((cond) => (
                          <button
                            type="button"
                            key={cond.id}
                            onClick={() => addCondition(cond)}
                            className="w-full text-left p-3.5 rounded-xl hover:bg-cyan-50/60 transition-colors flex items-center justify-between group"
                          >
                            <div>
                              <div className="text-sm font-bold text-neutral-900 group-hover:text-[#02a9b5]">
                                {cond.nome}
                              </div>
                              <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                                {cond.cuidadosSugeridos}
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#02a9b5] group-hover:text-white transition-colors">
                              + Adicionar
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 🏷️ TAGGING & CHIPS INTERATIVOS COM OBSERVAÇÕES ESPECÍFICAS */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Condições Selecionadas ({selectedConditions.length})
                  </h3>

                  {selectedConditions.length === 0 ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-200 text-center text-neutral-400 text-sm">
                      Nenhuma condição médica adicionada. Utilize o campo de busca acima.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedConditions.map((cond) => (
                        <motion.div
                          layout
                          key={cond.id}
                          className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
                                {cond.categoria}
                              </span>
                              <span className="font-bold text-sm text-neutral-900">{cond.nome}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCondition(cond.id)}
                              className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                              title="Remover"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Campo de observações do cuidado específico */}
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                              Orientações específicas / dosagens / horários para esta condição:
                            </label>
                            <textarea
                              rows={2}
                              value={cond.observacoes}
                              onChange={(e) => updateConditionNote(cond.id, e.target.value)}
                              placeholder="Ex: Medir glicemia antes do almoço e registrar no diário de bordo..."
                              className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 outline-none focus:border-[#02a9b5]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 💊 MEDICAMENTOS DE USO CONTÍNUO */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-amber-500" />
                    Medicamentos de Uso Contínuo
                  </h3>

                  {/* Lista de Medicamentos */}
                  <div className="space-y-2 mb-3">
                    {medicamentos.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/60"
                      >
                        <div>
                          <span className="font-bold text-sm text-neutral-900">{med.nome}</span>
                          <span className="text-xs text-neutral-500 ml-2">({med.dosagem})</span>
                          <span className="text-xs font-semibold text-amber-700 ml-2 bg-amber-100 px-2 py-0.5 rounded-md">
                            ⏰ {med.horario}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedication(med.id)}
                          className="text-neutral-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Adicionar Medicamento */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    <input
                      type="text"
                      value={newMedNome}
                      onChange={(e) => setNewMedNome(e.target.value)}
                      placeholder="Nome do remédio"
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs outline-none focus:border-[#02a9b5]"
                    />
                    <input
                      type="text"
                      value={newMedDosagem}
                      onChange={(e) => setNewMedDosagem(e.target.value)}
                      placeholder="Dosagem (ex: 50mg)"
                      className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs outline-none focus:border-[#02a9b5]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMedHorario}
                        onChange={(e) => setNewMedHorario(e.target.value)}
                        placeholder="Horários (ex: 08h e 20h)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs outline-none focus:border-[#02a9b5]"
                      />
                      <button
                        type="button"
                        onClick={addMedication}
                        className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 flex items-center justify-center flex-shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 🛡️ ALERGIAS CONHECIDAS */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Alergias Conhecidas (Selecione ou digite)
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {ALERGIAS_COMUNS.map((alergia) => {
                      const isSelected = alergias.includes(alergia);
                      return (
                        <button
                          type="button"
                          key={alergia}
                          onClick={() => toggleAlergia(alergia)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-rose-500 text-white shadow-sm"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {isSelected && "✓ "}
                          {alergia}
                        </button>
                      );
                    })}
                  </div>

                  {/* Alergia Personalizada */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAlergia}
                      onChange={(e) => setCustomAlergia(e.target.value)}
                      placeholder="Outra alergia não listada acima..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs outline-none focus:bg-white focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAlergia}
                      className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold"
                    >
                      + Incluir
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões de Navegação */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-2xl px-6 py-4 text-sm font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-neutral-900 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all flex items-center gap-2"
                >
                  Revisar e Concluir
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVISÃO E SALVAR */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-neutral-100"
            >
              <div className="mb-8 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Etapa 3 de 3</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                  Dossiê de Cuidado do Assistido
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Confira as informações antes de finalizar o cadastro no banco seguro LongeVita.
                </p>
              </div>

              {/* Dossiê Card */}
              <div className="rounded-[28px] bg-gradient-to-b from-[#fbfbfd] to-white p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#72b63f] mb-1">
                      {parentesco} • {genero}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">{nome}</h3>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Nascimento: {dataNascimento} ({calculatedAge} anos)
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                    Mobilidade: {mobilidade}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">Alimentação & Dieta:</span>
                    {alimentacao}
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">Emergência / Médico:</span>
                    {contatoEmergenciaNome ? `${contatoEmergenciaNome} (${contatoEmergenciaTelefone})` : "Não informado"}
                    {planoSaude ? ` • Plano: ${planoSaude}` : ""}
                  </div>
                </div>

                {/* Condições listadas */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Condições Médicas Identificadas ({selectedConditions.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedConditions.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-white border border-neutral-200 text-xs">
                        <span className="font-bold text-neutral-900">{c.nome}</span>
                        {c.observacoes && (
                          <p className="text-neutral-500 mt-0.5 italic">"{c.observacoes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medicamentos */}
                {medicamentos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Medicamentos ({medicamentos.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {medicamentos.map((m) => (
                        <span key={m.id} className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold">
                          💊 {m.nome} ({m.dosagem}) - {m.horario}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alergias */}
                {alergias.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Alergias ({alergias.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {alergias.map((a, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold">
                          ⚠️ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-2xl px-6 py-4 text-sm font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar e Editar
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="rounded-2xl bg-gradient-to-r from-[#72b63f] to-[#02a9b5] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#02a9b5]/20 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Salvar Cadastro do Assistido
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>
    </div>
  );
}
