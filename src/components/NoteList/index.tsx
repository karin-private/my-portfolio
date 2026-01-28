import { cn } from '@/lib/utils';
import { SortableNoteItem } from './SortableNoteItem';
import { useNoteStore } from '@/modules/notes/note.state';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { noteRepository } from '@/modules/notes/noto.repository';
import { Note } from '@/modules/notes/note.entity';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';


interface NoteListProps {
  layer?: number;
  parentId?: number;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  const params = useParams();
  const id = params.id != null ? parseInt(params.id) : undefined;
  const navigate = useNavigate();
  const noteStore = useNoteStore()
  const notes = noteStore.getAll();
  const { currentUser } = useCurrentUserStore();
  const [expanded, setExpanded] = useState<Map<number, boolean>>(new Map())
  // {1: true, 2: true}


  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = notes.findIndex(n => n.id === active.id);
    const newIndex = notes.findIndex(n => n.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(notes, oldIndex, newIndex);

    noteStore.reorderWithinParent(reordered);
    let parentArray: number[] = [];
    let indexChild: number = -1;
    const orders = reordered.map((note, index) => {
      if (note.parent_document) {
        if (parentArray.includes(note.parent_document)) {
          indexChild++
          return {
            id: note.id,
            parent_document: note.parent_document,
            sort_order: indexChild,
            userId: note.user_id
          }
        } else {
          indexChild = -1
          parentArray.push(note.parent_document);
          indexChild++
          return {
            id: note.id,
            parent_document: note.parent_document,
            sort_order: 0,
            userId: note.user_id
          }
        }
      } else {
        return {
          id: note.id,
          parent_document: null,
          sort_order: index + 1,
          userId: note.user_id
        }
      }
    });
    parentArray = [];

    try {
      await noteRepository.updateOrder(orders);
    } catch (e) {
      console.error(e);
    }
  };


  const createChild = async (e: React.MouseEvent, parentId: number) => {
    e.stopPropagation();
    const newNote = await noteRepository.create(currentUser!.id, { parentId })
    noteStore.set([newNote])
    setExpanded((prev => prev.set(parentId, true)));
    moveToDetail(newNote.id)
  };

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const children = await noteRepository.find(currentUser!.id, note.id);
    if (children == null) return;
    noteStore.set(children);
    setExpanded((prev) => {
      const newExpanded = new Map(prev);
      newExpanded.set(note.id, !prev.get(note.id));
      return newExpanded;
    })
  }

  const moveToDetail = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  }

  const deleteNote = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation();
    await noteRepository.delete(noteId);
    noteStore.delete(noteId);
    navigate("/")
  }
  return (
    <>
      <p
        className={cn(
          `hidden text-sm font-medium text-muted-foreground/80`,
          layer === 0 && 'hidden'
        )}
        style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
      >
        ページがありません
      </p>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={notes.map(n => n.id)}
          strategy={verticalListSortingStrategy}
        >
          {notes
            .filter((note) => note.parent_document == parentId)
            .map((note) => {
              return (
                <div key={note.id}>
                  <SortableNoteItem
                    note={note}
                    layer={layer}
                    onCreate={(e) => createChild(e, note.id)}
                    onExpand={(e: React.MouseEvent) => fetchChildren(e, note)}
                    expanded={expanded.get(note.id)}
                    onClick={() => moveToDetail(note.id)}
                    onDelete={(e) => deleteNote(e, note.id)}
                    isSelected={id == note.id}
                  />
                  {expanded.get(note.id) && (
                    <NoteList layer={layer + 1} parentId={note.id} />
                  )}
                </div>
              );
            })}
        </SortableContext>
      </DndContext>
    </>
  );
}
