import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NoteItem } from './NoteItem';
import { Note } from '@/modules/notes/note.entity';
import { GripVertical } from 'lucide-react';


interface Props {
    note: Note;
    expanded?: boolean;
    layer?: number;
    isSelected?: boolean;
    onExpand?: (event: React.MouseEvent) => void;
    onCreate?: (event: React.MouseEvent) => void;
    onDelete?: (event: React.MouseEvent) => void;
    onClick?: () => void;
}


export const SortableNoteItem = (props: Props) => {
    const { note } = props;

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
    } = useSortable({ id: note.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <NoteItem
                {...props}
                dragHandle={
                    <span
                        onPointerDown={
                            listeners?.onPointerDown as React.PointerEventHandler<HTMLSpanElement>
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-grab mr-1"
                    >
                        <GripVertical size={14} />
                    </span>
                }
            />
        </div>
    );
};
