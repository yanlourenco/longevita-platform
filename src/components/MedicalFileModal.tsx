"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Activity,
  Heart,
  Pill,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  Search,
  ShieldCheck,
  Stethoscope,
  Sparkles
} from "lucide-react";
import { Assistido, useApp } from "@/context/AppContext";
import { BANCO_CONDICOES_MEDICAS, CondicaoMedica } from "@/lib/utils/healthData";

interface MedicalFileModalProps {
  assistido: Assistido | null;
  isOpen: boolean;
  onClose: () => void;
  canEdit?: boolean;
}

export default function MedicalFileModal({
  assistido,
  isOpen,
  onClose,
  canEdit = true
}: MedicalFileModalProps) {
  const { updateAssistido, userRole } = useApp();

  const [formData, setFormData] = useState<Partial<Assistido>>({});
  const [activeTab, setActiveTab] = useState<"prontuario" | "comorbidades" | "rotinas" | "sinais">("prontuario");
  
  // Busca e Seleção de Comorbidades
  const [comorbiditySearch, setComorbiditySearch] = useState("");
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>([]);
  
  // Medicações
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("");

  // Novas Rotinas
  const [newRoutine, setNewRoutine] = useState("");

  useEffect(() => {
    if (assistido) {
      setFormData(assistido);
      setSelectedComorbidities(assistido.comorbidades || []);
    }
  }, [assistido]);

  if (!isOpen || !assistido) return null;

  const filteredCatalog = BANCO_CONDICOES_MEDICAS.filter(
    (c) =>
      c.nome.toLowerCase().includes(comorbiditySearch.toLowerCase()) ||
      c.categoria.toLowerCase().includes(comorbiditySearch.toLowerCase())
  );

  const toggleComorbidity = (name: string) => {
    if (!canEdit && userRole === "caregiver") return;
    if (selectedComorbidities.includes(name)) {
      const updated = selectedComorbidities.filter((c) => c !== name);
      setSelectedComorbidities(updated);
      setFormData((prev) => ({ ...prev, comorbidades: updated }));
    } else {
      const updated = [...selectedComorbidities, name];
      setSelectedComorbidities(updated);
      setFormData((prev) => ({ ...prev, comorbidades: updated }));
    }
  };

  const handleAddMedication = () => {
    if (!medName.trim() || !medTime.trim()) return;
    const currentMeds = formData.medicacoes || [];
    const updated = [...currentMeds, { nome: medName.trim(), horario: medTime.trim() }];
    setFormData((prev) => ({ ...prev, medicacoes: updated }));
    setMedName("");
    setMedTime("");
  };

  const handleRemoveMedication = (index: number) => {
    const currentMeds = formData.medicacoes || [];
    const updated = currentMeds.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medicacoes: updated }));
  };

  const handleAddRoutine = () => {
    if (!newRoutine.trim()) return;
    const currentRoutines = formData.rotinas || [];
    const updated = [...currentRoutines, newRoutine.trim()];
    setFormData((prev) => ({ ...prev, rotinas: updated }));
    setNewRoutine("");
  };

  const handleRemoveRoutine = (index: number) => {
    const currentRoutines = formData.rotinas || [];
    const updated = currentRoutines.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, rotinas: updated }));
  };

  const handleSave = () => {
    if (!assistido) return;
    updateAssistido(assistido.id, {
      ...formData,
      comorbidades: selectedComorbidities
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Superior com Identificação */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-700 flex-shrink-0 border-2 border-white/20 shadow-md">
                <img
                  src={assistido.foto}
                  alt={assistido.nome}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#02a9b5]/20 text-[#02c5d4] text-[11px] font-bold border border-[#02a9b5]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Ficha Clínica Homologada
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">{assistido.idade} anos</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold truncate">{assistido.nome}</h2>
                <p className="text-xs text-neutral-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#72b63f]" />
                  {assistido.cidade} • {assistido.bairro}
                </p>
              </div>
            </div>

            {/* Abas Internas */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab("prontuario")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "prontuario"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-neutral-300 hover:bg-white/15"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Resumo Geral
              </button>
              <button
                onClick={() => setActiveTab("comorbidades")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "comorbidades"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-neutral-300 hover:bg-white/15"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Patologias & Tags ({selectedComorbidities.length})
              </button>
              <button
                onClick={() => setActiveTab("rotinas")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "rotinas"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-neutral-300 hover:bg-white/15"
                }`}
              >
                <Pill className="w-3.5 h-3.5" />
                Medicações & Rotinas
              </button>
              <button
                onClick={() => setActiveTab("sinais")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "sinais"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-white/10 text-neutral-300 hover:bg-white/15"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Sinais Vitais
              </button>
            </div>
          </div>

          {/* Corpo do Modal */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* ABA 1: RESUMO GERAL */}
            {activeTab === "prontuario" && (
              <div className="space-y-5">
                {/* Cuidador Vinculado ou Status de Vínculo */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#02a9b5]/10 text-[#028490] flex items-center justify-center font-bold">
                      <Heart className="w-5 h-5 text-[#02a9b5]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">Status de Vínculo</span>
                      <span className="text-sm font-bold text-neutral-900">
                        {assistido.cuidadorVinculadoNome
                          ? `Assistido por ${assistido.cuidadorVinculadoNome}`
                          : "Buscando Profissional Disponível"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      assistido.status === "vinculada"
                        ? "bg-[#72b63f]/10 text-[#558a2e] border-[#72b63f]/20"
                        : assistido.status === "em_negociacao"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {assistido.status === "vinculada"
                      ? "Contrato Ativo"
                      : assistido.status === "em_negociacao"
                      ? "Proposta em Análise"
                      : "Disponível na Vitrine"}
                  </span>
                </div>

                {/* Descrição do Cuidado */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Diretrizes e Necessidades de Assistência
                  </label>
                  {canEdit ? (
                    <textarea
                      rows={3}
                      value={formData.necessidades || ""}
                      onChange={(e) => setFormData({ ...formData, necessidades: e.target.value })}
                      placeholder="Descreva detalhes específicos da assistência..."
                      className="w-full p-3.5 rounded-2xl bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:border-[#02a9b5] transition-all resize-none"
                    />
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 leading-relaxed font-medium">
                      {assistido.necessidades}
                    </div>
                  )}
                </div>

                {/* Contato de Emergência com Ação Rápida */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Contato de Emergência Familiar
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{assistido.contatoEmergencia.nome}</h4>
                      <p className="text-xs text-neutral-600">
                        {assistido.contatoEmergencia.parentesco} • {assistido.contatoEmergencia.telefone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${assistido.contatoEmergencia.telefone.replace(/\D/g, "")}`}
                        className="px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-neutral-100 border border-neutral-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#02a9b5]" />
                        Ligar
                      </a>
                      <a
                        href={`https://wa.me/55${assistido.contatoEmergencia.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: PATOLOGIAS & CHIPS DE BUSCA */}
            {activeTab === "comorbidades" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                    Comorbidades e Condições Diagnosticadas
                  </label>
                  <p className="text-xs text-neutral-500 mb-3">
                    Selecione ou busque no catálogo clínico oficial para orientar o protocolo do cuidador.
                  </p>

                  {/* Chips Ativos */}
                  <div className="flex flex-wrap gap-2 mb-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 min-h-[50px]">
                    {selectedComorbidities.length === 0 ? (
                      <span className="text-xs text-neutral-400 italic">Nenhuma patologia selecionada ainda.</span>
                    ) : (
                      selectedComorbidities.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#02a9b5]/10 text-[#028490] border border-[#02a9b5]/30 text-xs font-bold"
                        >
                          <Stethoscope className="w-3 h-3 text-[#02a9b5]" />
                          {item}
                          {canEdit && (
                            <button
                              onClick={() => toggleComorbidity(item)}
                              className="text-neutral-400 hover:text-rose-600 ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Busca no Catálogo */}
                  {canEdit && (
                    <>
                      <div className="relative mb-3">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={comorbiditySearch}
                          onChange={(e) => setComorbiditySearch(e.target.value)}
                          placeholder="Buscar patologia (ex: Alzheimer, Parkinson, Diabetes, AVC)..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium focus:border-[#02a9b5]"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 border border-neutral-200 rounded-2xl bg-white">
                        {filteredCatalog.map((cond) => {
                          const isSelected = selectedComorbidities.includes(cond.nome);
                          return (
                            <button
                              key={cond.id}
                              onClick={() => toggleComorbidity(cond.nome)}
                              className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#02a9b5]/10 text-[#028490] font-bold border border-[#02a9b5]/20"
                                  : "hover:bg-neutral-50 text-neutral-800"
                              }`}
                            >
                              <div>
                                <span className="font-bold block">{cond.nome}</span>
                                <span className="text-[10px] text-neutral-500 font-normal">{cond.cuidadosSugeridos}</span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                                  {cond.categoria}
                                </span>
                                {isSelected ? (
                                  <Check className="w-4 h-4 text-[#028490]" />
                                ) : (
                                  <Plus className="w-4 h-4 text-neutral-400" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ABA 3: MEDICAÇÕES & ROTINAS */}
            {activeTab === "rotinas" && (
              <div className="space-y-6">
                {/* Medicações Contínuas */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-amber-600" />
                    Medicamentos de Uso Contínuo
                  </h3>

                  <div className="space-y-2 mb-3">
                    {(formData.medicacoes || []).map((med, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-neutral-400" />
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">{med.nome}</span>
                            <span className="text-[11px] text-amber-700 font-medium">Horário: {med.horario}</span>
                          </div>
                        </div>

                        {canEdit && (
                          <button
                            onClick={() => handleRemoveMedication(idx)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {canEdit && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={medName}
                        onChange={(e) => setMedName(e.target.value)}
                        placeholder="Nome e dosagem (ex: Losartana 50mg)"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium focus:border-[#02a9b5]"
                      />
                      <input
                        type="text"
                        value={medTime}
                        onChange={(e) => setMedTime(e.target.value)}
                        placeholder="Horários (ex: 08:00 / 20:00)"
                        className="w-36 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium focus:border-[#02a9b5]"
                      />
                      <button
                        onClick={handleAddMedication}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Rotinas Diárias Estruturadas */}
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#72b63f]" />
                    Rotinas Diárias & Cuidados Físicos
                  </h3>

                  <div className="space-y-2 mb-3">
                    {(formData.rotinas || []).map((rot, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs text-neutral-800 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#72b63f] flex-shrink-0" />
                          <span>{rot}</span>
                        </div>

                        {canEdit && (
                          <button
                            onClick={() => handleRemoveRoutine(idx)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {canEdit && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRoutine}
                        onChange={(e) => setNewRoutine(e.target.value)}
                        placeholder="Adicionar rotina (ex: Banho assistido às 10h, Dieta pastosa)..."
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium focus:border-[#02a9b5]"
                      />
                      <button
                        onClick={handleAddRoutine}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ABA 4: SINAIS VITAIS */}
            {activeTab === "sinais" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Histórico & Monitoramento de Sinais Vitais
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {formData.sinaisVitais?.atualizadoEm || "Atualizado recentemente"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Pressão Arterial
                    </span>
                    {canEdit ? (
                      <input
                        type="text"
                        value={formData.sinaisVitais?.pressao || "12x8 mmHg"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sinaisVitais: { ...(formData.sinaisVitais as any), pressao: e.target.value }
                          })
                        }
                        className="w-full font-bold text-neutral-900 text-base bg-white px-2 py-1 rounded-lg border border-neutral-300 focus:border-[#02a9b5]"
                      />
                    ) : (
                      <span className="text-lg font-bold text-neutral-900">
                        {formData.sinaisVitais?.pressao || "12x8 mmHg"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Glicemia Capilar
                    </span>
                    {canEdit ? (
                      <input
                        type="text"
                        value={formData.sinaisVitais?.glicemia || "104 mg/dL"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sinaisVitais: { ...(formData.sinaisVitais as any), glicemia: e.target.value }
                          })
                        }
                        className="w-full font-bold text-neutral-900 text-base bg-white px-2 py-1 rounded-lg border border-neutral-300 focus:border-[#02a9b5]"
                      />
                    ) : (
                      <span className="text-lg font-bold text-neutral-900">
                        {formData.sinaisVitais?.glicemia || "104 mg/dL"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Frequência Cardíaca
                    </span>
                    {canEdit ? (
                      <input
                        type="text"
                        value={formData.sinaisVitais?.frequenciaCardiaca || "72 bpm"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sinaisVitais: { ...(formData.sinaisVitais as any), frequenciaCardiaca: e.target.value }
                          })
                        }
                        className="w-full font-bold text-neutral-900 text-base bg-white px-2 py-1 rounded-lg border border-neutral-300 focus:border-[#02a9b5]"
                      />
                    ) : (
                      <span className="text-lg font-bold text-neutral-900">
                        {formData.sinaisVitais?.frequenciaCardiaca || "72 bpm"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Temperatura
                    </span>
                    {canEdit ? (
                      <input
                        type="text"
                        value={formData.sinaisVitais?.temperatura || "36.4 °C"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sinaisVitais: { ...(formData.sinaisVitais as any), temperatura: e.target.value }
                          })
                        }
                        className="w-full font-bold text-neutral-900 text-base bg-white px-2 py-1 rounded-lg border border-neutral-300 focus:border-[#02a9b5]"
                      />
                    ) : (
                      <span className="text-lg font-bold text-neutral-900">
                        {formData.sinaisVitais?.temperatura || "36.4 °C"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#72b63f]/10 border border-[#72b63f]/20 text-xs text-[#406822] font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#72b63f] flex-shrink-0" />
                  <span>Sinais vitais checados presencialmente no último plantão via protocolo LongeVita.</span>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Ações */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-300 transition-colors"
            >
              Fechar
            </button>
            {canEdit && (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Salvar Alterações
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
