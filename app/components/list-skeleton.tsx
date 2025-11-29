export const TranscriptionListSkeleton = () => {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="p-4 bg-gray-100 rounded-lg border border-gray-200 animate-pulse space-y-3 w-full"
        >
          <div className="h-4 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-300 rounded" />
          <div className="h-4 w-2/3 bg-gray-300 rounded" />
        </li>
      ))}
    </ul>
  );
};
