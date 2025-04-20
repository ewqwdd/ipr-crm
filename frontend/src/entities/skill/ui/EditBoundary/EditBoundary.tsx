interface EditBoundaryProps {
  boundary: number;
  setBoundary: React.Dispatch<React.SetStateAction<number>>;
}

export default function EditBoundary({
  boundary,
  setBoundary,
}: EditBoundaryProps) {
  return (
    <>
      <p className="text-gray-900 text-sm">
        <span className="font-medium">Граница оценки: </span>
        <span className="text-indigo-600">{boundary}</span>
      </p>

      <input
        className="w-full"
        type="range"
        min="1"
        max="5"
        value={boundary}
        step={1}
        onChange={(e) => setBoundary(parseInt(e.target.value))}
      />
    </>
  );
}
