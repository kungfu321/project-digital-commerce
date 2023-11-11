"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckIcon,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImageIcon,
  Italic,
  LinkIcon,
  ListIcon,
  ListOrdered,
  Pilcrow,
  Quote,
  Strikethrough,
  Underline,
  YoutubeIcon
} from "lucide-react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";

interface MenuBarProps extends React.HTMLAttributes<HTMLElement> {
  editor: any;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, className }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL', previousUrl);

    if (url === null) {
      return null;
    }

    if (url === '') {
      return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  };

  const menus = [
    {
      divider: true,
      child: [
        {
          icon: Pilcrow,
          name: "Paragraph",
          action: () => editor.chain().focus().setParagraph().run(),
          isActive: () => editor.isActive('paragraph'),
        },
        {
          icon: Heading1,
          name: "Heading 1",
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
          icon: Heading2,
          name: "Heading 2",
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
          icon: Heading3,
          name: "Heading 3",
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => editor.isActive('heading', { level: 3 }),
        },
        {
          icon: Heading4,
          name: "Heading 4",
          action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: () => editor.isActive('heading', { level: 4 }),
        },
        {
          icon: Quote,
          name: "Quote",
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive('blockquote'),
        },
      ]
    },
    {
      icon: Bold,
      name: "Bold",
      action: () => editor.chain().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: Italic,
      name: "Italic",
      action: () => editor.chain().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: Underline,
      name: "Underline",
      action: () => editor.chain().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      icon: Strikethrough,
      name: "strike",
      action: () => editor.chain().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: Code,
      name: "Code",
      action: () => editor.chain().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      divider: true,
    },
    {
      showIcon: true,
      child: [
        {
          icon: AlignLeft,
          name: "Left",
          action: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: () => editor.isActive({ textAlign: 'left' }),
        },
        {
          icon: AlignRight,
          name: "Right",
          action: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: () => editor.isActive({ textAlign: 'right' }),
        },
        {
          icon: AlignCenter,
          name: "Center",
          action: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: () => editor.isActive({ textAlign: 'center' }),
        },
        {
          icon: AlignJustify,
          name: "Justify",
          action: () => editor.chain().focus().setTextAlign('justify').run(),
          isActive: () => editor.isActive({ textAlign: 'justify' }),
        },
      ]
    },
    {
      icon: ListIcon,
      name: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      name: "Order List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
      divider: true,
    },
    {
      icon: LinkIcon,
      name: "Link",
      action: () => setLink(),
      isActive: () => editor.isActive('link'),
    },
    {
      icon: ImageIcon,
      name: "Image",
      action: () => addImage(),
      isActive: () => editor.isActive('image'),
    },
    {
      icon: YoutubeIcon,
      name: "YouTube",
      action: () => addYoutubeVideo(),
      isActive: () => editor.isActive('youtube'),
    },
  ];

  const findCurrentActiveName = (values: typeof menus, showIcon?: boolean) => {
    const [current] = values.filter((item) => item?.isActive && item?.isActive());

    if (showIcon && current?.icon) {
      const IconComp = current?.icon;
      return <IconComp size={18} />
    }

    return current?.name;
  }

  return (
    <div className={cn(
      "relative flex items-center p-1 space-x-1 flex-wrap",
      className
    )}>
      {
        menus.map((menu, index) => <div key={index} className={cn(
          menu?.divider && "border-r pr-1 mr-1"
        )}>
          {
            menu?.child &&
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  size="sm"
                  className="w-fit justify-between"
                >
                  {findCurrentActiveName(menu?.child, menu?.showIcon)}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Command>
                  <CommandGroup>
                    {menu.child.map((menuChild) => (
                      <CommandItem
                        key={menuChild.name}
                        value={menuChild.name}
                        onSelect={menuChild.action}
                      >
                        <menuChild.icon className="mr-2" size={18} />
                        {!menu?.showIcon && menuChild?.name}
                        <CheckIcon
                          className={cn(
                            "ml-4 h-4 w-4",
                            menuChild.isActive() ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          }

          {
            menu?.name &&
            <Toggle
              key={menu.name}
              aria-label={menu.name}
              pressed={menu.isActive()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.action();
              }}
              size="sm">
              <menu.icon size={18} />
            </Toggle>
          }
        </div>)
      }
    </div>
  )
}

export default MenuBar;
