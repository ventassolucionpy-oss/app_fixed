'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { usePais } from '@/components/providers/PaisProvider'

type Item = { href: string; icon: string; bg: string; titulo: string; desc: string; badge?: string }

export default function GestionarPage() {
  const { cfg } = usePais()
  const [busqueda, setBusqueda] = useState('')

  const SECCIONES = [
    {
      titulo: '⚡ Revisión de hoy — hacé esto primero',
      desc: 'Las cosas que hay que mirar cada mañana',
      items: [
        { href: '/rutina-diaria', icon: '⚡', bg: 'bg-gradient-to-br from-amber-600 to-orange-600', titulo: 'Mi checklist de hoy (15 min)', desc: 'Las tareas del día en orden. Marcá cada una a medida que la hacés.', badge: '✅ Hacé esto primero' },
        { href: '/war-room', icon: '🔴', bg: 'bg-red-600', titulo: 'Cómo van mis anuncios hoy', desc: 'La IA analiza el estado de todas tus campañas y te dice qué pausar, qué escalar y qué cambiar.', badge: '📅 Revisar a diario' },
        { href: '/pedidos', icon: '📦', bg: 'bg-teal-600', titulo: 'Estado de mis pedidos', desc: `Ver qué pedidos en ${cfg.nombre} se entregaron, cuáles están en camino y cuáles se rechazaron.` },
        { href: '/alertas', icon: '🔔', bg: 'bg-amber-600', titulo: 'Mis alertas', desc: 'Si algo salió mal (el ROAS cayó, llegaste al límite de gasto), lo ves acá primero.' },
      ] as Item[],
    },
    {
      titulo: '💰 Mis números — cuánto gano',
      desc: 'Los resultados reales de tu negocio',
      items: [
        { href: '/dashboard-pl', icon: '💰', bg: 'bg-gradient-to-br from-emerald-600 to-teal-600', titulo: 'Cuánto gané hoy', desc: 'Ingresos del día, lo que gasté en anuncios y la ganancia real. El número que importa.' },
        { href: '/kpis', icon: '📊', bg: 'bg-gradient-to-br from-violet-600 to-indigo-600', titulo: 'Mis 5 números más importantes', desc: `ROAS, costo por pedido, tasa de entrega en ${cfg.nombre} y ganancia — los indicadores clave de tu negocio.` },
        { href: '/flujo-caja', icon: '💸', bg: 'bg-gradient-to-br from-emerald-600 to-teal-700', titulo: 'Proyección de capital para crecer', desc: 'Cuánto dinero necesitás tener disponible para poder escalar sin quedarte sin fondos.', badge: '🆕 Nuevo' },
        { href: '/logistica-cod', icon: '🗺️', bg: 'bg-gradient-to-br from-teal-600 to-emerald-700', titulo: `Tasa de entrega por ciudad en ${cfg.nombre}`, desc: 'En qué ciudades se entregan más pedidos y en cuáles conviene no invertir más en anuncios.', badge: '🆕 Nuevo' },
      ] as Item[],
    },
    {
      titulo: '📋 Mis productos y campañas',
      desc: 'El estado de todo lo que tenés activo',
      items: [
        { href: '/portfolio', icon: '📋', bg: 'bg-violet-700', titulo: 'Todos mis productos activos', desc: 'Una sola vista con el estado de cada producto: cuál está ganando, cuál pausar, cuál escalar.' },
        { href: '/ab-tracker', icon: '🔬', bg: 'bg-gradient-to-br from-blue-600 to-cyan-600', titulo: 'Qué anuncio funciona mejor', desc: 'Comparás dos versiones de tu anuncio y la app te dice cuál gana con datos reales.' },
        { href: '/pipeline-creativos', icon: '🎬', bg: 'bg-gradient-to-br from-rose-600 to-pink-600', titulo: 'Planilla de videos de esta semana', desc: 'Qué videos hay que crear, quién los graba y en qué estado están.', badge: '🆕 Nuevo' },
        { href: '/autopilot', icon: '🤖', bg: 'bg-gradient-to-br from-violet-700 to-purple-800', titulo: 'Reglas automáticas', desc: 'La app actúa sola: si el ROAS sube de X escala, si baja de Y pausa. Sin que tengas que estar mirando.' },
        { href: '/meta-tracker', icon: '📘', bg: 'bg-blue-600', titulo: 'Subir resultados de Meta Ads', desc: 'Descargás el archivo de resultados de Meta y la app lo analiza por vos.' },
      ] as Item[],
    },
    {
      titulo: '📈 Escalar y optimizar',
      desc: 'Para cuando querés crecer más',
      items: [
        { href: '/presupuesto-escalado', icon: '📈', bg: 'bg-emerald-700', titulo: 'Calcular cuánto escalar', desc: 'Si tu anuncio está funcionando, la app te dice exactamente cuánto subir el presupuesto sin romper el algoritmo.' },
        { href: '/roas-simulator', icon: '🎯', bg: 'bg-gradient-to-br from-violet-600 to-purple-700', titulo: 'Simular escenarios de ganancia', desc: `Con los números de ${cfg.nombre}: cuánto gastar en anuncios, cuántas ventas necesitás y cuánto vas a ganar.`, badge: '🆕 Nuevo' },
        { href: '/matriz-creativos', icon: '🔢', bg: 'bg-gradient-to-br from-indigo-600 to-violet-600', titulo: 'Cuántos anuncios necesito', desc: 'La matriz que te dice cuántos creativos distintos necesitás según tu presupuesto.' },
        { href: '/postmortem', icon: '📝', bg: 'bg-zinc-700', titulo: 'Qué aprendí de una campaña que no funcionó', desc: 'Un formulario para registrar por qué falló algo y qué no repetir la próxima vez.' },
      ] as Item[],
    },
    {
      titulo: '👥 Equipo y operación',
      desc: 'Para organizarte vos y las personas que trabajen con vos',
      items: [
        { href: '/equipo', icon: '👥', bg: 'bg-gradient-to-br from-violet-600 to-indigo-600', titulo: 'Roles y protocolos del equipo', desc: 'Quién hace qué, qué puede decidir cada persona y los pasos exactos para cada tarea.', badge: '🆕 Nuevo' },
        { href: '/creadores', icon: '🎭', bg: 'bg-gradient-to-br from-violet-600 to-rose-600', titulo: 'Mis creadores de video', desc: 'Los datos, tarifas e historial de cada persona que graba videos para vos.' },
        { href: '/proteccion-cuenta', icon: '🛡️', bg: 'bg-gradient-to-br from-red-700 to-red-800', titulo: 'Proteger mi cuenta de Facebook Ads', desc: 'Cómo evitar que te bloqueen la cuenta de anuncios y qué hacer si pasa.', badge: '🔴 Importante' },
        { href: '/meta-rechazos', icon: '🚫', bg: 'bg-red-600', titulo: 'Registro de anuncios rechazados', desc: 'Qué anuncios rechazó Meta, por qué, y cómo lo resolví para no repetir el error.', badge: '🆕 Nuevo' },
      ] as Item[],
    },
    {
      titulo: '📁 Historial y archivos',
      desc: 'Todo lo que generaste guardado',
      items: [
        { href: '/historial', icon: '📁', bg: 'bg-zinc-700', titulo: 'Mi historial de generaciones', desc: 'Todos los textos y contenidos que creaste, para volver a verlos o usarlos.' },
        { href: '/hooks-biblioteca', icon: '📚', bg: 'bg-violet-700', titulo: 'Mi biblioteca de hooks', desc: 'Los mejores textos de apertura de tus anuncios, guardados y buscables.' },
        { href: '/copy-intelligence', icon: '🧠', bg: 'bg-gradient-to-br from-violet-700 to-indigo-600', titulo: 'Qué textos funcionan mejor', desc: 'La IA analiza tus generaciones anteriores y te dice cuáles convierten más.' },
        { href: '/exportar', icon: '⬇️', bg: 'bg-zinc-600', titulo: 'Descargar mis generaciones en PDF', desc: 'Exportá cualquier texto generado para compartirlo o imprimirlo.' },
      ] as Item[],
    },
  ]

  const todasItems = SECCIONES.flatMap(s => s.items)
  const filtradas = busqueda
    ? todasItems.filter(i =>
        i.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.desc.toLowerCase().includes(busqueda.toLowerCase())
      )
    : null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-5">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Gestionar</h1>
          <p className="text-white/40 text-sm mt-1">
            Seguimiento de tu negocio en <span className="text-white/70">{cfg.nombre}</span> {cfg.bandera}
          </p>
        </div>

        {/* Buscador */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar... ej: pedidos, ganancia, equipo"
            className="w-full bg-white/6 border border-white/12 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 placeholder:text-white/25"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">✕</button>
          )}
        </div>

        {filtradas ? (
          <div className="space-y-2">
            {filtradas.length === 0 ? (
              <p className="text-center text-white/30 text-sm py-8">No encontramos esa herramienta</p>
            ) : filtradas.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-start gap-3 p-3.5 card rounded-xl border border-white/10 hover:border-white/25 transition-all">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-white text-lg flex-shrink-0`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-white text-sm font-semibold">{item.titulo}</p>
                    {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{item.badge}</span>}
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-white/20 text-xs flex-shrink-0 mt-1">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-7">
            {SECCIONES.map(s => (
              <div key={s.titulo}>
                <div className="mb-3">
                  <p className="text-white font-bold text-sm">{s.titulo}</p>
                  <p className="text-white/30 text-xs">{s.desc}</p>
                </div>
                <div className="space-y-2">
                  {s.items.map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-start gap-3 p-3.5 card rounded-xl border border-white/8 hover:border-white/20 transition-all">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-white text-lg flex-shrink-0`}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-white text-sm font-semibold leading-tight">{item.titulo}</p>
                          {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{item.badge}</span>}
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="text-white/20 text-xs flex-shrink-0 mt-1">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
