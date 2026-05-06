'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Seccion = {
  id: string
  titulo: string
  icono: string
  urgencia: 'critico' | 'importante' | 'recomendado'
  descripcion: string
  pasos: { titulo: string; detalle: string; alerta?: string }[]
  checklist: string[]
}

const SECCIONES: Seccion[] = [
  {
    id: 'estructura-bm',
    titulo: 'Estructura del Business Manager — El escudo anti-ban',
    icono: '🏗️',
    urgencia: 'critico',
    descripcion: 'La arquitectura correcta de tu BM determina si un ban te destruye la operación o solo te pausa un día.',
    pasos: [
      {
        titulo: 'BM Principal con perfil personal limpio',
        detalle: 'Tu BM debe estar creado desde un perfil personal de Facebook con al menos 6 meses de antigüedad, nombre real, foto real, y actividad regular (no solo ads). Un perfil creado ayer para hacer ads es una bandera roja instantánea para Meta.',
        alerta: 'Nunca usar un perfil falso o recién creado como dueño del BM. Es la causa #1 de bans.',
      },
      {
        titulo: 'Estructura de cuentas: 1 BM → 2 cuentas publicitarias activas',
        detalle: 'Tener exactamente 2 cuentas publicitarias activas en tu BM: la cuenta principal (donde va el gasto real) y una cuenta secundaria siempre caliente con al menos $5/día de gasto. Si banean la principal, la secundaria ya tiene historial y la activás en horas.',
        alerta: 'La cuenta secundaria debe estar gastando siempre, aunque sea mínimo. Una cuenta en $0 por 30 días pierde el trust score.',
      },
      {
        titulo: 'Verificar el BM y el dominio',
        detalle: 'BM verificado (subir documento) + dominio verificado en Meta Business Suite. Las cuentas verificadas tienen prioridad en revisiones manuales y menor probabilidad de restricciones automáticas. Hacerlo en las primeras 24hs de crear el BM.',
      },
      {
        titulo: 'Agregar 2 administradores al BM',
        detalle: 'Agregar otro perfil real de confianza como administrador del BM. Si Meta bloquea tu perfil personal y es el único admin, perdés acceso al BM completo. El segundo admin es la llave de repuesto.',
        alerta: 'El segundo admin debe ser un perfil real con historial. No un perfil falso.',
      },
      {
        titulo: 'Método de pago: tarjeta diferente por cuenta',
        detalle: 'Cuenta principal y secundaria con tarjetas de débito/crédito diferentes. Si hay un problema de pago en una (tarjeta rechazada, disputa), la otra sigue corriendo sin verse afectada.',
      },
    ],
    checklist: [
      'BM creado desde perfil personal con 6+ meses de antigüedad',
      'BM verificado con documento de identidad o empresa',
      'Dominio verificado en Meta Business Suite',
      '2 cuentas publicitarias activas (principal + respaldo)',
      'Cuenta respaldo gastando mínimo $5/día continuamente',
      '2 administradores en el BM (vos + persona de confianza)',
      'Método de pago diferente en cada cuenta publicitaria',
    ],
  },
  {
    id: 'calentamiento',
    titulo: 'Calentamiento de cuenta nueva — De $0 a $200/día sin bans',
    icono: '🔥',
    urgencia: 'critico',
    descripcion: 'Una cuenta nueva que va directo a $100/día tiene 10x más probabilidad de ser baneada que una que llegó de forma gradual.',
    pasos: [
      {
        titulo: 'Semana 1: Confianza básica ($5-20/día)',
        detalle: 'Día 1-3: crear 1 campaña con $5/día. Contenido simple, producto de bajo riesgo, sin claims agresivos. El objetivo NO es vender — es que Meta vea actividad legítima normal. Día 4-7: subir a $20/día si no hubo problemas.',
        alerta: 'Nunca pasar de $0 a $100 directo. Meta interpreta el spike de gasto como actividad sospechosa.',
      },
      {
        titulo: 'Semana 2: Crecimiento gradual ($20-50/día)',
        detalle: 'Si la semana 1 fue limpia (sin restricciones, sin rechazos), escalar a $50/día máximo. Introducir 1 producto nuevo si es necesario. Seguir con creativos seguros, sin claims de antes/después ni promesas médicas.',
      },
      {
        titulo: 'Semana 3-4: Normalización ($50-100/día)',
        detalle: 'Con 2 semanas de historial limpio, la cuenta tiene un trust score básico. Ahora sí se puede subir a $100/día y testear copies más agresivos con cuidado.',
      },
      {
        titulo: 'Mes 2 en adelante: Escala normal ($100-500/día)',
        detalle: 'Una cuenta con 4 semanas de historial limpio y buen trust score puede escalar normalmente. A partir de acá, el límite de gasto diario de Meta se sube solo o lo podés solicitar al soporte.',
        alerta: 'Siempre subir el presupuesto máximo 30% por semana. Duplicarlo de golpe puede triggerear una revisión.',
      },
    ],
    checklist: [
      'Semana 1: Empezar con $5-20/día máximo',
      'Primeros 3 días: solo 1 campaña activa',
      'Ningún rechazo en los primeros 7 días',
      'Escalar gradualmente: no más de 30% por semana',
      'Esperar 4 semanas antes de testear claims más agresivos',
      'Solicitar aumento de límite de gasto después del mes 1',
    ],
  },
  {
    id: 'trust-score',
    titulo: 'Trust Score — Qué lo sube y qué lo destruye',
    icono: '⭐',
    urgencia: 'importante',
    descripcion: 'El trust score de Meta no es visible pero determina todo: límites de gasto, velocidad de revisión, y riesgo de ban.',
    pasos: [
      {
        titulo: 'Qué SUBE el trust score',
        detalle: '✓ Historial de pago sin interrupciones (nunca tarjeta rechazada) · ✓ Gasto consistente día a día (no picos y valles extremos) · ✓ Alta tasa de aprobación de ads (< 5% de rechazos) · ✓ Cuenta verificada con dominio · ✓ Pixel activo con eventos de calidad · ✓ Muchos años de antigüedad del perfil dueño.',
      },
      {
        titulo: 'Qué DESTRUYE el trust score',
        detalle: '✗ Tarjeta rechazada (aunque sea por fondos insuficientes temporalmente) · ✗ Muchos rechazos seguidos · ✗ Spike de gasto repentino (de $50 a $500 de un día para otro) · ✗ Disputas o chargebacks desde el método de pago · ✗ Reportes de usuarios sobre tus ads · ✗ Cambiar el nombre del BM repetidamente.',
        alerta: 'Un solo chargeback puede desencadenar una revisión de cuenta. Avisar al banco antes de cualquier carga grande.',
      },
      {
        titulo: 'Cómo recuperar trust score después de un problema',
        detalle: 'Si la cuenta tiene restricciones: 1) Pausar TODOS los ads por 48-72hs. 2) Revisar todos los ads activos y eliminar cualquiera que pueda violar políticas. 3) Presentar el appeal con documentación real. 4) No crear campañas nuevas hasta que se resuelva la restricción.',
      },
    ],
    checklist: [
      'Tarjeta con suficiente límite para al menos 7 días de gasto',
      'Activar aviso de saldo bajo en el banco (para no quedarse sin fondos)',
      'Nunca hacer disputes/chargebacks en Meta si se puede evitar',
      'Mantener la tasa de rechazo de ads por debajo del 5%',
      'Pixel activo y enviando eventos en todas las campañas',
    ],
  },
  {
    id: 'protocolo-ban',
    titulo: 'Protocolo de emergencia si te banean',
    icono: '🚨',
    urgencia: 'critico',
    descripcion: 'Un ban no es el fin. Con el protocolo correcto podés recuperar la cuenta o estar operativo en 24-48 horas.',
    pasos: [
      {
        titulo: 'Paso 1: No entrar en pánico ni hacer acciones impulsivas',
        detalle: 'Lo peor que podés hacer: crear una cuenta nueva inmediatamente, intentar acceder desde IPs diferentes, o enviar múltiples appeals seguidos. Meta interpreta eso como comportamiento evasivo y puede hacer el ban permanente.',
        alerta: '❌ No crear cuentas nuevas — Meta las detecta y banea automáticamente.',
      },
      {
        titulo: 'Paso 2: Identificar el tipo de ban',
        detalle: 'Ban de anuncio individual (menos grave, solo ese ad) → editar y volver a publicar. Ban de cuenta publicitaria (más serio) → presentar appeal con documentación. Ban del BM (grave) → contactar soporte y tener el BM respaldo listo. Ban del perfil personal (muy grave) → el BM respaldo con segundo admin se activa.',
      },
      {
        titulo: 'Paso 3: Presentar el appeal correctamente',
        detalle: 'Ir a Meta Business Help Center → "Solicitar revisión". Incluir: nombre real, documento de identidad, URL del negocio, descripción del producto, y explicación de por qué el ad era legítimo. Ser específico, no genérico. Un appeal bien escrito tiene 40-60% de éxito en el primer intento.',
      },
      {
        titulo: 'Paso 4: Activar la cuenta respaldo',
        detalle: 'Mientras espera el appeal, activar la cuenta publicitaria secundaria del mismo BM. Si ya estaba calentada con historial, puede estar corriendo ads en 24-48hs. Esta es la razón por la que la cuenta respaldo SIEMPRE debe estar activa.',
        alerta: 'Sin cuenta respaldo calentada → podés estar 7-30 días sin ventas mientras resolvés el ban.',
      },
      {
        titulo: 'Paso 5: Documentar y aprender',
        detalle: 'Registrar en /meta-rechazos: qué ad causó el ban, qué claim, qué imagen. Este aprendizaje evita que el mismo error pase en la cuenta nueva.',
      },
    ],
    checklist: [
      'Cuenta respaldo activa y calentada ANTES de que pase algo',
      'Segundo administrador en el BM activo',
      'Tener el email y contraseña del segundo admin guardados',
      'Saber cómo presentar un appeal en Meta Business Help',
      'Registrar todos los rechazos en /meta-rechazos para no repetir patrones',
      'Nunca crear cuentas nuevas sin resolver el ban primero',
    ],
  },
  {
    id: 'pixel-salud',
    titulo: 'Salud del Pixel — Event Match Quality',
    icono: '🎯',
    urgencia: 'importante',
    descripcion: 'Un Pixel con EMQ (Event Match Quality) bajo hace que Meta no pueda optimizar bien y tu ROAS cae.',
    pasos: [
      {
        titulo: 'Qué es el EMQ y por qué importa',
        detalle: 'Event Match Quality (0-10) mide qué tan bien Meta puede identificar a los usuarios que disparan eventos en tu Pixel. EMQ alto → mejor optimización → mejor ROAS. EMQ bajo → Meta no puede encontrar a tus compradores → ROAS cae.',
        alerta: 'EMQ < 6 es una señal de alerta. Debería estar en 7-8+.',
      },
      {
        titulo: 'Cómo mejorar el EMQ para COD/Dropi',
        detalle: 'Para COD el desafío es que no tenés checkout propio. Solución: 1) Enviar eventos de Purchase a Meta cuando el pedido se confirma en tu app (via Conversions API). 2) Incluir el email y teléfono del cliente si los tenés. 3) Usar el checkout de Dropi si tiene integración de Pixel. 4) Mínimo: disparar ViewContent y Lead desde tu landing.',
      },
      {
        titulo: 'Verificar con Meta Pixel Helper',
        detalle: 'Instalar la extensión Meta Pixel Helper en Chrome. Navegar tu landing page → verificar que los eventos se disparan correctamente. Si el Pixel no dispara → tu campaña está optimizando a ciegas.',
      },
    ],
    checklist: [
      'Pixel instalado y verificado con Meta Pixel Helper',
      'EMQ del evento Purchase ≥ 7 (revisar en Events Manager)',
      'Eventos ViewContent y Lead disparando en la landing',
      'Conversions API configurada si es posible',
      'Revisar EMQ cada semana en Meta Events Manager',
    ],
  },
]

