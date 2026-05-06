'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

type Rechazo = {
  id: string
  fecha: string
  producto: string
  tipo: 'copy' | 'imagen' | 'video' | 'landing' | 'claim' | 'audiencia'
  razon_meta: string
  fragmento_problematico: string
  como_se_resolvio: string
  tiempo_resolucion_hs: number
  resultado: 'aprobado_con_cambio' | 'reemplazado' | 'eliminado' | 'appeal_exitoso' | 'pendiente'
  aprendizaje: string
  pais: 'PY' | 'CO' | 'MX'
  categoria: string
}

// Base de conocimiento estática: patrones comunes de rechazo por nicho
const PATRONES_CONOCIDOS = [
  {
    categoria: 'Salud y belleza',
    nivel: 'Alto riesgo',
    color: 'border-red-500/30 bg-red-500/5',
    badge: '🔴 Alto riesgo',
    disparadores: [
      'Antes/después en imágenes (incluso implícitas)',
      '"Perder X kilos en Y días" — promesas numéricas',
      '"Cura", "trata", "elimina" referido a condiciones médicas',
      '"100% natural" sin certificación comprobable',
      '"Resultados garantizados" en productos de salud',
      'Imágenes de zonas del cuerpo (abdomen, glúteos) con foco en "problema"',
      'Testimonios médicos falsos o no verificables',
    ],
    como_evitar: [
      'Usar "ayuda a", "contribuye a", "apoya" en lugar de afirmaciones directas',
      'Mostrar el producto en uso, no el "resultado" en el cuerpo',
      'Enfocarse en la experiencia emocional, no en el cambio físico',
      'Nunca mostrar antes/después — ni en video ni en imagen',
    ],
  },
  {
    categoria: 'Urgencia y escasez',
    nivel: 'Medio riesgo',
    color: 'border-amber-500/30 bg-amber-500/5',
    badge: '🟡 Medio riesgo',
    disparadores: [
      '"Quedan solo X unidades" cuando es falso',
      '"Oferta termina hoy" que nunca termina',
      '"Precio especial solo por hoy" recurrente',
      'Contadores de tiempo regresivos falsos',
    ],
    como_evitar: [
      'La urgencia puede ser real (stock limitado de Dropi, precio de temporada)',
      'Usar fechas reales: "Hasta el viernes 14"',
      'Evitar el contador ficticio — Meta lo detecta cada vez más',
      'La escasez funciona cuando es genuina — no hay que inventarla',
    ],
  },
  {
    categoria: 'Claims financieros',
    nivel: 'Alto riesgo',
    color: 'border-red-500/30 bg-red-500/5',
    badge: '🔴 Alto riesgo',
    disparadores: [
      '"Ganá $X por día/semana/mes" sin contexto',
      '"Libertad financiera", "independencia económica"',
      'Imágenes de dinero, autos de lujo como promesa',
      '"Negocio desde casa" con promesas de ingresos',
    ],
    como_evitar: [
      'Enfocarse en el proceso y la herramienta, no en el resultado financiero prometido',
      'Testimonios reales con disclaimer ("resultados individuales varían")',
      'Evitar imágenes de billetes o lujo como representación del producto',
    ],
  },
  {
    categoria: 'Políticas generales Meta',
    nivel: 'Siempre presente',
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: '🔵 Siempre verificar',
    disparadores: [
      'Texto > 20% del área de la imagen (en videos menos crítico)',
      'Logos de Meta, Instagram, Facebook en el creativo',
      'Llamadas a la acción engañosas ("Hacé click para recibir gratis")',
      'URLs de landing que no coinciden con el dominio declarado',
      'Contenido de menores de edad sin contexto educativo claro',
      'Lenguaje discriminatorio o estereotipos',
    ],
    como_evitar: [
      'Mantener el texto en imagen al mínimo — el mensaje va en el copy',
      'Nunca usar branding de Meta en tus creativos',
      'La landing page debe coincidir con lo prometido en el ad',
      'Revisar siempre con la herramienta de previsualización de Meta antes de publicar',
    ],
  },
  {
    categoria: 'Ropa y suplementos',
    nivel: 'Medio riesgo',
    color: 'border-amber-500/30 bg-amber-500/5',
    badge: '🟡 Medio riesgo',
    disparadores: [
      'Imágenes con desnudo parcial (aunque sea modesto)',
      'Suplementos con claims de performance específica',
      '"Aumenta X% la masa muscular" sin respaldo',
      'Ropa interior o trajes de baño con posiciones sugestivas',
    ],
    como_evitar: [
      'Para ropa: mostrar el producto en contexto de uso cotidiano, no posado',
      'Para suplementos: enfocarse en ingredientes naturales, no en resultados numéricos',
      'Siempre revisar las políticas de publicidad de suplementos de Meta antes de lanzar',
    ],
  },
]

