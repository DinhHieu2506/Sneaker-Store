import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={10}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className
      )}
      {...props}
    >
      {/* Track */}
      <SliderPrimitive.Track
        className="relative h-2 w-full grow rounded-full bg-gray-200"
      >
        {/* Active range */}
        <SliderPrimitive.Range className="absolute h-full bg-[#0b132b] rounded-full" />
      </SliderPrimitive.Track>

      {/* Thumbs */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block size-5 rounded-full bg-white border-2 border-[#0b132b] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0b132b]"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
