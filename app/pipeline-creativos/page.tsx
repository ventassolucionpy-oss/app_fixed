'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type EstadoCreativo = 'pendiente_guion' | 'guion_listo' | 'en_produccion' | 'entregado' | 'en_revision' | 'aprobado' | 'subido_meta' | 'activo' | 'pausado'
type FormatoCreativo = 'ugc_testimonial' | 'ugc_unboxing' | 'ugc_tutorial' | 'ugc_problema_solucion' | 'estatico_producto' | 'estatico_oferta' | 'carrusel' | 'reels_organico'

type Creativo = {
  id: string
  semana: string
  producto: string
  formato: FormatoCreativo
  angulo: string
  hook: string
  creador: string
  estado: EstadoCreativo
  fecha_limite: string
  fecha_entrega?: string
  notas: string
  resultado_roas?: number
  resultado_ctr?: number
}

const ESTADO_LABELS: Record<EstadoCreativo, string> = {
  pendiente_guion: '📝 Pendiente guión',
  guion_listo: '✅ Guión listo',
  en_produccion: '🎬 Filmando',
  entregado: '📥 Entregado',
  en_revision: '👀 En revisión',
  aprobado: '✅ Aprobado',
  subido_meta: '📤 Subido a Meta',
  activo: '🟢 Activo',
  pausado: '⏸️ Pausado',
}
const ESTADO_COLOR: Record<EstadoCreativo, string> = {
  pendiente_guion: 'text-white/40 bg-white/8',
  guion_listo: 'text-blue-400 bg-blue-500/15',
  en_produccion: 'text-amber-400 bg-amber-500/15',
  entregado: 'text-violet-400 bg-violet-500/15',
  en_revision: 'text-orange-400 bg-orange-500/15',
  aprobado: 'text-teal-400 bg-teal-500/15',
  subido_meta: 'text-indigo-400 bg-indigo-500/15',
  activo: 'text-emerald-400 bg-emerald-500/15',
  pausado: 'text-white/30 bg-white/5',
}
const FORMATO_LABELS: Record<FormatoCreativo, string> = {
  ugc_testimonial: '🎤 UGC Testimonio',
  ugc_unboxing: '📦 UGC Unboxing',
  ugc_tutorial: '📚 UGC Tutorial',
  ugc_problema_solucion: '💡 UGC Problema/Solución',
  estatico_producto: '🖼️ Imagen producto',
  estatico_oferta: '⚡ Imagen oferta',
  carrusel: '🔄 Carrusel',
  reels_organico: '🌱 Reels orgánico',
}

const VELOCIDAD_OBJETIVO = {
  '1_producto': 2,
  '2_productos': 5,
  '3_mas_productos': 8,
}

