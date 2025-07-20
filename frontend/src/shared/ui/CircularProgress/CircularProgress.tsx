import { cva } from '@/shared/lib/cva';

interface ProgressProps {
  percent?: number;
  color?: string;
  backgroundColor?: string;
  centerColor?: string;
  textColor?: string;
  reverse?: boolean;
  className?: string;
  size?: number | string;
  thickness?: number | string;
  showPercent?: boolean;
}

export default function CircularProgress({
  percent = 0,
  color = 'rgb(79 70 229)',
  backgroundColor = 'rgb(229 231 235)',
  centerColor = '#fff',
  textColor = '#374151',
  reverse = false,
  className,
  size = 48,
  thickness = 8,
  showPercent,
}: ProgressProps) {
  const normalizedPercent = Math.min(Math.max(percent, 0), 100);
  const angle = (normalizedPercent / 100) * 360;

  const sizePx = typeof size === 'number' ? `${size}px` : size;
  const thicknessPx =
    typeof thickness === 'number' ? `${thickness}px` : thickness;

  const getGradient = () => {
    if (reverse) {
      return `conic-gradient(from 90deg, ${color} 0deg, ${color} ${angle}deg, ${backgroundColor} ${angle}deg, ${backgroundColor} 360deg)`;
    }
    return `conic-gradient(from 90deg, ${backgroundColor} 0deg, ${backgroundColor} ${360 - angle}deg, ${color} ${360 - angle}deg, ${color} 360deg)`;
  };

  const centerSize = `calc(${sizePx} - 2 * ${thicknessPx})`;

  return (
    <div
      className={cva(
        'relative flex items-center justify-center rounded-full',
        className,
      )}
      style={{ width: sizePx, height: sizePx }}
    >
      <div
        className="rounded-full -rotate-90"
        style={{
          width: sizePx,
          height: sizePx,
          background: getGradient(),
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: centerSize,
          height: centerSize,
          left: `calc(50% - (${centerSize} / 2))`,
          top: `calc(50% - (${centerSize} / 2))`,
          background: centerColor,
        }}
      />
      {showPercent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium" style={{ color: textColor }}>
            {Math.round(normalizedPercent)}%
          </span>
        </div>
      )}
    </div>
  );
}
