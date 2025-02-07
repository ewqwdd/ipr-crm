interface HeadingProps {
  title?: string;
  description?: string;
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div className="sm:flex-auto">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
    </div>
  );
}
