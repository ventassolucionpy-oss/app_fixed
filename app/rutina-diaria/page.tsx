'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type CheckItem = {
  id: string
  tiempo: number
  label: string
  detalle: string
  herramienta: string
  href?: string
  alerta?: string
}

type Bloque = {
  hora: string
  titulo: string
  icono: string
  color: string
  items: CheckItem[]
}

const BLOQUES: Bloque[] = [
  {
    hora: '08:30',
    titulo: 'Control de números (15 min)',
    icono: '📊',
    color: 'border-violet-500/30',
    items: [
      {
        id: 'roas_ayer',
        tiempo: 3,
        label: 'Revisar ROAS de ayer vs break-even',
        detalle: 'Si ROAS < break-even por 2 días seguidos → ir al War Room ahora mismo antes de seguir con el resto.',
        herramienta: 'Dashboard P&L',
        href: '/dashboard-pl',
        alerta: 'Si ROAS cayó > 30% vs ayer → acción inmediata',
      },
      {
        id: 'gasto_proyectado',
        tiempo: 2,
        label: 'Confirmar gasto proyectado del día',
        detalle: 'Verificar que el gasto diario en Meta está dentro del presupuesto planificado. Si ya superó el 60% del presupuesto antes del mediodía → revisar.',
        herramienta: 'Meta Ads Manager',
      },
      {
        id: 'tasa_entrega',
        tiempo: 2,
        label: 'Revisar tasa de entrega últimos 7 días',
        detalle: 'Si cayó más de 5 puntos respecto a la semana anterior → avisar al operador de pedidos que refuerce la confirmación telefónica COD.',
        herramienta: 'Logística COD',
        href: '/logistica-cod',
        alerta: 'Caída > 5 puntos = problema de targeting o producto',
      },
      {
        id: 'capital_disponible',
        tiempo: 2,
        label: 'Verificar capital disponible',
        detalle: 'Revisar saldo en la cuenta de Meta Ads y capital de trabajo disponible. Si Meta puede quedar sin saldo hoy → recargar ahora.',
        herramienta: 'Flujo de Caja',
        href: '/flujo-caja',
        alerta: 'Meta sin saldo = campañas pausadas = pérdida de aprendizaje',
      },
      {
        id: 'pedidos_pendientes',
        tiempo: 3,
        label: 'Revisar pedidos confirmados sin procesar',
        detalle: 'Ver pedidos en estado "confirmado" que no fueron enviados a Dropi aún. Recordar al operador de pedidos si hay alguno de más de 24hs sin procesar.',
        herramienta: 'Pedidos',
        href: '/pedidos',
      },
      {
        id: 'alertas_activas',
        tiempo: 1,
        label: 'Revisar alertas activas',
        detalle: 'Ver si alguna alerta configurada se disparó: ROAS bajo, frecuencia alta, presupuesto casi agotado.',
        herramienta: 'Alertas',
        href: '/alertas',
      },
    ],
  },
  {
    hora: '09:00',
    titulo: 'Decisiones de campaña (10 min)',
    icono: '🔴',
    color: 'border-red-500/25',
    items: [
      {
        id: 'war_room',
        tiempo: 5,
        label: 'War Room — acción sobre campañas urgentes',
        detalle: 'Campañas con ROAS < 0.8x por 2 días → pausar. Campañas con ROAS ≥ 1.5x por 3 días → proponer escala. No toques lo que está funcionando.',
        herramienta: 'War Room',
        href: '/war-room',
        alerta: 'Regla de oro: si dudás entre pausar o no → no pausar. El aprendizaje de Meta vale más que 1 día malo.',
      },
      {
        id: 'frecuencia_control',
        tiempo: 3,
        label: 'Controlar frecuencia por audiencia',
        detalle: 'Frecuencia > 3 en 7 días en una audiencia = empieza la fatiga. Frecuencia > 5 = creativo urgente nuevo o nueva audiencia.',
        herramienta: 'A/B Tracker',
        href: '/ab-tracker',
        alerta: 'Frecuencia > 5 = creativos nuevos esta semana sí o sí',
      },
      {
        id: 'creativos_fatiga',
        tiempo: 2,
        label: 'Revisar creativos con más de 14 días activos',
        detalle: 'Cualquier variante con 14+ días activos está entrando en zona de fatiga. Planificar la variante de reemplazo.',
        herramienta: 'A/B Tracker',
        href: '/ab-tracker',
      },
    ],
  },
  {
    hora: '10:00',
    titulo: 'Producción y contenido (10 min)',
    icono: '🎬',
    color: 'border-amber-500/25',
    items: [
      {
        id: 'pipeline_creativos',
        tiempo: 3,
        label: 'Revisar pipeline de creativos esta semana',
        detalle: 'Objetivo: mínimo 2 creativos nuevos por producto activo por semana. ¿Hay guiones asignados a creadores? ¿Cuándo entregan?',
        herramienta: 'Creadores UGC',
        href: '/creadores',
        alerta: 'Sin creativos nuevos esta semana → el ROAS va a caer la próxima',
      },
      {
        id: 'copies_pendientes',
        tiempo: 3,
        label: 'Verificar copies aprobados para subir',
        detalle: 'Si hay copies generados en la app pero no subidos a Meta Ads todavía → subir hoy. No dejar passes generados sin usar.',
        herramienta: 'Historial generaciones',
        href: '/historial',
      },
      {
        id: 'ugc_entrega',
        tiempo: 4,
        label: 'Revisar y aprobar videos UGC recibidos',
        detalle: 'Revisar videos recibidos de creadores. Criterios de aprobación: audio claro, sigue el guion, se ve auténtico, buena iluminación. Dar feedback específico si hay retoma.',
        herramienta: 'Creadores UGC',
        href: '/creadores',
      },
    ],
  },
  {
    hora: '15:00',
    titulo: 'Revisión de tarde (5 min)',
    icono: '🌅',
    color: 'border-teal-500/25',
    items: [
      {
        id: 'whatsapp_escalados',
        tiempo: 2,
        label: 'Resolver los 3 casos escalados de WhatsApp',
        detalle: 'El equipo de atención escala solo los casos que no pueden resolver: devoluciones, reclamos fuertes, o situaciones fuera del script. Resolver estos 3 y nada más.',
        herramienta: 'WhatsApp Business',
        alerta: 'Si hay más de 5 casos escalados → hay algo mal en el script o el producto',
      },
      {
        id: 'pedidos_rechazados',
        tiempo: 2,
        label: 'Revisar rechazos del día',
        detalle: 'Ver pedidos que llegaron como rechazados hoy. Si hay un patrón (misma ciudad, mismo producto, misma razón) → acción inmediata.',
        herramienta: 'Pedidos',
        href: '/pedidos',
        alerta: 'Más de 5 rechazos en el día → revisar el producto y el targeting',
      },
      {
        id: 'meta_pago',
        tiempo: 1,
        label: 'Confirmar que Meta tiene saldo para mañana',
        detalle: 'Verificar que la cuenta de Meta Ads no va a quedar en $0 durante la madrugada. Una campaña que se pausa sola por falta de saldo reinicia el aprendizaje.',
        herramienta: 'Meta Ads Manager',
        alerta: 'Meta pausa sola si se queda sin saldo — el algoritmo pierde el aprendizaje',
      },
    ],
  },
  {
    hora: 'Semanal',
    titulo: 'Revisión semanal — lunes 9am (45 min)',
    icono: '📅',
    color: 'border-blue-500/25',
    items: [
      {
        id: 'sem_portfolio',
        tiempo: 10,
        label: 'Actualizar Portfolio — estado de cada producto',
        detalle: 'Mover los productos entre estados: Testeando → Escalando → Mantenimiento → Pausado. Solo escalás si ROAS fue ≥ objetivo por 3+ días.',
        herramienta: 'Portfolio',
        href: '/portfolio',
      },
      {
        id: 'sem_postmortem',
        tiempo: 8,
        label: 'Post-mortem de campañas muertas',
        detalle: 'Por cada producto o campaña que murió esta semana → registrar qué funcionó, qué no, y qué harías diferente. Este archivo vale oro a largo plazo.',
        herramienta: 'Post-mortem',
        href: '/postmortem',
      },
      {
        id: 'sem_escalado',
        tiempo: 7,
        label: 'Calcular escalado de la semana siguiente',
        detalle: 'Para cada producto en escala → usar Presupuesto Escalado para calcular el siguiente step. Nunca escalés más del 30% semanal para no salir del aprendizaje.',
        herramienta: 'Presupuesto Escalado',
        href: '/presupuesto-escalado',
      },
      {
        id: 'sem_creativos',
        tiempo: 5,
        label: 'Planificar producción de creativos semana siguiente',
        detalle: 'Definir: cuántos creativos nuevos se necesitan, para qué producto, qué ángulo probar, qué creador lo hace. Generar los guiones ahora para que el creador empiece mañana.',
        herramienta: 'Creadores + UGC Creator',
        href: '/creadores',
      },
      {
        id: 'sem_cashflow',
        tiempo: 5,
        label: 'Revisar flujo de caja y capital de trabajo',
        detalle: 'Actualizar la proyección con los números reales de la semana. ¿Hay capital suficiente para el escalado planeado? ¿Cuándo llega el próximo pago de Dropi?',
        herramienta: 'Flujo de Caja',
        href: '/flujo-caja',
      },
      {
        id: 'sem_producto_nuevo',
        tiempo: 10,
        label: 'Decidir el producto nuevo a testear',
        detalle: 'Solo si hay capital disponible después del escalado planeado. Usar el Validador COD antes de decidir. Score mínimo 7/10.',
        herramienta: 'Dropi + Validador',
        href: '/dropi',
      },
    ],
  },
]

