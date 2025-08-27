import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const status = searchParams.get('status');
    const templateId = searchParams.get('template_id');

    let query = supabase
      .from('email_records')
      .select('*')
      .order('sent_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (templateId) {
      query = query.eq('template_id', templateId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: "Failed to fetch email records" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data, 
      count,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error("Error fetching email records:", error);
    return NextResponse.json(
      { error: "Failed to fetch email records" },
      { status: 500 }
    );
  }
}