const STORAGE_KEY = 'pipeline_creativos_v1'
const getSemanaActual = () => {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`
}
const formatSemana = (s: string) => {
  const [year, w] = s.split('-W')
  return `Semana ${w} · ${year}`
}

export default function PipelineCreativosPage() {
  const [creativos, setCreativos] = useState<Creativo[]>([])
  const [semanaFiltro, setSemanaFiltro] = useState(getSemanaActual())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Creativo>>({
    semana: getSemanaActual(), estado: 'pendiente_guion',
    formato: 'ugc_testimonial',
    fecha_limite: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
  })
  const semanaActual = getSemanaActual()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setCreativos(JSON.parse(saved))
  }, [])

  const save = (arr: Creativo[]) => { setCreativos(arr); localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }

  const guardar = () => {
    if (!form.producto || !form.angulo) return
    const nuevo: Creativo = { ...form as Creativo, id: Date.now().toString() }
    save([nuevo, ...creativos])
    setShowForm(false)
    setForm({ semana: getSemanaActual(), estado: 'pendiente_guion', formato: 'ugc_testimonial', fecha_limite: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0] })
  }

  const avanzar = (id: string) => {
    const order: EstadoCreativo[] = ['pendiente_guion','guion_listo','en_produccion','entregado','en_revision','aprobado','subido_meta','activo']
    const c = creativos.find(c => c.id === id)!
    const idx = order.indexOf(c.estado)
    if (idx < order.length - 1) save(creativos.map(cc => cc.id === id ? { ...cc, estado: order[idx + 1] } : cc))
  }

  const set = (k: keyof Creativo, v: string | number) => setForm(f => ({ ...f, [k]: v }))
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-violet-500 placeholder:text-white/20'

  const creativosSemana = creativos.filter(c => c.semana === semanaFiltro)
  const activos = creativosSemana.filter(c => c.estado === 'activo' || c.estado === 'subido_meta').length
  const enProd = creativosSemana.filter(c => ['en_produccion','entregado','en_revision'].includes(c.estado)).length
  const pendientes = creativosSemana.filter(c => ['pendiente_guion','guion_listo'].includes(c.estado)).length
  const vencidos = creativosSemana.filter(c => c.fecha_limite < new Date().toISOString().split('T')[0] && !['activo','pausado','subido_meta'].includes(c.estado)).length

  const semanasUnicas = [...new Set(creativos.map(c => c.semana))].sort().reverse().slice(0, 8)
  if (!semanasUnicas.includes(semanaActual)) semanasUnicas.unshift(semanaActual)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <Link href="/gestionar" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Gestionar</Link>
            <h1 className="text-2xl font-bold text-white mt-2">🎬 Pipeline de Creativos</h1>
            <p className="text-white/40 text-sm mt-1">Sistema de producción semanal — del guión al ad activo</p>
          </div>
          <button onClick={() => setShowForm(s => !s)}
            className="px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition-colors mt-8">
            + Agregar
          </button>
        </div>

        {/* Velocidad objetivo */}
        <div className="card border border-violet-500/20 bg-violet-500/5 p-3 rounded-xl mb-4">
          <p className="text-violet-300 text-xs font-bold mb-2">🎯 Velocidad mínima de producción</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(VELOCIDAD_OBJETIVO).map(([k, v]) => (
              <div key={k} className="text-center">
                <p className="text-white font-bold text-sm">{v}</p>
                <p className="text-white/30 text-[9px]">{k.replace(/_/g, ' ').replace('1 ', '1 ').replace('2 ', '2 ').replace('3 mas ', '3+ ')}/semana</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-[10px] mt-2 text-center">creativos nuevos mínimos por semana según cantidad de productos activos</p>
        </div>

        {/* Selector de semana */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {semanasUnicas.map(s => (
            <button key={s} onClick={() => setSemanaFiltro(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${semanaFiltro === s ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-white/40 hover:text-white/60 border border-transparent'}`}>
              {s === semanaActual ? '⚡ Esta semana' : formatSemana(s)}
            </button>
          ))}
        </div>

        {/* Stats de la semana */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { val: activos, label: 'Activos', color: 'text-emerald-400' },
            { val: enProd, label: 'En prod.', color: 'text-amber-400' },
            { val: pendientes, label: 'Pendientes', color: 'text-blue-400' },
            { val: vencidos, label: 'Vencidos', color: vencidos > 0 ? 'text-red-400' : 'text-white/30' },
          ].map(s => (
            <div key={s.label} className="card p-2 rounded-xl text-center">
              <p className={`text-base font-bold ${s.color}`}>{s.val}</p>
              <p className="text-[9px] text-white/30">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="card border border-violet-500/30 bg-violet-500/5 p-4 rounded-2xl mb-4 space-y-3">
            <p className="text-white font-bold text-xs">Nuevo creativo</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Producto *</label>
                <input value={form.producto || ''} onChange={e => set('producto', e.target.value)} placeholder="Ej: Faja moldeadora" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Creador</label>
                <input value={form.creador || ''} onChange={e => set('creador', e.target.value)} placeholder="Nombre del creador" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Formato</label>
              <select value={form.formato} onChange={e => set('formato', e.target.value)} className={inputCls}>
                {Object.entries(FORMATO_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-zinc-900">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Ángulo / Concepto *</label>
              <input value={form.angulo || ''} onChange={e => set('angulo', e.target.value)} placeholder="Ej: Mamá de 3 hijos recupera la confianza" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Hook de apertura</label>
              <input value={form.hook || ''} onChange={e => set('hook', e.target.value)} placeholder="Los primeros 3 segundos del video" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Fecha límite</label>
                <input type="date" value={form.fecha_limite || ''} onChange={e => set('fecha_limite', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Semana</label>
                <select value={form.semana} onChange={e => set('semana', e.target.value)} className={inputCls}>
                  {semanasUnicas.map(s => <option key={s} value={s} className="bg-zinc-900">{s === semanaActual ? '⚡ Esta semana' : formatSemana(s)}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={guardar} disabled={!form.producto || !form.angulo}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold disabled:opacity-40">Agregar</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-white/50 text-xs">Cancelar</button>
            </div>
          </div>
        )}

        {/* Lista */}
        {creativosSemana.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-white/50 text-sm">Sin creativos esta semana</p>
            <p className="text-white/25 text-xs mt-1">Planificá la producción al inicio de cada semana</p>
            <div className="flex gap-2 justify-center mt-4">
              <Link href="/creativos/ugc-creator" className="px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 text-xs font-bold">Generar guión UGC</Link>
              <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-white/8 text-white/60 text-xs">Agregar manual</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {creativosSemana.map(c => {
              const vencido = c.fecha_limite < new Date().toISOString().split('T')[0] && !['activo','pausado','subido_meta'].includes(c.estado)
              return (
                <div key={c.id} className={`card border rounded-2xl p-3 ${vencido ? 'border-red-500/30' : 'border-white/8'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-bold text-xs">{c.producto}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${ESTADO_COLOR[c.estado]}`}>{ESTADO_LABELS[c.estado]}</span>
                        {vencido && <span className="text-[9px] text-red-400">⚠️ Vencido</span>}
                      </div>
                      <p className="text-white/40 text-[10px]">{FORMATO_LABELS[c.formato]} · {c.angulo}</p>
                      {c.hook && <p className="text-white/25 text-[10px] italic mt-0.5">"{c.hook}"</p>}
                      <div className="flex items-center gap-3 mt-1">
                        {c.creador && <span className="text-white/30 text-[10px]">👤 {c.creador}</span>}
                        <span className="text-white/25 text-[10px]">📅 {c.fecha_limite}</span>
                        {c.resultado_roas && <span className="text-emerald-400 text-[10px]">ROAS {c.resultado_roas}x</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {!['activo','pausado'].includes(c.estado) && (
                      <button onClick={() => avanzar(c.id)} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors">
                        Avanzar →
                      </button>
                    )}
                    {c.estado === 'guion_listo' && (
                      <Link href={`/creativos/ugc-creator?angulo=${encodeURIComponent(c.angulo)}&producto=${encodeURIComponent(c.producto)}`}
                        className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white/8 text-white/50 hover:bg-white/12 transition-colors">
                        Ver guión
                      </Link>
                    )}
                    <button onClick={() => save(creativos.filter(cc => cc.id !== c.id))}
                      className="ml-auto text-[10px] px-2 py-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/creadores" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-violet-500/30 transition-all">
            <span>🎭</span><div><p className="text-white text-xs font-bold">Creadores</p><p className="text-white/30 text-[10px]">Asignar guiones</p></div>
          </Link>
          <Link href="/creativos/ugc-creator" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-rose-500/30 transition-all">
            <span>✦</span><div><p className="text-white text-xs font-bold">Generar guión</p><p className="text-white/30 text-[10px]">UGC Creator IA</p></div>
          </Link>
        </div>
      </main>
    </div>
  )
}
