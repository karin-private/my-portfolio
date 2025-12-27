import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { BlockNoteView } from '@blocknote/mantine';
// import { ja } from '@blocknote/core/locales';
import * as locales from '@blocknote/core/locales';
import { supabase } from '@/lib/supabase';
const { ja } = locales;

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string | null;
}

function Editor({ onChange, initialContent }: EditorProps) {
  function sanitizeFileName(name: string) {
    return encodeURIComponent(name.replace(/\s+/g, "_"));
  }

  const editor = useCreateBlockNote({
    dictionary: ja,
    initialContent: initialContent != null ? JSON.parse(initialContent) : undefined,
    uploadFile: async (file: File) => {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      // 1. Supabaseにアップロード
      const { data, error } = await supabase.storage
        .from("notion-images") // バケット名
        .upload(`private/${fileName}`, file);

      if (error) throw error;

      // 2. 公開URLを返す
      const { data: publicUrl } = supabase.storage
        .from("notion-images")
        .getPublicUrl(data.path);

      return publicUrl.publicUrl; // BlockNoteがプレビュー表示に利用
    },
  })
  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document))}
        theme="light"
      />
    </div>
  );
}



export default Editor;
