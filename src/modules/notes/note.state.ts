import { atom, useAtom } from "jotai";
import { Note } from "./note.entity";

const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
    const [notes, setNotes] = useAtom(noteAtom);

    const set = (newNotes: Note[]) => {
        setNotes((oldNotes) => {

            const combineNotes = [...oldNotes, ...newNotes];

            const uniqueNotes: { [key: number]: Note } = {};
            const idToIndexMap: { [id: number]: number } = {};
            let index = 0;

            for (const note of combineNotes) {
                const existingIndex = idToIndexMap[note.id];

                if (existingIndex === undefined) {
                    // 初登場の id
                    uniqueNotes[index] = note;
                    idToIndexMap[note.id] = index;
                    index++;
                } else {
                    // 並び順はそのまま、中身だけ最新に差し替え
                    uniqueNotes[existingIndex] = note;

                }
            }
            return Object.values(uniqueNotes)
        })

    }

    const deleteNote = (id: number) => {
        const findChildrenIds = (parentId: number): number[] => {
            const childrenIds = notes
                .filter((note) => note.parent_document == parentId)
                .map((child) => child.id);
            return childrenIds.concat(
                ...childrenIds.map((childId) => findChildrenIds(childId))
            )
        }
        const childrenIds = findChildrenIds(id)
        setNotes((oldNotes) =>
            oldNotes.filter((note) => ![...childrenIds, id].includes(note.id))
        )
    }

    const reorderWithinParent = (reordered: Note[]) => {
        // const others = notes.filter(
        //     n => n.parent_document !== parentId
        // );
        setNotes(
            [...reordered]
        )
        // return {
        //     notes: [...reordered],
        // };
    };
    const getOne = (id: number) => notes.find((note) => note.id == id);
    const clear = () => setNotes([])
    return {
        getAll: () => notes,
        getOne,
        set,
        delete: deleteNote,
        clear,
        reorderWithinParent: reorderWithinParent
    }


}