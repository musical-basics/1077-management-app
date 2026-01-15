"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getTemplates() {
    const { data, error } = await supabase
        .from('project_templates')
        .select('*, steps:template_tasks(*)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching templates:', error)
        return []
    }

    // Sort steps: Primary by sort_order, Secondary by created_at (stable sort)
    const formattedData = data.map((t: any) => ({
        ...t,
        steps: (t.steps || []).sort((a: any, b: any) => {
            const diff = (a.sort_order || 0) - (b.sort_order || 0)
            if (diff !== 0) return diff
            // If sort_order is same, sort by created_at
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
    }))

    return formattedData
}

export async function createTemplate(name: string, description: string, duration: number) {
    const { error } = await supabase
        .from('project_templates')
        .insert([{
            name,
            description,
            estimated_duration: duration
        }])

    if (error) throw error
    revalidatePath('/admin')
}

export async function updateTemplate(id: string, name: string, description: string, duration: number) {
    const { error } = await supabase
        .from('project_templates')
        .update({
            name,
            description,
            estimated_duration: duration
        })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
}

export async function deleteTemplate(id: string) {
    const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
}

export async function addTask(templateId: string) {
    const { error } = await supabase
        .from('template_tasks')
        .insert([
            {
                project_id: templateId,
                title: "New Task",
                duration: "5 min",
                sort_order: 999
            }
        ])

    if (error) throw error
    revalidatePath('/admin')
}

export async function updateTask(id: string, title: string, duration: string) {
    const { error } = await supabase
        .from('template_tasks')
        .update({ title, duration })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/admin')
}

export async function getShifts(start: Date, end: Date) {
    const { data: shifts, error } = await supabase
        .from('shifts')
        .select(`
            *,
            project:project_templates(name, estimated_duration),
            user:users(full_name)
        `)
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())

    if (error) {
        console.error('Error fetching shifts:', error)
        return []
    }

    return shifts
}

export async function createShift(data: {
    user_id?: string,
    project_template_id: string,
    start_time: Date,
    end_time_expected: Date,
    status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
}) {
    // If no user assigned, we might need a placeholder or allow null if schema permits
    // Current schema: user_id references users(id). It does NOT say 'not null' in schema provided earlier, 
    // but typically a shift needs a user. For drag-drop, we might create an "Unassigned" shift?
    // Let's check schema: "user_id uuid references users(id)" -> nullable by default.

    const { error } = await supabase
        .from('shifts')
        .insert([{
            project_template_id: data.project_template_id,
            start_time: data.start_time.toISOString(),
            end_time_expected: data.end_time_expected.toISOString(),
            status: data.status,
            user_id: data.user_id
        }])

    if (error) throw error
    revalidatePath('/admin')
}
