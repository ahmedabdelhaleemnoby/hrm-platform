import { Skeleton, TableCell, TableRow } from '@mui/material';
import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <>
      {Array.from(new Array(rows)).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from(new Array(columns)).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton animation="wave" height={24} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
