import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, Phone, Car, TrendingUp, Loader2, Search, ChevronLeft, ChevronRight, Trash2, Link } from 'lucide-react';
import type { DriverModel } from '../../types/admin';
import { getDriversByCompany, deleteDriver, linkDriverCompany } from '../../services/adminService';

// Note: To list ALL drivers we don't have a direct endpoint in API-Admin.md, it says GET /ByCompany/{companyId}.
// Wait, the documentation says "Get Driver by ID" and "List Drivers by Company". 
// It doesn't have a "List ALL drivers"! Let's implement it based on assuming we might need to filter by company, but for now we might mock or ask user. Wait! The prompt says: "User Management: Create/Update components to list, view, and delete Customers and Drivers using GET /customers and GET /drivers."
// Aha! In the prompt, it says: "using GET /customers and GET /drivers".
// So there IS a `GET /drivers` endpoint. I will update `adminService.ts` and use it.

export const DriverList: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filters
  const [term, setTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Company link logic
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const fetchDriversData = async () => {
    setIsLoading(true);
    try {
      // Prompt mentioned GET /drivers. Let's use it directly with fetchApi
      import('../../lib/apiClient').then(async ({ fetchApi }) => {
          const params = new URLSearchParams({
            pageNum: pageNum.toString(),
            pageSize: pageSize.toString(),
          });
          if (term) params.append('term', term);
          const resp = await fetchApi<any>(`/drivers?${params}`);
          if (resp.success) {
            setDrivers(resp.data);
            setTotalCount(resp.totalCount || resp.data.length);
          }
      }).finally(() => setIsLoading(false));
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriversData();
  }, [pageNum, pageSize, term]);

  const handleDelete = async (id: string, isRestore: boolean = false) => {
    if (window.confirm(`Are you sure you want to ${isRestore ? 'restore' : 'delete'} this driver?`)) {
      try {
        if (isRestore) {
           import('../../services/adminService').then(m => m.updateDriver(id, { deletedAt: null }));
        } else {
           await deleteDriver(id);
        }
        fetchDriversData();
      } catch (error) {
        console.error(`Failed to ${isRestore ? 'restore' : 'delete'} driver`, error);
        alert(`Failed to ${isRestore ? 'restore' : 'delete'} driver`);
      }
    }
  };

  const handleLinkCompany = async (driverId: string) => {
    const companyId = window.prompt("Enter Company ID to link:");
    if (companyId) {
       try {
         await linkDriverCompany(driverId, companyId);
         fetchDriversData();
       } catch(error) {
         alert("Failed to link company.");
       }
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage registered drivers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setPageNum(1);
              }}
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading...
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-500 hover:bg-indigo-50" onClick={() => handleLinkCompany(driver.id)}>
                              <Link className="h-4 w-4" />
                            </Button>
                            {isDeleted ? (
                              <Button variant="outline" size="sm" onClick={() => handleDelete(driver.id, true)}>
                                Restore
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(driver.id, false)}>
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
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */ }
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
    </div>
  );
};
