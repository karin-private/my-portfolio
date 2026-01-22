import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronRight, FileIcon, MoreHorizontal, Plus, Trash, Folder } from 'lucide-react';
import { Item } from '../SideBar/Item';
import { cn } from '@/lib/utils';
import { Note } from '@/modules/notes/note.entity';
import { useEffect, useState } from 'react';
import { noteRepository } from '@/modules/notes/noto.repository';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';



interface Props {
  note: Note;
  expanded?: boolean;
  layer?: number;
  isSelected?: boolean;
  onExpand?: (event: React.MouseEvent) => void;
  onCreate?: (event: React.MouseEvent) => void;
  onDelete?: (event: React.MouseEvent) => void;
  onClick?: () => void;
  dragHandle?: React.ReactNode;
}

export function NoteItem({
  note,
  onClick,
  layer = 0,
  expanded = false,
  isSelected = false,
  onCreate,
  onDelete,
  onExpand,
  dragHandle
}: Props) {
  const [isHoverd, setIsHoverd] = useState(false);
  const { currentUser } = useCurrentUserStore();
  const [children, setChildren] = useState<Note[]>([]);;

  useEffect(() => {
    const fetchChildren = async () => {
      const childrenArray = await noteRepository.find(
        currentUser!.id,
        note.id
      );

      // ここで state に入れる
      setChildren(childrenArray ?? []);
    };

    fetchChildren();
  }, [currentUser, note.id]);

  const getIcon = () => {
    if (children.length === 0) {
      return FileIcon
    } else {
      return expanded ? ChevronDown : isHoverd ? ChevronRight : Folder

    }
  }

  const menu = (
    <div className={cn('ml-auto flex items-center gap-x-2',
      !isHoverd && "opacity-0"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
          <div
            className="h-full ml-auto rounded-sm hover:bg-neutral-300"
            role="button"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="start"
          side="right"
          forceMount
        >
          <DropdownMenuItem onClick={onDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div
        className="h-full ml-auto rounded-sm hover:bg-neutral-300"
        role="button"
        onClick={onCreate}
      >
        <Plus className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );

  return (
    <div
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
      onClick={onClick}
      role="button"
      style={{ paddingLeft: layer != null ? `${layer * 12 + 12}px` : '12px' }}
    >
      <Item
        label={note.title ?? '無題'}
        icon={getIcon()}
        onIconClick={onExpand}
        trailingItem={menu}
        isActive={isHoverd || isSelected}
        leadingItem={
          dragHandle && (
            <span
              onClick={(e) => e.stopPropagation()}
              className="mr-1 flex items-center cursor-grab text-muted-foreground hover:text-foreground"
            >
              {dragHandle}
            </span>
          )
        }
      />
    </div>
  );
}