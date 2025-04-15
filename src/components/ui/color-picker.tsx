import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded-md border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-24 rounded-md border px-2 text-sm"
          placeholder="#000000"
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 right-0 top-full mt-2">
          <div className="bg-background p-4 rounded-lg shadow-lg">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
}; 