const TIPO_LABELS: Record<string, string> = {
  copy: '📝 Copy', imagen: '🖼️ Imagen', video: '🎬 Video',
  landing: '🌐 Landing', claim: '⚠️ Claim', audiencia: '👥 Audiencia',
}
const RESULTADO_LABELS: Record<string, string> = {
  aprobado_con_cambio: '✅ Aprobado con cambio',
  reemplazado: '🔄 Reemplazado',
  eliminado: '🗑️ Eliminado',
  appeal_exitoso: '🏆 Appeal exitoso',
  pendiente: '⏳ Pendiente',
}

const STORAGE_KEY = 'meta_rechazos_v1'

export default function MetaRechazosPage() {
  const [tab, setTab] = useState<'registro' | 'patrones' | 'nuevo'>('patrones')
  const [rechazos, setRechazos] = useState<Rechazo[]>([])
  const [form, setForm] = useState<Partial<Rechazo>>({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'copy', resultado: 'pendiente', pais: 'PY',
  })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setRechazos(JSON.parse(saved))
  }, [])

  const guardar = () => {
    if (!form.producto || !form.razon_meta || !form.fragmento_problematico) return
    const nuevo: Rechazo = { ...form as Rechazo, id: Date.now().toString() }
    const updated = [nuevo, ...rechazos]
    setRechazos(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setForm({ fecha: new Date().toISOString().split('T')[0], tipo: 'copy', resultado: 'pendiente', pais: 'PY' })
    setTab('registro')
  }

  const eliminar = (id: string) => {
    const updated = rechazos.filter(r => r.id !== id)
    setRechazos(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const set = (k: keyof Rechazo, v: string | number) => setForm(f => ({ ...f, [k]: v }))
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-red-500/50 placeholder:text-white/20'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <Link href="/gestionar" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Gestionar</Link>
          <h1 className="text-2xl font-bold text-white mt-2">🚫 Rechazos Meta & Políticas</h1>
          <p className="text-white/40 text-sm mt-1">Biblioteca de qué NO hacer + registro de rechazos propios</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white/5 p-1 rounded-xl">
          {([['patrones','📚 Qué evitar'],['registro','📋 Mis rechazos'],['nuevo','➕ Registrar']] as const).map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* PATRONES */}
        {tab === 'patrones' && (
          <div className="space-y-4">
            <div className="card border border-red-500/20 bg-red-500/5 p-3 rounded-xl">
              <p className="text-red-400 text-xs font-bold mb-1">⚠️ Por qué importa este módulo</p>
              <p className="text-white/50 text-xs leading-relaxed">Cada rechazo de Meta puede desencadenar una revisión manual de tu cuenta. Acumulá 5-10 rechazos en poco tiempo y Meta puede limitar o suspender tu cuenta publicitaria. Este módulo te muestra los patrones más comunes para evitarlos antes de publicar.</p>
            </div>
            {PATRONES_CONOCIDOS.map((p, i) => {
              const [open, setOpen] = useState(i === 0)
              return (
                <div key={p.categoria} className={`card border rounded-2xl overflow-hidden ${p.color}`}>
                  <button onClick={() => setOpen(o => !o)} className="w-full p-4 text-left flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-bold text-sm">{p.categoria}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">{p.badge}</span>
                      </div>
                    </div>
                    <span className="text-white/20 text-xs">{open ? '▲' : '▼'}</span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
                      <div>
                        <p className="text-[10px] text-red-400/70 uppercase tracking-wide mb-2">🚫 Qué dispara el rechazo</p>
                        <ul className="space-y-1">
                          {p.disparadores.map((d, j) => (
                            <li key={j} className="flex gap-2 text-xs text-white/65 leading-relaxed">
                              <span className="text-red-400 flex-shrink-0">✗</span>{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-400/70 uppercase tracking-wide mb-2">✅ Cómo evitarlo</p>
                        <ul className="space-y-1">
                          {p.como_evitar.map((d, j) => (
                            <li key={j} className="flex gap-2 text-xs text-white/65 leading-relaxed">
                              <span className="text-emerald-400 flex-shrink-0">✓</span>{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* REGISTRO */}
        {tab === 'registro' && (
          <div>
            {rechazos.length === 0 ? (
              <div className="text-center py-14">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-white/50 text-sm font-medium">Sin rechazos registrados</p>
                <p className="text-white/25 text-xs mt-1">Cuando Meta rechace un ad, registralo acá para aprender del patrón</p>
                <button onClick={() => setTab('nuevo')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-red-600/20 text-red-300 text-xs font-bold hover:bg-red-600/30 transition-colors">
                  + Registrar primer rechazo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/30 text-xs">{rechazos.length} rechazos registrados</p>
                {rechazos.map(r => (
                  <div key={r.id} className="card border border-white/8 p-4 rounded-2xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-bold text-sm">{r.producto}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-white/30">{r.fecha}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/50">{TIPO_LABELS[r.tipo]}</span>
                          <span className="text-[10px] text-white/30">{r.pais}</span>
                        </div>
                      </div>
                      <button onClick={() => eliminar(r.id)} className="text-white/20 hover:text-red-400 text-xs">✕</button>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-red-500/8 rounded-lg p-2">
                        <p className="text-[10px] text-red-400/60 mb-0.5">Razón Meta</p>
                        <p className="text-xs text-white/60">{r.razon_meta}</p>
                      </div>
                      <div className="bg-amber-500/8 rounded-lg p-2">
                        <p className="text-[10px] text-amber-400/60 mb-0.5">Fragmento problemático</p>
                        <p className="text-xs text-white/60 italic">"{r.fragmento_problematico}"</p>
                      </div>
                      {r.como_se_resolvio && (
                        <div className="bg-emerald-500/8 rounded-lg p-2">
                          <p className="text-[10px] text-emerald-400/60 mb-0.5">Cómo se resolvió · {RESULTADO_LABELS[r.resultado]}</p>
                          <p className="text-xs text-white/60">{r.como_se_resolvio}</p>
                        </div>
                      )}
                      {r.aprendizaje && (
                        <p className="text-[11px] text-white/35 italic">💡 {r.aprendizaje}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NUEVO */}
        {tab === 'nuevo' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Producto *</label>
                <input value={form.producto || ''} onChange={e => set('producto', e.target.value)} placeholder="Ej: Faja moldeadora" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Fecha</label>
                <input type="date" value={form.fecha || ''} onChange={e => set('fecha', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Tipo de contenido rechazado</label>
                <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className={inputCls}>
                  {Object.entries(TIPO_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-zinc-900">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">País</label>
                <select value={form.pais} onChange={e => set('pais', e.target.value)} className={inputCls}>
                  {['PY','CO','MX'].map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Razón que dio Meta *</label>
              <input value={form.razon_meta || ''} onChange={e => set('razon_meta', e.target.value)} placeholder="Ej: Tu anuncio puede contener afirmaciones de salud" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Fragmento problemático *</label>
              <textarea value={form.fragmento_problematico || ''} onChange={e => set('fragmento_problematico', e.target.value)} rows={2}
                placeholder="El texto o descripción exacta que causó el rechazo" className={inputCls + ' resize-none'} />
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Cómo se resolvió</label>
              <textarea value={form.como_se_resolvio || ''} onChange={e => set('como_se_resolvio', e.target.value)} rows={2}
                placeholder="Qué cambio hiciste para que Meta lo aprobara" className={inputCls + ' resize-none'} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Resultado</label>
                <select value={form.resultado} onChange={e => set('resultado', e.target.value)} className={inputCls}>
                  {Object.entries(RESULTADO_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-zinc-900">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 mb-1 block">Tiempo resolución (hs)</label>
                <input type="number" value={form.tiempo_resolucion_hs || ''} onChange={e => set('tiempo_resolucion_hs', +e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Aprendizaje para el equipo</label>
              <textarea value={form.aprendizaje || ''} onChange={e => set('aprendizaje', e.target.value)} rows={2}
                placeholder="¿Qué no volvería a hacer? ¿Qué le diría al equipo?" className={inputCls + ' resize-none'} />
            </div>
            <button onClick={guardar} disabled={!form.producto || !form.razon_meta || !form.fragmento_problematico}
              className="w-full py-3 rounded-xl bg-red-600/20 text-red-300 text-sm font-bold hover:bg-red-600/30 transition-colors disabled:opacity-40">
              Guardar rechazo
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
