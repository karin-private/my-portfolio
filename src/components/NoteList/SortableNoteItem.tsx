import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NoteItem } from './NoteItem';
import { Note } from '@/modules/notes/note.entity';


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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <NoteItem {...props} />
        </div>
    );
};