const URGENCIA_STYLE: Record<string, string> = {
  critico: 'text-red-400 bg-red-500/15 border-red-500/30',
  importante: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  recomendado: 'text-blue-400 bg-blue-500/15 border-blue-500/20',
}

export default function ProteccionCuentaPage() {
  const [activeSection, setActiveSection] = useState<string | null>('estructura-bm')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <Link href="/aprender" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Aprender</Link>
          <h1 className="text-2xl font-bold text-white mt-2">🛡️ Protección de Cuenta Meta</h1>
          <p className="text-white/40 text-sm mt-1">Arquitectura anti-ban, calentamiento de cuentas y protocolo de emergencia</p>
        </div>

        <div className="card border border-red-500/25 bg-red-500/5 p-3 rounded-xl mb-5">
          <p className="text-red-400 text-xs font-bold mb-1">⚠️ Por qué esto es crítico</p>
          <p className="text-white/50 text-xs leading-relaxed">A partir de $500/mes en ad spend, la probabilidad de enfrentar restricciones de Meta es real. Sin la arquitectura correcta, un solo ban puede dejarte sin ventas por semanas. Con la arquitectura correcta, estás operativo en 24-48hs.</p>
        </div>

        <div className="space-y-3">
          {SECCIONES.map(s => (
            <div key={s.id} className={`card border rounded-2xl overflow-hidden ${activeSection === s.id ? 'border-violet-500/30' : 'border-white/8'}`}>
              <button onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                className="w-full p-4 text-left flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{s.icono}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-white font-bold text-sm">{s.titulo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${URGENCIA_STYLE[s.urgencia]}`}>
                      {s.urgencia === 'critico' ? '🔴 Crítico' : s.urgencia === 'importante' ? '🟡 Importante' : '🔵 Recomendado'}
                    </span>
                  </div>
                  {activeSection !== s.id && <p className="text-white/35 text-[11px] mt-1 leading-relaxed">{s.descripcion}</p>}
                </div>
                <span className="text-white/20 text-xs flex-shrink-0 mt-1">{activeSection === s.id ? '▲' : '▼'}</span>
              </button>

              {activeSection === s.id && (
                <div className="border-t border-white/8 p-4 space-y-4">
                  <p className="text-white/50 text-xs leading-relaxed">{s.descripcion}</p>

                  <div className="space-y-3">
                    {s.pasos.map((p, i) => (
                      <div key={i} className="bg-white/3 rounded-xl p-3 border border-white/8">
                        <div className="flex gap-2 mb-1.5">
                          <span className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-300 text-[9px] font-bold flex-shrink-0">{i+1}</span>
                          <p className="text-white/85 text-xs font-medium leading-relaxed">{p.titulo}</p>
                        </div>
                        <p className="text-white/50 text-[11px] leading-relaxed pl-7">{p.detalle}</p>
                        {p.alerta && (
                          <p className="text-amber-400/70 text-[10px] mt-1.5 pl-7">⚠️ {p.alerta}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-500/8 rounded-xl p-3 border border-emerald-500/15">
                    <p className="text-[10px] text-emerald-400/70 uppercase tracking-wide mb-2">✅ Checklist</p>
                    <ul className="space-y-1.5">
                      {s.checklist.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/60">
                          <span className="text-emerald-400 flex-shrink-0">□</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/meta-rechazos" className="card p-3 flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 transition-all">
            <span>🚫</span><div><p className="text-white text-xs font-bold">Rechazos Meta</p><p className="text-white/30 text-[10px]">Qué evitar y qué hacer</p></div>
          </Link>
          <Link href="/meta-ads-pro" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-blue-500/30 transition-all">
            <span>⚙️</span><div><p className="text-white text-xs font-bold">Meta Ads Pro</p><p className="text-white/30 text-[10px]">Estrategia completa</p></div>
          </Link>
        </div>
      </main>
    </div>
  )
}