const TOTAL_MIN = BLOQUES.slice(0, 4).reduce((s, b) => s + b.items.reduce((ss, i) => ss + i.tiempo, 0), 0)

export default function RutinaDiariaPage() {
  const hoy = new Date().toISOString().split('T')[0]
  const storageKey = `rutina_${hoy}`
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [modo, setModo] = useState<'diario' | 'semanal'>('diario')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setChecked(JSON.parse(saved))
  }, [storageKey])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const resetear = () => {
    setChecked({})
    localStorage.removeItem(storageKey)
  }

  const bloquesActivos = modo === 'diario' ? BLOQUES.slice(0, 4) : [BLOQUES[4]]
  const todosLosItems = bloquesActivos.flatMap(b => b.items)
  const completados = todosLosItems.filter(i => checked[i.id]).length
  const pct = todosLosItems.length > 0 ? Math.round((completados / todosLosItems.length) * 100) : 0

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <Link href="/gestionar" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Gestionar</Link>
            <h1 className="text-2xl font-bold text-white mt-2">⚡ Rutina Operativa</h1>
            <p className="text-white/40 text-sm mt-1">El protocolo diario del operador de 7 cifras</p>
          </div>
          {completados > 0 && (
            <button onClick={resetear} className="text-xs text-white/30 hover:text-red-400 transition-colors mt-8">Resetear</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['diario', 'semanal'] as const).map(m => (
            <button key={m} onClick={() => setModo(m)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${modo === m ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/40 hover:text-white/70'}`}>
              {m === 'diario' ? `⚡ Rutina diaria (${TOTAL_MIN} min)` : '📅 Revisión semanal'}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="card border border-white/8 p-4 rounded-2xl mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">{completados}/{todosLosItems.length} tareas</span>
            <span className={`text-sm font-bold ${pct === 100 ? 'text-emerald-400' : 'text-white/70'}`}>{pct}% {pct === 100 ? '✅ Listo!' : ''}</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Bloques */}
        <div className="space-y-4">
          {bloquesActivos.map(bloque => {
            const bloqueCompletos = bloque.items.filter(i => checked[i.id]).length
            return (
              <div key={bloque.hora} className={`card border rounded-2xl overflow-hidden ${bloque.color}`}>
                <div className="p-4 flex items-center gap-3 border-b border-white/8">
                  <span className="text-xl">{bloque.icono}</span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{bloque.titulo}</p>
                    <p className="text-white/30 text-[10px]">{bloque.hora} · {bloqueCompletos}/{bloque.items.length} completado</p>
                  </div>
                  {bloqueCompletos === bloque.items.length && <span className="text-emerald-400 text-xs">✓</span>}
                </div>
                <div className="divide-y divide-white/5">
                  {bloque.items.map(item => (
                    <div key={item.id} className={`p-3 flex gap-3 transition-colors ${checked[item.id] ? 'bg-white/2 opacity-60' : ''}`}>
                      <button onClick={() => toggle(item.id)} className="flex-shrink-0 mt-0.5">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checked[item.id] ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-white/50'}`}>
                          {checked[item.id] && <span className="text-white text-[9px]">✓</span>}
                        </span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className={`text-xs font-medium ${checked[item.id] ? 'line-through text-white/30' : 'text-white/85'}`}>{item.label}</p>
                          <span className="text-[9px] text-white/25">{item.tiempo}min</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed">{item.detalle}</p>
                        {item.alerta && !checked[item.id] && (
                          <p className="text-[10px] text-amber-400/70 mt-1">⚠️ {item.alerta}</p>
                        )}
                        {item.href && !checked[item.id] && (
                          <Link href={item.href} className="text-[10px] text-violet-400 hover:text-violet-300 mt-1 inline-flex items-center gap-1">
                            Abrir {item.herramienta} →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {pct === 100 && (
          <div className="mt-4 card border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-2xl text-center">
            <p className="text-2xl mb-1">🏆</p>
            <p className="text-emerald-400 font-bold text-sm">Rutina completada</p>
            <p className="text-white/40 text-xs mt-0.5">El operador de 7 cifras ya terminó su trabajo del día.</p>
          </div>
        )}
      </main>
    </div>
  )
}
