"use client"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Pipette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  presetColors?: string[]
}

export function ColorPicker({
  value,
  onChange,
  className,
  presetColors = [
    "#000000", // Noir
    "#ffffff", // Blanc
    "#f44336", // Rouge
    "#e91e63", // Rose
    "#9c27b0", // Violet
    "#673ab7", // Violet foncé
    "#3f51b5", // Indigo
    "#2196f3", // Bleu
    "#03a9f4", // Bleu clair
    "#00bcd4", // Cyan
    "#009688", // Teal
    "#4caf50", // Vert
    "#8bc34a", // Vert clair
    "#cddc39", // Lime
    "#ffeb3b", // Jaune
    "#ffc107", // Ambre
    "#ff9800", // Orange
    "#ff5722", // Orange foncé
    "#795548", // Marron
    "#9e9e9e", // Gris
    "#607d8b", // Bleu-gris
    "transparent", // Transparent
  ],
}: ColorPickerProps) {
  const [color, setColor] = useState(value || "#000000")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setColor(value || "#000000")
  }, [value])

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    handleColorChange(newColor)
  }

  const handlePresetClick = (presetColor: string) => {
    handleColorChange(presetColor)
    setIsOpen(false)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-8 h-8 p-0 border",
              color === "transparent" && "bg-transparent"
            )}
            style={{
              backgroundColor: color !== "transparent" ? color : undefined,
              backgroundImage:
                color === "transparent"
                  ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px"
                  : undefined,
            }}
            aria-label="Ouvrir le sélecteur de couleur"
          >
            <ChevronDown className="h-3 w-3 text-white mix-blend-difference" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded border",
                  color === "transparent" && "bg-transparent"
                )}
                style={{
                  backgroundColor: color !== "transparent" ? color : undefined,
                  backgroundImage:
                    color === "transparent"
                      ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px"
                      : undefined,
                }}
              />
              <div className="flex-1 flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={color}
                  onChange={handleInputChange}
                  className="h-8 font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => inputRef.current?.click()}
                >
                  <Pipette className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor) => (
                <Button
                  key={presetColor}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0 border",
                    presetColor === "transparent" && "bg-transparent",
                    color === presetColor && "ring-2 ring-primary"
                  )}
                  style={{
                    backgroundColor:
                      presetColor !== "transparent" ? presetColor : undefined,
                    backgroundImage:
                      presetColor === "transparent"
                        ? "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px"
                        : undefined,
                  }}
                  onClick={() => handlePresetClick(presetColor)}
                >
                  {color === presetColor && (
                    <Check className="h-3 w-3 text-white mix-blend-difference" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Input
        value={color}
        onChange={handleInputChange}
        className="flex-1 h-9"
      />
    </div>
  )
} 