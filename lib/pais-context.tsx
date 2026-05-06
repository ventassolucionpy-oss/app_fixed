'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { getPaisConfig, type Pais, type PaisConfig } from '@/lib/constants'

type PaisContextType = {
  pais: Pais
  cfg: PaisConfig
  setPais: (p: Pais) => void
  nombre: string
  loading: boolean
}

const PaisContext = createContext<PaisContextType>({
  pais: 'PY',
  cfg: getPaisConfig('PY'),
  setPais: () => {},
  nombre: '',
  loading: true,
})

export function PaisProvider({ children }: { children: ReactNode }) {
  const [pais, setPaisState] = useState<Pais>('PY')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 1. Read from cookie first (fastest)
    const cookiePais = document.cookie.split(';').find(c => c.trim().startsWith('pais='))?.split('=')[1]
    if (cookiePais && ['PY','CO','MX'].includes(cookiePais)) {
      setPaisState(cookiePais as Pais)
    }

    // 2. Always sync from DB (source of truth)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('profiles').select('pais, name').eq('id', user.id).single()
        .then(({ data }) => {
          if (data?.pais && ['PY','CO','MX'].includes(data.pais)) {
            setPaisState(data.pais as Pais)
            document.cookie = `pais=${data.pais};path=/;max-age=31536000`
          }
          if (data?.name) setNombre(data.name.split(' ')[0])
          setLoading(false)
        })
    })
  }, [])

  const setPais = (p: Pais) => {
    setPaisState(p)
    document.cookie = `pais=${p};path=/;max-age=31536000`
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from('profiles').update({ pais: p }).eq('id', user.id)
    })
  }

  return (
    <PaisContext.Provider value={{ pais, cfg: getPaisConfig(pais), setPais, nombre, loading }}>
      {children}
    </PaisContext.Provider>
  )
}

export const usePais = () => useContext(PaisContext)
