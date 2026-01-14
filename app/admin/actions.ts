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

    // Sort steps using JS since simpler than advanced SQL ordering for nested relations in basic query
    const formattedData = data.map((t: any) => ({
        ...t,
        steps: (t.steps || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
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
