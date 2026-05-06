'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePais } from '@/components/providers/PaisProvider'

// Rutas que son "hoja" — muestran botón de volver en lugar de tabs completos
const LEAF_ROUTES = [
  '/kpis', '/pedidos', '/hooks-biblioteca', '/comparador-copies', '/postmortem',
  '/presupuesto-escalado', '/alertas', '/portfolio', '/checkout-dropi', '/upsell',
  '/creativo-visual', '/testimonios', '/whatsapp-ventas', '/validador-producto',
  '/precios-psicologicos', '/calendario-contenido', '/contenido-imagen', '/productos',
  '/campana', '/landing', '/tiktok-shop', '/email-flows', '/whatsapp-biz',
  '/customer-service', '/temporadas', '/buyer-persona', '/sourcing', '/lanzar',
  '/nicho', '/rentabilidad', '/meta-tracker', '/tiktok-tracker', '/war-room',
  '/ab-tracker', '/copy-intelligence', '/spy', '/meta-ads-pro', '/organico',
  '/whatsapp-flows', '/oferta-flash', '/roas-simulator', '/logistica-cod',
  '/copy-scorer', '/ugc-review', '/creadores', '/dashboard-pl',
  '/equipo', '/flujo-caja', '/rutina-diaria', '/meta-rechazos',
  '/proteccion-cuenta', '/pipeline-creativos', '/confirmacion-cod',
  '/cro', '/oferta', '/postmortem', '/exportar', '/matriz-creativos',
  '/autopilot', '/flujo', '/aprender',
]

// Navegación principal — lenguaje simple
const NAV = [
  {
    href: '/inicio',
    icon: '🏠',
    title: 'Inicio',
    active: ['/inicio', '/dashboard', '/perfil'],
  },
  {
    href: '/que-vender',  // wizard principal
    icon: '🔍',
    title: 'Qué vender',
    active: ['/que-vender', '/dropi', '/sourcing', '/nicho', '/validador-producto',
             '/precios-psicologicos', '/rentabilidad', '/roas-simulator', '/lanzar',
             '/buyer-persona', '/flujo', '/productos'],
  },
  {
    href: '/mis-anuncios',  // wizard creacion
    icon: '📣',
    title: 'Mis anuncios',
    active: ['/mis-anuncios', '/crear', '/campana', '/creativos', '/landing',
             '/tiktok-shop', '/email-flows', '/whatsapp-biz', '/whatsapp-ventas',
             '/whatsapp-flows', '/customer-service', '/temporadas', '/testimonios',
             '/creativo-visual', '/contenido-imagen', '/oferta', '/oferta-flash',
             '/retencion', '/ugc-review', '/creadores', '/copy-scorer',
             '/upsell', '/checkout-dropi', '/confirmacion-cod'],
  },
  {
    href: '/mis-ventas',  // ventas y operacion
    icon: '💰',
    title: 'Mis ventas',
    active: ['/mis-ventas', '/gestionar', '/pedidos', '/dashboard-pl', '/war-room',
             '/ab-tracker', '/kpis', '/portfolio', '/logistica-cod', '/flujo-caja',
             '/rutina-diaria', '/pipeline-creativos', '/equipo', '/autopilot',
             '/meta-tracker', '/tiktok-tracker', '/meta-rechazos', '/proteccion-cuenta',
             '/presupuesto-escalado', '/matriz-creativos', '/postmortem', '/exportar',
             '/historial', '/alertas', '/comparador-copies', '/copy-intelligence',
             '/hooks-biblioteca', '/cro'],
  },
  {
    href: '/aprender',
    icon: '📚',
    title: 'Aprender',
    active: ['/aprender', '/meta-ads-pro', '/organico', '/spy',
             '/creativos/andromeda', '/calendario-contenido'],
  },
]

type Props = { userName?: string }

export default function Navbar({ userName }: Props) {
  const pathname = usePathname()
  const { pais, cfg, nombre } = usePais()

  const displayName = userName || nombre || ''
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const isActive = (item: typeof NAV[0]) =>
    item.active.some(a => pathname === a || pathname.startsWith(a + '/'))

  const isLeaf = LEAF_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    }
  }

  return (
    <header
      className="border-b border-white/5 px-3 h-14 flex items-center justify-between sticky top-0 z-50"
      style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Logo + back button */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isLeaf ? (
          <button onClick={handleBack}
            className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors py-1">
            <span className="text-base">←</span>
            <span className="text-xs hidden sm:block">Volver</span>
          </button>
        ) : (
          <Link href="/inicio" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-white text-sm tracking-tight hidden sm:block">Creatives Pro</span>
          </Link>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex items-center gap-0.5">
        {NAV.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all ${
                active
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-white/35 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className={`text-[9px] font-semibold leading-none ${active ? 'text-violet-300' : 'text-white/30'}`}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Right: country badge + profile */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* País badge — siempre visible */}
        <Link href="/perfil"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/8">
          <span className="text-sm">{cfg.bandera}</span>
          <span className="text-[10px] text-white/50 font-medium hidden sm:block">{cfg.nombre}</span>
        </Link>

        {/* Avatar */}
        <Link href="/perfil"
          className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-semibold text-violet-300 hover:bg-violet-600/50 transition-colors">
          {initials}
        </Link>
      </div>
    </header>
  )
}
