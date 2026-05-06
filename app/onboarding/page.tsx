'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PAISES, type Pais } from '@/lib/constants'

type Paso = 'bienvenida' | 'nombre' | 'pais' | 'experiencia' | 'listo'

const PAIS_DATA = [
  {
    codigo: 'PY' as Pais,
    bandera: '🇵🇾',
    nombre: 'Paraguay',
    desc: 'Vendo en Paraguay usando Dropi Paraguay',
    color: 'border-red-500/40 bg-red-500/8',
    detalle: 'Precios en Guaraníes · Entrega 1-3 días hábiles',
  },
  {
    codigo: 'CO' as Pais,
    bandera: '🇨🇴',
    nombre: 'Colombia',
    desc: 'Vendo en Colombia usando Dropi Colombia',
    color: 'border-amber-500/40 bg-amber-500/8',
    detalle: 'Precios en Pesos colombianos · Entrega 2-4 días',
  },
  {
    codigo: 'MX' as Pais,
    bandera: '🇲🇽',
    nombre: 'México',
    desc: 'Vendo en México usando Dropi México',
    color: 'border-emerald-500/40 bg-emerald-500/8',
    detalle: 'Precios en Pesos mexicanos · Entrega 2-5 días',
  },
]

const EXPERIENCIA_OPTS = [
  {
    v: 'nuevo',
    emoji: '🌱',
    titulo: 'Soy nuevo en esto',
    desc: 'Nunca vendí por internet o recién estoy empezando. Necesito que me expliquen todo.',
  },
  {
    v: 'algo',
    emoji: '⚡',
    titulo: 'Ya vendí algo antes',
    desc: 'Hice alguna venta o probé anuncios, pero quiero mejorar mis resultados.',
  },
  {
    v: 'experto',
    emoji: '🏆',
    titulo: 'Tengo experiencia',
    desc: 'Manejo campañas activamente y quiero escalar mi operación.',
  },
]

