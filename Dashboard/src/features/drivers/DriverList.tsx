import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader2, Search, ChevronLeft, ChevronRight, ChevronDown, Trash2, Building2 } from 'lucide-react';
import type { DriverModel, CompanyModel } from '../../types/admin';
import { getDriversByCompany, deleteDriver, getCompanies } from '../../services/adminService';

export const DriverList: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  const [drivers, setDrivers] = useState<DriverModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  // Pagination & Filters
  const [term, setTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize,] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Load companies for the dropdown
    const loadCompanies = async () => {
      try {
        const resp = await getCompanies({ pageNum: 1, pageSize: 100 });
        if (resp.success) {
          setCompanies(resp.data);
          if (resp.data.length > 0) {
            setSelectedCompanyId(resp.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, []);
  const fetchDriversData = async () => {
    if (!selectedCompanyId) return;

    setIsLoading(true);
    try {
      const resp = await getDriversByCompany(selectedCompanyId, { pageNum, pageSize, term });
      if (resp.success) {
        setDrivers(resp.data);
        setTotalCount(resp.totalCount);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompanyId) {
      fetchDriversData();
    } else {
      setDrivers([]);
      setTotalCount(0);
    }
  }, [pageNum, pageSize, term, selectedCompanyId]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await deleteDriver(id);
        fetchDriversData();
      } catch (error) {
        console.error('Failed to delete driver', error);
        alert('Failed to delete driver');
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage registered drivers by company</p>
        </div>

        {/* Company Selector */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700 min-w-[200px]"
              value={selectedCompanyId}
              onChange={(e) => {
                setSelectedCompanyId(e.target.value);
                setPageNum(1);
              }}
              disabled={isLoadingCompanies}
            >
              <option value="">Select a Company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers in this company..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setPageNum(1);
              }}
              disabled={!selectedCompanyId}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!selectedCompanyId ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    Please select a company from the dropdown to view its drivers.
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading drivers...
                  </td>
                </tr>
              ) : drivers && drivers.length > 0 ? (
                drivers.map((driver) => {
                  const isDeleted = driver.deletedAt !== null && driver.deletedAt !== "0001-01-01T00:00:00Z";
                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                            {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{driver.name || 'No Name'}</div>
                            <div className="text-xs text-slate-500">{driver.phoneNumber}</div>
                            {driver.company && (
                              <div className="text-[10px] text-indigo-500 font-bold mt-1">
                                {driver.company.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">{driver.carBrand} {driver.carModel}</div>
                        <div className="text-xs text-slate-500 bg-slate-100 uppercase tracking-widest inline-block px-1 rounded mt-1">{driver.carLicensePlate}</div>
                      </td>
                      <td className="px-6 py-4">
                        {isDeleted ? (
                          <Badge variant="danger">Deleted</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 font-medium">
                          {driver.comfortScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isDeleted && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(driver.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No drivers found for this company.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalCount > 0 && selectedCompanyId && (
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
    </div>
  );
};
