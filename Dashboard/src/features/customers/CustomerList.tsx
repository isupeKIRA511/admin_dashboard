import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { User, Loader2, Search, Trash2 } from 'lucide-react';
import { PaginationControls } from '../../components/ui/PaginationControls';
import type { CustomerModel } from '../../types/admin';
import { getCustomers, deleteCustomer } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import { logError } from '../../lib/logger';
import { isSoftDeleted } from '../../lib/softDelete';

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filters
  const [term, setTerm] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const fetchCustomersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await getCustomers({ pageNum, pageSize, term });
      if (resp.success) {
        setCustomers(resp.data);
        setTotalCount(resp.totalCount);
      }
    } catch (error) {
      logError('Failed to fetch customers', error);
    } finally {
      setIsLoading(false);
    }
  }, [pageNum, pageSize, term]);

  useEffect(() => {
    fetchCustomersData();
  }, [fetchCustomersData]);

  const handleDelete = async () => {
    if (!customerToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      addToast(`Customer ${customerToDelete.fullName || customerToDelete.phoneNumber} deleted successfully.`, 'success');
      setCustomerToDelete(null);
      fetchCustomersData();
    } catch (error) {
      logError('Failed to delete customer', error);
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      addToast(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage app users</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined At</th>
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
              ) : customers.length > 0 ? (
                customers.map((customer) => {
                  const isDeleted = isSoftDeleted(customer.deletedAt);
                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 transform transition-transform group-hover:scale-105">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{customer.fullName || 'No Name'}</div>
                            <div className="text-xs text-slate-500">{customer.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 font-medium">
                          {customer.phoneNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isDeleted ? (
                          <Badge variant="danger">Deleted</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isDeleted && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setCustomerToDelete(customer)}>
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
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalCount > 0 && (
          <PaginationControls pageNum={pageNum} pageSize={pageSize} totalCount={totalCount} onPageChange={setPageNum} />
        )}
      </div>
      <ConfirmDialog
        isOpen={Boolean(customerToDelete)}
        title="Delete customer"
        description={`This will remove ${customerToDelete?.fullName || customerToDelete?.phoneNumber || 'this customer'} from the dashboard. This action cannot be undone.`}
        confirmLabel="Delete customer"
        isLoading={isDeleting}
        onCancel={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};
