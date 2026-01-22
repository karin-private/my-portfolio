import { supabase } from "@/lib/supabase";

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
    const query = supabase.from('notes').select().eq("user_id", userId).order("sort_order", { ascending: true });
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
      .order('sort_order', { ascending: true })
    );
    return data
  },

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
  },

  async updateOrder(
    orders: { id: number; parent_document?: number | null; sort_order: number; userId: string }[],
  ) {
    const payload = orders.map(o => ({
      id: o.id,
      parent_document: o.parent_document,
      sort_order: o.sort_order,
      user_id: o.userId, // ⭐ 必須
    }));

    const { error } = await supabase
      .from('notes')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
  }


}
