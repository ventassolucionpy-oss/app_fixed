'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { usePais } from '@/components/providers/PaisProvider'

type Profile = { name: string; nivel: string; pais: string }
type RecentGen = { id: string; tool: string; created_at: string }

const TOOL_NAMES: Record<string, string> = {
  'campana-completa': 'Campaña de anuncios',
  'ugc-anuncios': 'Anuncios con video',
  'whatsapp-flows': 'Flujos de WhatsApp',
  'dropi': 'Búsqueda de producto',
  'rentabilidad': 'Calculadora de ganancia',
  'war-room': 'Revisión de campañas',
  'validador-producto': 'Validación de producto',
  'oferta-flash': 'Oferta especial',
  'copy-scorer': 'Análisis de texto',
  'buyer-persona': 'Perfil del comprador',
  'pedidos': 'Gestión de pedidos',
}

// Pasos del flujo ordenados por etapa de negocio — lenguaje simple
const FLUJO_PASOS = [
  {
    etapa: '1ª vez aquí',
    color: 'border-violet-500/30 bg-violet-500/5',
    items: [
      { href: '/flujo', icon: '🗺️', titulo: 'Cómo funciona todo', sub: 'El camino completo de cero a tu primera venta — empezá acá', destacado: true },
    ],
  },
  {
    etapa: 'Paso 1 · Encontrá qué vender',
    color: 'border-blue-500/20',
    items: [
      { href: '/dropi', icon: '🔍', titulo: 'Buscar un producto para vender', sub: 'La app te ayuda a encontrar algo rentable en Dropi' },
      { href: '/validador-producto', icon: '✅', titulo: 'Verificar si el producto va a funcionar', sub: '14 preguntas para saber si vale la pena antes de invertir' },
      { href: '/rentabilidad', icon: '🧮', titulo: 'Calcular cuánto vas a ganar', sub: 'Ingresás el precio y la app calcula tu ganancia real' },
    ],
  },
  {
    etapa: 'Paso 2 · Creá tus anuncios',
    color: 'border-violet-500/20',
    items: [
      { href: '/campana', icon: '⚡', titulo: 'Crear campaña completa de anuncios', sub: 'La IA escribe todos los textos de venta por vos' },
      { href: '/whatsapp-flows', icon: '📲', titulo: 'Preparar los mensajes de WhatsApp', sub: 'Las respuestas listas para cuando lleguen clientes' },
      { href: '/confirmacion-cod', icon: '📞', titulo: 'Script para llamar a confirmar pedidos', sub: 'Qué decir cuando llamás para confirmar antes de enviar' },
    ],
  },
  {
    etapa: 'Paso 3 · Gestioná cada día',
    color: 'border-amber-500/20',
    items: [
      { href: '/rutina-diaria', icon: '⚡', titulo: 'Mi checklist de hoy', sub: 'Las 10 cosas que revisar cada mañana (15 minutos)' },
      { href: '/pedidos', icon: '📦', titulo: 'Ver mis pedidos', sub: 'Qué se entregó, qué está en camino, qué se rechazó' },
      { href: '/war-room', icon: '🔴', titulo: 'Revisar cómo van mis anuncios', sub: 'Decidir si escalar, mantener o pausar cada campaña' },
    ],
  },
  {
    etapa: 'Paso 4 · Crecer y escalar',
    color: 'border-emerald-500/20',
    items: [
      { href: '/dashboard-pl', icon: '💰', titulo: 'Ver cuánto gané hoy', sub: 'El resumen de ingresos, gastos y ganancia del día' },
      { href: '/flujo-caja', icon: '💸', titulo: 'Planificar el crecimiento', sub: 'Cuánto dinero necesito para vender más' },
      { href: '/pipeline-creativos', icon: '🎬', titulo: 'Planificar los videos de la semana', sub: 'Qué videos nuevos crear para que los anuncios no se cansen' },
    ],
  },
]

