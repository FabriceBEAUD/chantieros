import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import * as mock from '../data/mock'

const MOCK_TABLES = {
  chantiers: mock.chantiers,
  situations: mock.situations,
  pointages: mock.pointages,
  habilitations: mock.habilitations,
  incidents: mock.incidents,
  ao: mock.ao_data,
  ao_data: mock.ao_data,
  materiel: mock.materiel_data,
  materiel_data: mock.materiel_data,
}

export function useTable(table) {
  const mockData = MOCK_TABLES[table] || []
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.from(table).select('*').then(({ data: rows }) => {
      if (rows && rows.length > 0) setData(rows)
      setLoading(false)
    })
  }, [table])

  const insert = async (row) => {
    if (!supabase) {
      const newRow = { ...row, id: Date.now() }
      setData(prev => [...prev, newRow])
      return newRow
    }
    const { data: newRow } = await supabase.from(table).insert(row).select().single()
    if (newRow) setData(prev => [...prev, newRow])
    return newRow
  }

  const update = async (id, changes) => {
    if (!supabase) {
      setData(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r))
      return
    }
    await supabase.from(table).update(changes).eq('id', id)
    setData(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r))
  }

  const remove = async (id) => {
    if (!supabase) {
      setData(prev => prev.filter(r => r.id !== id))
      return
    }
    await supabase.from(table).delete().eq('id', id)
    setData(prev => prev.filter(r => r.id !== id))
  }

  return { data, loading, insert, update, remove }
}
