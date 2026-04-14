import React from 'react';
import { CustomerList } from '../features/customers/CustomerList';

export const CustomersPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CustomerList />
    </div>
  );
};
