import { type Material } from '@/entities/material';
import { materialTypes } from '@/entities/material/model/types';
import { FC } from 'react';
import { Link } from 'react-router';

type MaterialType = Material['contentType'];

type MaterialTypeProps = {
  contentType?: MaterialType;
  url?: string;
};

const MaterialType: FC<MaterialTypeProps> = ({ contentType, url }) => {
  const children = contentType ? materialTypes[contentType] : null;
  return (
    <div className="text-sm text-gray-500">
      {url ? (
        <Link to={url} target="_blank" className="text-indigo-500">
          {children}
        </Link>
      ) : (
        children
      )}
    </div>
  );
};

export default MaterialType;
