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
