import { RadioGroup } from "@radix-ui/react-radio-group";
import { useState } from "react";
import { Label } from "recharts";

export default function BackgroundSelector({}) {
      const [backgroundColor, setBackgroundColor] = useState(1)
  // Helper to map 1-5 to grayscale hex
  const getGrayHex = (level: number) => {
    const gray = Math.round(((level - 1) / 4) * 255)
    return (gray << 16) | (gray << 8) | gray
  }

  const setBackground3DColor = (level: number) => {
    setBackgroundColor(getGrayHex(level));
  }
    
return (
<div className="w-full lg:w-full flex flex-col items-center">
          <Label className="block text-sm font-medium mb-4 text-foreground">Color de fondo del visor 3D</Label>
          <RadioGroup
            className="flex gap-4"
            value={String(backgroundColor)}
            onValueChange={(val) => setBackground3DColor(Number(val))}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex flex-col items-center">
                <input
                  type="radio"
                  id={`bg-${level}`}
                  name="background"
                  value={String(level)}
                  // checked={backgroundColor === level}
                  onChange={() => setBackground3DColor(level)}
                  className="sr-only"
                />
                <label htmlFor={`bg-${level}`} className="cursor-pointer flex flex-col items-center">
                  <span
                    className="w-8 h-8 rounded border-2 border-border block mb-1 hover:scale-110 transition-transform"
                    style={{
                      background: `#${getGrayHex(level).toString(16).padStart(6, "0")}`,
                      borderColor: backgroundColor === level ? "hsl(var(--primary))" : "hsl(var(--border))",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{level}</span>
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>)
}
