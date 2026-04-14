import React from 'react';
import { CompanyList } from '../features/companies/CompanyList';

export const CompaniesPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CompanyList />
    </div>
  );
};
