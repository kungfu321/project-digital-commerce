'use client';

import { User } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firstLetters } from '@/lib/utils';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

interface UserDropdownProps {
  userInfo: User
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userInfo }) => {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token');
    router.refresh();
    router.push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-12 h-12 cursor-pointer">
          <AvatarImage src={userInfo?.imageUrl || ''} />
          <AvatarFallback>{firstLetters(userInfo?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[10rem]">
        <DropdownMenuLabel>{userInfo?.name || userInfo?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown;