export default function OnboardingPage() {
  const [paso, setPaso] = useState<Paso>('bienvenida')
  const [nombre, setNombre] = useState('')
  const [pais, setPais] = useState<Pais | null>(null)
  const [experiencia, setExperiencia] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const guardarYEntrar = async () => {
    if (!pais) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: nombre.trim() || 'Vendedor',
        pais,
        nivel: experiencia || 'nuevo',
        onboarding_done: true,
        updated_at: new Date().toISOString(),
      })
      // Set cookie for SSR
      document.cookie = `pais=${pais};path=/;max-age=31536000`
    }
    setSaving(false)
    router.push('/inicio')
  }

  const cfg = pais ? PAISES[pais] : null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'radial-gradient(ellipse at 50% -20%, #1e0a3c 0%, #080808 70%)' }}>
      <div className="w-full max-w-sm animate-fade-up">

        {/* PASO 1: Bienvenida */}
        {paso === 'bienvenida' && (
          <div className="text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-white mb-3">¡Bienvenido!</h1>
            <p className="text-white/60 text-base leading-relaxed mb-2">
              Esta aplicación te va a ayudar a <strong className="text-white">vender productos por internet</strong> en Paraguay, Colombia o México.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              No necesitás saber nada de tecnología. Te guiamos paso a paso desde encontrar qué vender hasta cobrar tu primer pago.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { icon: '🔍', texto: 'Encontrás un producto para vender' },
                { icon: '📣', texto: 'Creás los anuncios con ayuda de la IA' },
                { icon: '📦', texto: 'Dropi se encarga de enviar a tus clientes' },
                { icon: '💰', texto: 'Cobrás la ganancia directamente' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-xl flex-shrink-0">{s.icon}</span>
                  <p className="text-white/70 text-sm text-left">{s.texto}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setPaso('nombre')}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-all">
              Empezar →
            </button>
          </div>
        )}

        {/* PASO 2: Nombre */}
        {paso === 'nombre' && (
          <div>
            <button onClick={() => setPaso('bienvenida')} className="text-white/30 text-sm mb-6 block">← Volver</button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-white mb-2">¿Cómo te llamás?</h2>
              <p className="text-white/40 text-sm">Así te saludamos cada vez que entrés</p>
            </div>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre o apodo"
              className="w-full bg-white/8 border border-white/15 rounded-2xl px-5 py-4 text-white text-lg focus:outline-none focus:border-violet-500 placeholder:text-white/25 mb-6"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && nombre.trim() && setPaso('pais')}
            />
            <button
              onClick={() => setPaso('pais')}
              disabled={!nombre.trim()}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-all disabled:opacity-40">
              Continuar →
            </button>
            <button onClick={() => setPaso('pais')} className="w-full py-3 text-white/30 text-sm mt-2">
              Saltar por ahora
            </button>
          </div>
        )}

        {/* PASO 3: País — EL MÁS IMPORTANTE */}
        {paso === 'pais' && (
          <div>
            <button onClick={() => setPaso('nombre')} className="text-white/30 text-sm mb-6 block">← Volver</button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🌎</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {nombre.trim() ? `${nombre.split(' ')[0]}, ¿` : '¿'}en qué país vas a vender?
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Toda la aplicación se va a adaptar a tu país: los precios, los cálculos, los textos de venta y las recomendaciones.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {PAIS_DATA.map(p => (
                <button
                  key={p.codigo}
                  onClick={() => setPais(p.codigo)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${pais === p.codigo ? p.color + ' border-opacity-100' : 'border-white/10 bg-white/3 hover:border-white/25'}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">{p.bandera}</span>
                    <div>
                      <p className="text-white font-bold text-base">{p.nombre}</p>
                      <p className="text-white/50 text-xs">{p.detalle}</p>
                    </div>
                    {pais === p.codigo && (
                      <span className="ml-auto text-emerald-400 text-lg">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {cfg && (
              <div className="bg-violet-500/10 border border-violet-500/25 rounded-xl p-3 mb-4 text-center">
                <p className="text-violet-300 text-xs">
                  {cfg.bandera} Todo se mostrará en <strong>{cfg.moneda}</strong> · Flete estimado: <strong>{cfg.simbolo}{cfg.flete_dropi.toLocaleString()}</strong>
                </p>
              </div>
            )}
            <button
              onClick={() => setPaso('experiencia')}
              disabled={!pais}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-all disabled:opacity-40">
              {pais ? `Vender en ${PAISES[pais].nombre} →` : 'Elegí un país para continuar'}
            </button>
          </div>
        )}

        {/* PASO 4: Experiencia */}
        {paso === 'experiencia' && (
          <div>
            <button onClick={() => setPaso('pais')} className="text-white/30 text-sm mb-6 block">← Volver</button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">¿Cuánto sabés de ventas online?</h2>
              <p className="text-white/40 text-sm">Para mostrarte por dónde empezar</p>
            </div>
            <div className="space-y-3 mb-6">
              {EXPERIENCIA_OPTS.map(e => (
                <button key={e.v} onClick={() => setExperiencia(e.v)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${experiencia === e.v ? 'border-violet-500/60 bg-violet-500/10' : 'border-white/10 bg-white/3 hover:border-white/25'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl flex-shrink-0">{e.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{e.titulo}</p>
                      <p className="text-white/45 text-xs leading-relaxed mt-0.5">{e.desc}</p>
                    </div>
                    {experiencia === e.v && <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPaso('listo')}
              disabled={!experiencia}
              className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-base hover:bg-violet-500 transition-all disabled:opacity-40">
              Continuar →
            </button>
          </div>
        )}

        {/* PASO 5: Listo */}
        {paso === 'listo' && pais && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Todo listo{nombre.trim() ? `, ${nombre.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Vas a vender en <strong className="text-white">{PAISES[pais].nombre}</strong> {PAISES[pais].bandera}<br />
              Toda la app está adaptada a tu país.
            </p>

            <div className="space-y-2 mb-8 text-left">
              <p className="text-white/30 text-xs uppercase tracking-wider font-bold mb-3 text-center">Tu primer paso recomendado</p>
              {experiencia === 'nuevo' && (
                <>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-lg">🔍</span>
                    <div>
                      <p className="text-white text-sm font-bold">Buscar un producto para vender</p>
                      <p className="text-white/40 text-xs">La app te guía para encontrar algo rentable en Dropi {PAISES[pais].nombre}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-lg">📋</span>
                    <div>
                      <p className="text-white text-sm font-bold">Ver cómo funciona todo</p>
                      <p className="text-white/40 text-xs">El flujo completo de cero a tu primera venta</p>
                    </div>
                  </div>
                </>
              )}
              {experiencia === 'algo' && (
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="text-white text-sm font-bold">Crear tu primera campaña mejorada</p>
                    <p className="text-white/40 text-xs">Anuncios, WhatsApp y emails en un solo lugar</p>
                  </div>
                </div>
              )}
              {experiencia === 'experto' && (
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="text-white text-sm font-bold">Ir directamente al War Room</p>
                    <p className="text-white/40 text-xs">Decisiones de campaña y escala de hoy</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={guardarYEntrar} disabled={saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : '¡Entrar a la aplicación →'}
            </button>
          </div>
        )}

        {/* Indicador de progreso */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {(['bienvenida','nombre','pais','experiencia','listo'] as Paso[]).map((p, i) => (
            <div key={p} className={`rounded-full transition-all ${paso === p ? 'w-6 h-2 bg-violet-500' : 'w-2 h-2 bg-white/15'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
