'use server'

import { supabase } from '@/lib/supabase'

export async function submitTimeLog(hours: number, minutes: number) {
    console.log('Submitting time log:', { hours, minutes })

    // 1. Convert to total minutes
    const totalMinutes = (hours * 60) + minutes

    // TODO: Get the actual current user ID. 
    // For now, we'll need to assume there's a way to get it, or hardcode a placeholder if auth isn't set up.
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) throw new Error('Not authenticated')
    // const userId = user.id

    // valid placeholder UUID for development/testing if auth is not ready
    // You should replace this with actual auth logic
    const userId = '00000000-0000-0000-0000-000000000000'

    // 2. Fetch user's profile for min_guarantee_minutes and hourly_rate
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('hourly_rate_cents, min_guarantee_minutes')
        .eq('id', userId)
        .single()

    if (profileError || !userProfile) {
        // If dev user doesn't exist, create it
        if (userId === '00000000-0000-0000-0000-000000000000') {
            console.log('Dev user not found, creating...')
            const { error: createError } = await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: 'dev@example.com',
                    full_name: 'Dev User',
                    role: 'assistant',
                    hourly_rate_cents: 2500,
                    min_guarantee_minutes: 120
                })

            if (createError) {
                console.error('Failed to create dev user:', createError)
                throw new Error('Failed to create dev user')
            }
            // Continue with defaults after creation
        } else {
            console.error('Error fetching user profile:', profileError)
        }
    }

    const hourlyRateCents = userProfile?.hourly_rate_cents || 2500 // Default $25.00
    const minGuaranteeMinutes = userProfile?.min_guarantee_minutes || 120 // Default 2 hours

    // 3. Apply the Guarantee
    // Compare calculated minutes vs min_guarantee
    // Pay defaults to the larger of the two
    const payableMinutes = Math.max(totalMinutes, minGuaranteeMinutes)

    // 4. Calculate Pay
    // (payableMinutes / 60) * hourlyRate
    // We do this in integer math to avoid floating point weirdness with cents, but division is tricky.
    // Formula: (minutes / 60) * cents => (minutes * cents) / 60
    const totalPayCents = Math.round((payableMinutes * hourlyRateCents) / 60)

    // 5. Insert into Supabase
    const { error: insertError } = await supabase
        .from('time_logs')
        .insert({
            user_id: userId,
            date_worked: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            duration_minutes: totalMinutes,
            payable_minutes: payableMinutes,
            total_pay_cents: totalPayCents
        })

    if (insertError) {
        console.error('Error inserting time log:', insertError)
        throw new Error('Failed to save time log')
    }

    return { success: true, totalPayCents, payableMinutes }
}
