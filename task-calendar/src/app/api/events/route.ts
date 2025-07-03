import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error

    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: event, error } = await supabase
      .from('calendar_events')
      .insert([{
        title: body.title,
        start_time: body.start_time,
        end_time: body.end_time,
        event_date: body.event_date,
        color: body.color,
        is_task: body.is_task,
        task_id: body.task_id,
        can_overlap: body.can_overlap,
        priority: body.priority,
        user_id: '00000000-0000-0000-0000-000000000000' // Temporary user ID
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}