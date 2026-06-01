import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTable(table) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from(table).select('*').then(({ data }) => {
      setData(data || [])
      setLoading(false)
    })
  }, [table])

  const insert = async (row) => {
    const { data: newRow } = await supabase.from(table).insert(row).select().single()
    if (newRow) setData(prev => [...prev, newRow])
    return newRow
  }

  const update = async (id, changes) => {
    await supabase.from(table).update(changes).eq('id', id)
    setData(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r))
  }

  const remove = async (id) => {
    await supabase.from(table).delete().eq('id', id)
    setData(prev => prev.filter(r => r.id !== id))
  }

  return { data, loading, insert, update, remove }
}
