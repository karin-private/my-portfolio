import { supabase } from "@/lib/supabase";
import { Trophy } from "lucide-react";

export const noteRepository = {
  async create(userId: string, params: { title?: string; parentId?: number }) {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: userId,
          title: params.title,
          parent_document: params.parentId,
        },
      ])
      .select()
      .single();
    if (error != null) throw new Error(error.message);
    return data;
  },

  async find(userId: string, parantDocumentId?: number) {
    const query = supabase.from('notes').select().eq("user_id", userId).order("created_at", { ascending: false });

    const { data } = parantDocumentId != null ? await query.eq("parent_document", parantDocumentId) : await query.is('parent_document', null);
    return data;
  },

  async findOne(userId: string, id: number) {
    const { data } = await supabase.from('notes').select().eq('id', id).eq('user_id', userId).single();
    return data
  },

  async findByKeyword(userId: string, keyword: string) {
    const { data } = (await supabase
      .from('notes')
      .select().eq('user_id', userId)
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .order('created_at', { ascending: false })
    );
    return data
  },
  // async update(id: number, note: { title?: string; content?: string }) {
  //   const { data } = await supabase.from('notes').update(note).eq('id', id).select().single();
  //   return data;

  // }
  async update(id: number, note: { title?: string; content?: string }) {
    const { data } = await supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .select()
      .single();
    return data;
  },
  async delete(id: number) {
    const { error } = await supabase.rpc('delete_children_notes_recursively', {
      note_id: id
    })
    if (error !== null) throw new Error(error.message);
    return true;
  }

}