// Herramientas completas — todas accesibles pero no abrumadoras
const TODAS_HERRAMIENTAS = [
  { seccion: '🔍 Antes de vender', items: [
    { href: '/dropi', icon: '🔍', label: 'Buscar producto' },
    { href: '/validador-producto', icon: '✅', label: 'Validar producto' },
    { href: '/rentabilidad', icon: '🧮', label: 'Calcular ganancia' },
    { href: '/precios-psicologicos', icon: '🧮', label: 'Elegir precio' },
    { href: '/buyer-persona', icon: '👤', label: 'Perfil del comprador' },
    { href: '/roas-simulator', icon: '🎯', label: 'Simular ROAS' },
  ]},
  { seccion: '📣 Anuncios y textos', items: [
    { href: '/campana', icon: '⚡', label: 'Campaña completa' },
    { href: '/copy-scorer', icon: '📊', label: 'Analizar texto' },
    { href: '/oferta', icon: '💎', label: 'Construir oferta' },
    { href: '/oferta-flash', icon: '⚡', label: 'Oferta especial' },
    { href: '/cro', icon: '🔬', label: 'Mejorar mi página' },
    { href: '/spy', icon: '🕵️', label: 'Analizar anuncios' },
  ]},
  { seccion: '💬 WhatsApp y atención', items: [
    { href: '/whatsapp-flows', icon: '📲', label: 'Flujos WhatsApp' },
    { href: '/whatsapp-ventas', icon: '💬', label: 'Scripts de venta' },
    { href: '/confirmacion-cod', icon: '📞', label: 'Llamada COD' },
    { href: '/customer-service', icon: '🎧', label: 'Atención al cliente' },
    { href: '/retencion', icon: '🔄', label: 'Retener clientes' },
    { href: '/upsell', icon: '💎', label: 'Vender más a cada cliente' },
  ]},
  { seccion: '🎬 Videos y contenido', items: [
    { href: '/creativos/ugc-creator', icon: '🎬', label: 'Guión de video' },
    { href: '/ugc-review', icon: '🌟', label: 'Video de reseña' },
    { href: '/creadores', icon: '🎭', label: 'Mis creadores' },
    { href: '/organico', icon: '🌱', label: 'Contenido gratis' },
    { href: '/pipeline-creativos', icon: '📋', label: 'Plan de videos' },
  ]},
  { seccion: '📊 Seguimiento y análisis', items: [
    { href: '/war-room', icon: '🔴', label: 'Revisión de campañas' },
    { href: '/dashboard-pl', icon: '💰', label: 'Ganancia del día' },
    { href: '/pedidos', icon: '📦', label: 'Mis pedidos' },
    { href: '/logistica-cod', icon: '🗺️', label: 'Entrega por ciudad' },
    { href: '/kpis', icon: '📈', label: 'Mis números' },
    { href: '/portfolio', icon: '📋', label: 'Todos mis productos' },
  ]},
  { seccion: '👥 Equipo y operación', items: [
    { href: '/rutina-diaria', icon: '⚡', label: 'Checklist diario' },
    { href: '/equipo', icon: '👥', label: 'Mi equipo' },
    { href: '/flujo-caja', icon: '💸', label: 'Flujo de caja' },
    { href: '/proteccion-cuenta', icon: '🛡️', label: 'Proteger cuenta Meta' },
    { href: '/meta-rechazos', icon: '🚫', label: 'Rechazos Meta' },
  ]},
]

