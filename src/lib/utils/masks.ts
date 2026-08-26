/**
 * Utilitários de Máscaras e Validações Brasileiras para o LongeVita
 */

export function maskCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}

export function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 2) return cleaned.length > 0 ? `(${cleaned}` : '';
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

export function maskCEP(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

export function maskDate(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

export function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export interface ViaCepResult {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export async function fetchViaCEP(cep: string): Promise<ViaCepResult | null> {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
    };
  } catch (err) {
    console.error('Erro ao consultar ViaCEP:', err);
    return null;
  }
}

export interface PasswordStrength {
  score: number; // 0 a 4
  label: string;
  color: string;
  percentage: number;
  checks: {
    length: boolean;
    hasNumber: boolean;
    hasUppercase: boolean;
    hasSpecial: boolean;
  };
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (checks.length) score++;
  if (checks.hasNumber) score++;
  if (checks.hasUppercase) score++;
  if (checks.hasSpecial) score++;

  const config = [
    { label: 'Muito fraca', color: 'bg-rose-500', percentage: 15 },
    { label: 'Fraca', color: 'bg-orange-500', percentage: 35 },
    { label: 'Média', color: 'bg-amber-500', percentage: 65 },
    { label: 'Forte', color: 'bg-emerald-500', percentage: 85 },
    { label: 'Excelente', color: 'bg-emerald-600', percentage: 100 },
  ][score] || { label: 'Muito fraca', color: 'bg-rose-500', percentage: 10 };

  return {
    score,
    label: config.label,
    color: config.color,
    percentage: config.percentage,
    checks,
  };
}
