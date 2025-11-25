"use client"

import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ProductControlsProps {
  width: number
  setWidth: (width: number) => void
  height: number
  setHeight: (height: number) => void
  depth: number
  setDepth: (depth: number) => void
  ledColor: string
  setLedColor: (color: string) => void
  frameColor: string
  setFrameColor: (color: string) => void
}

export default function ProductControls({
  width,
  setWidth,
  height,
  setHeight,
  depth,
  setDepth,
  ledColor,
  setLedColor,
  frameColor,
  setFrameColor,
}: ProductControlsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="width">Ancho</Label>
          <span className="text-gray-400">{width} cm</span>
        </div>
        <Slider
          id="width"
          min={30}
          max={120}
          step={1}
          value={[width]}
          onValueChange={(value) => setWidth(value[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="height">Alto</Label>
          <span className="text-gray-400">{height} cm</span>
        </div>
        <Slider
          id="height"
          min={30}
          max={120}
          step={1}
          value={[height]}
          onValueChange={(value) => setHeight(value[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="depth">Profundidad</Label>
          <span className="text-gray-400">{depth} cm</span>
        </div>
        <Slider
          id="depth"
          min={1.5}
          max={5}
          step={0.1}
          value={[depth]}
          onValueChange={(value) => setDepth(value[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-3">
        <Label>Color de LED (referencial)</Label>
        <RadioGroup value={ledColor} onValueChange={setLedColor} className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rainbow" id="rainbow" />
            <Label htmlFor="rainbow" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full"></div>
              Arcoíris
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="white" id="white" />
            <Label htmlFor="white" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-white rounded-full"></div>
              Blanco
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <Label htmlFor="blue" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></div>
              Azul
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
              Verde
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="purple" id="purple" />
            <Label htmlFor="purple" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-purple-500 rounded-full"></div>
              Púrpura
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pink" id="pink" />
            <Label htmlFor="pink" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-pink-500 rounded-full"></div>
              Rosa
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3 color-options">
        <Label>Color del marco (referencial) </Label>
        <RadioGroup value={frameColor} onValueChange={setFrameColor} className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="black" id="black" />
            <Label htmlFor="black" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-black border-white"></div>
              Blanco
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="white" id="white" />
            <Label htmlFor="white" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-white border-black"></div>
              Blanco
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blue" id="blue" />
            <Label htmlFor="blue" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-blue-900"></div>
              Azul
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-green-800"></div>
              Verde
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yellow" id="yellow" />
            <Label htmlFor="yellow" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-yellow-400"></div>
              Púrpura
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="purple" id="purple" />
            <Label htmlFor="purple" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-purple-800"></div>
              Púrpura
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pink" id="pink" />
            <Label htmlFor="pink" className="flex items-center">
              <div className="w-4 h-4 mr-2 bg-pink-300"></div>
              Rosa
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bluehammered" id="bluehammered" />
            <Label htmlFor="bluehammered" className="flex items-center">
              <div className="w-4 h-4 mr-2 bluehammered"></div>
              Martillado Azul
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="greenhammered" id="greenhammered" />
            <Label htmlFor="greenhammered" className="flex items-center">
              <div className="w-4 h-4 mr-2 greenhammered"></div>
              Martillado Verde
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
