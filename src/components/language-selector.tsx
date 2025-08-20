"use client"

import * as React from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { languages, type Language } from "@/lib/languages"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LanguageSelectorProps {
  selectedLanguage: Language
  onLanguageChange: (language: Language) => void
  className?: string
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange,
  className 
}: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLanguage.flag}</span>
            <span className="truncate">{selectedLanguage.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <ScrollArea className="h-[300px]">
              <CommandGroup>
                {languages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.name}
                    onSelect={() => {
                      onLanguageChange(language)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedLanguage.code === language.code 
                          ? "opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    <span className="text-lg mr-2">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {language.nativeName}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}