export default function InicioPage() {
  const { pais, cfg } = usePais()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentGens, setRecentGens] = useState<RecentGen[]>([])
  const [totalGens, setTotalGens] = useState(0)
  const [showTodas, setShowTodas] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('name, nivel, pais').eq('id', user.id).single()
      setProfile(p)
      const { data: gens } = await supabase.from('generations').select('id, tool, created_at').order('created_at', { ascending: false }).limit(3)
      setRecentGens(gens || [])
      const { count } = await supabase.from('generations').select('*', { count: 'exact', head: true })
      setTotalGens(count || 0)
    }
    load()
  }, [])

  const nombre = profile?.name?.split(' ')[0] || ''
  const hour = new Date().getHours()
  const saludo = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const isNuevo = totalGens === 0

  return (
    <div className="min-h-screen">
      <Navbar userName={profile?.name} />
      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">

        {/* Saludo personalizado */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {saludo}{nombre ? `, ${nombre}` : ''}! 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Vendiendo en <span className="text-white/70">{cfg.nombre}</span> {cfg.bandera} · {cfg.moneda}
          </p>
        </div>

        {/* Banner bienvenida nuevo usuario */}
        {isNuevo && (
          <div className="card border border-violet-500/30 bg-violet-500/5 p-4 rounded-2xl">
            <p className="text-violet-300 font-bold text-sm mb-1">¡Bienvenido! ¿Por dónde empezar?</p>
            <p className="text-white/50 text-xs mb-3">Seguí el flujo en orden y tendrás tu primer producto listo para vender hoy.</p>
            <Link href="/flujo"
              className="flex items-center gap-2 bg-violet-600/30 rounded-xl px-4 py-3 hover:bg-violet-600/50 transition-all">
              <span className="text-xl">🗺️</span>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Ver cómo funciona todo</p>
                <p className="text-white/40 text-xs">El camino completo, paso a paso</p>
              </div>
              <span className="text-violet-400">→</span>
            </Link>
          </div>
        )}

        {/* Alerta proactiva si tiene actividad */}
        {!isNuevo && recentGens.length > 0 && (() => {
          const days = Math.floor((Date.now() - new Date(recentGens[0].created_at).getTime()) / 86400000)
          return days >= 5 ? (
            <Link href="/campana" className="block card border border-amber-500/25 bg-amber-500/5 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <div>
                  <p className="text-amber-300 text-xs font-bold">Hace {days} días sin crear anuncios nuevos</p>
                  <p className="text-white/40 text-[11px]">Los anuncios se cansan en 7-14 días. Tocá para crear nuevos.</p>
                </div>
              </div>
            </Link>
          ) : null
        })()}

        {/* Checklist diario — siempre visible */}
        <Link href="/rutina-diaria"
          className="flex items-center gap-3 card border border-amber-500/25 bg-amber-500/5 p-4 rounded-2xl hover:border-amber-500/50 transition-all">
          <span className="text-2xl flex-shrink-0">⚡</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Mi checklist de hoy</p>
            <p className="text-white/40 text-xs">Las cosas que revisar cada mañana — 15 minutos</p>
          </div>
          <span className="text-amber-400 font-bold text-sm flex-shrink-0">→</span>
        </Link>

        {/* Flujo guiado por pasos — el corazón del inicio */}
        <div className="space-y-4">
          {FLUJO_PASOS.map((grupo, gi) => (
            <div key={gi}>
              <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">{grupo.etapa}</p>
              <div className={`space-y-2`}>
                {grupo.items.map(item => (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:bg-white/5 ${item.destacado ? 'border-violet-500/35 bg-violet-500/8 hover:border-violet-500/60' : `border-white/10 ${grupo.color.includes('bg') ? '' : 'bg-white/2'}`}`}>
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-tight">{item.titulo}</p>
                      <p className="text-white/35 text-[11px] mt-0.5 leading-tight">{item.sub}</p>
                    </div>
                    <span className="text-white/25 text-xs flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actividad reciente */}
        {recentGens.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Usado recientemente</p>
            <div className="space-y-1.5">
              {recentGens.map(g => (
                <Link key={g.id} href="/gestionar"
                  className="flex items-center gap-3 p-3 card rounded-xl hover:border-white/15 transition-all">
                  <span className="text-base">✦</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/65 text-xs font-medium truncate">
                      {TOOL_NAMES[g.tool] || g.tool}
                    </p>
                  </div>
                  <p className="text-white/20 text-[10px] flex-shrink-0">
                    {new Date(g.created_at).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit' })}
                  </p>
                </Link>
              ))}
              <Link href="/gestionar" className="text-xs text-violet-400 px-3 py-1 block">
                Ver todo el historial →
              </Link>
            </div>
          </div>
        )}

        {/* Todas las herramientas — desplegable */}
        <div>
          <button onClick={() => setShowTodas(s => !s)}
            className="w-full flex items-center justify-between p-3.5 card rounded-xl hover:border-white/20 transition-all">
            <span className="text-white/50 text-sm font-medium">Todas las herramientas ({Object.values(TODAS_HERRAMIENTAS).reduce((s,g) => s + g.items.length, 0)})</span>
            <span className="text-white/30 text-xs">{showTodas ? '▲ Ocultar' : '▼ Ver todas'}</span>
          </button>

          {showTodas && (
            <div className="mt-3 space-y-4">
              {TODAS_HERRAMIENTAS.map(grupo => (
                <div key={grupo.seccion}>
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">{grupo.seccion}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {grupo.items.map(item => (
                      <Link key={item.href} href={item.href}
                        className="flex items-center gap-2 p-2.5 card rounded-xl hover:border-white/20 transition-all">
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <p className="text-white/65 text-xs font-medium leading-tight truncate">{item.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
