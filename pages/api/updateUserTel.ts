import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateUserInSupabase(userId: string, tel: string) {
    const { data, error } = await supabase
        .from('users')
        .update({ tel: tel })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error("Supabase update error:", error);
        throw new Error(error.message || 'Failed to update phone number in Supabase');
    }
    return data;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { userId, tel } = req.body;

    if (!userId || !tel) {
        return res.status(400).json({ error: 'Missing userId or tel in request body' });
    }

    try {
        const updatedUser = await updateUserInSupabase(userId, tel);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error as string || 'Internal Server Error' });
    }
}