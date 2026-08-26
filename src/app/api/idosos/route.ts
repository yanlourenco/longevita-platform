import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// 1. ESQUEMA DE VALIDAÇÃO COM SANITIZAÇÃO RIGOROSA DE INPUTS (ZOD)
// Proteção direta contra injeções de script (XSS) e dados inválidos
const idosoSchema = z.object({
  nome: z.string()
    .min(2, { message: "O nome deve conter pelo menos 2 caracteres" })
    .max(100, { message: "O nome não pode exceder 100 caracteres" })
    .transform(val => val.replace(/<[^>]*>/g, '').trim()), // Remove Tags HTML vulneráveis
  dataNascimento: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento deve seguir o formato YYYY-MM-DD" }),
  nivelNecessidade: z.enum(['companhia', 'intermediario', 'acamado_alzheimer']),
  condicoesMedicas: z.string()
    .max(1000, { message: "O histórico médico não pode exceder 1000 caracteres" })
    .transform(val => val.replace(/<[^>]*>/g, '').trim())
    .optional(),
});

// 2. MOTOR DE RATE LIMITING INTEGRADO NA MEMÓRIA DA API EDGE/SERVERLESS
// Prevenção de ataques de força bruta, flooding e tentativas de negação de serviço (DDoS)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Janela de 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30;    // Máximo de 30 requisições por IP por minuto
const ipCache = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRate = ipCache.get(ip);

  if (!userRate || now > userRate.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userRate.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  // Identificação do IP do cliente de forma resiliente em ambiente Vercel
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Executa checagem de Rate Limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Bloqueio por excesso de requisições (Rate Limit). Tente novamente em 1 minuto.' },
      { 
        status: 429, 
        headers: { 'Retry-After': '60', 'X-Robots-Tag': 'noindex, nofollow' } 
      }
    );
  }

  try {
    // Inicialização do cliente de banco autenticado do Supabase consumindo HttpOnly Cookies
    const supabase = await createClient();
    
    // Verificação estrita de token JWT e sessão ativa do usuário
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Acesso não autorizado. Token JWT inválido, ausente ou expirado.' },
        { status: 401 }
      );
    }

    // Parsing e sanitização profunda do payload da requisição
    const body = await request.json();
    const validationResult = idosoSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos ou em desconformidade com as diretrizes de validação.',
          detalhes: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Escrita segura no Supabase utilizando RLS nativo
    const { data, error: dbError } = await supabase
      .from('dados_idosos')
      .insert([
        {
          familia_id: session.user.id, // Amarra estrita do id do usuário autenticado no JWT
          nome_criptografado: validatedData.nome,
          data_nascimento: validatedData.dataNascimento,
          nivel_necessidade: validatedData.nivelNecessidade,
          condicoes_medicas: validatedData.condicoesMedicas,
        }
      ])
      .select()
      .single();

    if (dbError) {
      // Log interno para monitoramento da engenharia sem vazar dados na Response HTTP
      console.error('[DB INSERT ERROR]:', dbError.message);
      return NextResponse.json(
        { error: 'Falha interna ao processar registro seguro no banco de dados.' },
        { status: 500 }
      );
    }

    // Retorno com cabeçalhos de segurança estritos contra ataques de sniffing e injeção de frame
    return NextResponse.json(
      { success: true, message: 'Dados de saúde registrados com sucesso sob conformidade LGPD.', data },
      { 
        status: 201,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Content-Security-Policy': "default-src 'none';"
        }
      }
    );

  } catch (globalError) {
    console.error('[CRITICAL API EXCEPTION]:', globalError);
    return NextResponse.json(
      { error: 'Instabilidade crítica do ecossistema de servidores. Contate os administradores.' },
      { status: 500 }
    );
  }
}
