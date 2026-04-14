import React from 'react';
import type { Company } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Building2, 
  X, 
  Activity, 
  Percent, 
  Users, 
  ShieldAlert, 
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  User,
  MapPin,
  Hash
} from 'lucide-react';

import { useTripStore } from '../../store/useTripStore';
import { useCompanyStore } from '../../store/useCompanyStore';

interface CompanyDetailsDrawerProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyDetailsDrawer: React.FC<CompanyDetailsDrawerProps> = ({
  company,
  isOpen,
  onClose,
}) => {
  const updateDocumentStatus = useCompanyStore(state => state.updateDocumentStatus);
  const allTrips = useTripStore(state => state.trips);
  const trips = allTrips.filter(t => t.companyId === company?.id);
  const completedTrips = trips.filter(t => t.status === 'completed');
  const gmv = completedTrips.reduce((sum, t) => sum + t.price, 0);
  const commission = company ? gmv * company.commissionRate : 0;
  
  if (!isOpen || !company) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-400/20 backdrop-blur-sm transition-opacity z-40"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 w-full max-w-md h-screen bg-white shadow-2xl z-50 animate-in slide-in-from-right flex flex-col border-l border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{company.name}</h2>
              <p className="text-xs text-slate-500">ID: {company.id}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Status block */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Current Status</span>
            <Badge 
              variant={company.status === 'active' ? 'success' : company.status === 'suspended' ? 'danger' : 'warning'}
            >
              {company.status.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Business Intelligence</h3>
            <div className="bg-slate-50 rounded-xl p-5 space-y-4 border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Authorized Manager</p>
                  <p className="text-sm font-semibold text-slate-800">{company.managerName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Business Address</p>
                  <p className="text-sm font-semibold text-slate-800">{company.fullAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Hash className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tax / VAT Identifier</p>
                  <p className="text-sm font-mono font-bold text-slate-800">{company.taxId}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Registered Services</p>
                <div className="flex flex-wrap gap-2">
                  {company.services.map(service => (
                    <span key={service} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold border border-indigo-100">
                      {service}
                    </span>
                  ))}
                  {company.services.length === 0 && <span className="text-xs text-slate-400 italic">No services registered</span>}
                </div>
              </div>
            </div>
          </div>


          {/* New Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Compliance Documents
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">MVP Mode</span>
            </div>
            
            <div className="space-y-3">
              {company.documents?.map((doc) => (
                <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${doc.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">Uploaded: {doc.uploadedAt}</p>
                      </div>
                    </div>
                    {doc.status === 'verified' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    {doc.status === 'pending' && <Clock className="h-4 w-4 text-amber-500" />}
                    {doc.status === 'rejected' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] flex-1 gap-1">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    {doc.status !== 'verified' && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-7 text-[10px] flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        onClick={() => updateDocumentStatus(company.id, doc.id, 'verified')}
                      >
                        Approve
                      </Button>
                    )}
                    {doc.status !== 'rejected' && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-7 text-[10px] flex-1 bg-red-50 text-red-600 hover:bg-red-100"
                        onClick={() => updateDocumentStatus(company.id, doc.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Financial Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Total GMV</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">${gmv.toFixed(2)}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-500">
                  <Percent className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Commission</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-indigo-500">
                  ${commission.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                Active Drivers
              </h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm">
              {[
                { name: 'Ahmed S.', status: 'Active', trips: 124, alert: false },
                { name: 'Mohammed K.', status: 'Active', trips: 89, alert: false },
                { name: 'Khaled A.', status: 'Warning', trips: 42, alert: true },
              ].map((driver, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{driver.name}</p>
                      <p className="text-xs text-slate-500">{driver.trips} Trips</p>
                    </div>
                  </div>
                  {driver.alert ? (
                    <span title="License Expiring Soon">
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                    </span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-500" />
              Commission Center
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Platform Fee</span>
                <span className="text-sm font-bold text-indigo-500">{(company.commissionRate * 100).toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                defaultValue={company.commissionRate * 100} 
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
              <p className="text-xs text-slate-500 mt-2">Adjust rate individually for this vendor. Default is 15%.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 gap-3 flex">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
          <Button variant="secondary" className="flex-1">Edit Details</Button>
        </div>
      </div>
    </>
  );
};

