import { FC } from 'react';

const SpecializationTableSkeleton: FC = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <tr key={index} className="border-b">
            <td className="p-3">
              <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
            </td>
            <td className="p-3">
              <div className="h-5 w-5 mx-auto bg-gray-300 rounded-full animate-pulse"></div>
            </td>
            <td className="p-3">
              <div className="h-5 w-5 mx-auto bg-gray-300 rounded-full animate-pulse"></div>
            </td>
            <td className="p-3">
              <div className="flex justify-center space-x-2">
                <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

export default SpecializationTableSkeleton;
