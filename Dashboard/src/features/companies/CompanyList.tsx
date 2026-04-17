import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, MoreVertical, Building2, Loader2, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { CompanyFormModal } from './CompanyFormModal';
// import { CompanyDetailsDrawer } from './CompanyDetailsDrawer';
import type { CompanyModel } from '../../types/admin';
import { getCompanies, deleteCompany } from '../../services/adminService';

export const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyModel | null>(null);

  // Pagination & Filters
  const [term, setTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize,] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCompaniesData = async () => {
    setIsLoading(true);
    try {
      const resp = await getCompanies({ pageNum, pageSize, term });
      if (resp.success) {
        setCompanies(resp.data);
        setTotalCount(resp.totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, [pageNum, pageSize, term]);

  const handleDelete = async (companyId: string) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(companyId);
        fetchCompaniesData(); // Refresh list
      } catch (error) {
        console.error("Failed to delete company", error);
        alert("Failed to delete company");
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">Manage transport companies</p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setPageNum(1); // Reset to page 1 on search
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reputation List</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading...
                  </td>
                </tr>
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{company.name}</div>
                          <div className="text-xs text-slate-500">{company.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">
                        {company.reputationScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {company.deletedAt && company.deletedAt !== "0001-01-01T00:00:00Z" ? (
                        <Badge variant="danger">Deleted</Badge>
                      ) : (
                        <Badge variant={company.status ? 'success' : 'warning'}>
                          {company.status ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{new Date(company.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => {
                          setSelectedCompany(company);
                          setIsFormOpen(true);
                        }}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(company.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && totalCount > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing {(pageNum - 1) * pageSize + 1} to {Math.min(pageNum * pageSize, totalCount)} of {totalCount} entries
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={pageNum === 1}
                onClick={() => setPageNum(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-700 font-medium px-2">
                Page {pageNum} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                disabled={pageNum === totalPages}
                onClick={() => setPageNum(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CompanyFormModal 
          isOpen={isFormOpen} 
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCompany(null);
            fetchCompaniesData();
          }} 
          company={selectedCompany}
        />
      )}
    </div>
  );
};