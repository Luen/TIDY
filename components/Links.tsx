"use client"

import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SocialLinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu className="mr-2 h-4 w-4" />
          Social Links
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Facebook Groups</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/groups/1044042929275742/" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up Townsville
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/groups/598918515686528/" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up The Northern Territory
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/groups/306721937452648/" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up Victoria
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/groups/715453689381622/" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            The Townsville 3 Rivers Cleanup Campaign
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/groups/3709421559370480/" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up Tassie
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Facebook Pages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/TidyUpTSV" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up Townsville
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="https://www.facebook.com/profile.php?id=100080361439968" target="_blank" className="flex items-center">
            <FaFacebook className="mr-2 h-4 w-4" />
            TIDY Up Charters Towers
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Instagram</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="https://www.instagram.com/townsvilletidy/" target="_blank" className="flex items-center">
            <FaInstagram className="mr-2 h-4 w-4" />
            TIDY Up Townsville
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
