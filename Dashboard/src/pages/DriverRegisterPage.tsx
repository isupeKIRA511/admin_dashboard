import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlaneTakeoff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useToastStore } from '../store/useToastStore';
import { registerDriver, getCompanies } from '../services/adminService';
import type { DriverRegisterRequest, CompanyModel } from '../types/admin';

export const DriverRegisterPage: React.FC = () => {
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState<DriverRegisterRequest>({
        name: '',
        phoneNumber: '',
        companyId: '',
        carModel: '',
        carBrand: '',
        carLicensePlate: '',
    });

    const [companies, setCompanies] = useState<CompanyModel[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
    const [loading, setLoading] = useState(false);

    // Prefill companyId from query param if present
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('companyId');
        if (q) setForm((f) => ({ ...f, companyId: q }));
    }, [location.search]);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const resp = await getCompanies({ pageNum: 1, pageSize: 200 });
                if (resp.success && mounted) {
                    setCompanies(resp.data);
                    // if companyId not provided, optionally default to first company
                    setForm((f) => ({ ...f, companyId: f.companyId || (resp.data[0]?.id || '') }));
                }
            } catch (err) {
                console.error('Failed to load companies for register page', err);
            } finally {
                if (mounted) setIsLoadingCompanies(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const handleRegister = async () => {
        if (!form.name || !form.phoneNumber || !form.companyId) return addToast('Name, phone and companyId are required', 'error');
        setLoading(true);
        try {
            const payload: DriverRegisterRequest = {
                name: form.name,
                phoneNumber: form.phoneNumber,
                companyId: form.companyId,
                carModel: form.carModel,
                carBrand: form.carBrand,
                carLicensePlate: form.carLicensePlate,
            };

            console.debug('Registering driver', payload);
            await registerDriver(payload as any);
            addToast('Driver registered successfully', 'success');

            // Reset form
            setForm({ name: '', phoneNumber: '', companyId: '', carModel: '', carBrand: '', carLicensePlate: '' });

            // Drivers page was removed — navigate to the dashboard root instead
            // If you'd prefer a different target (companies page or company details), change this path.
            navigate(`/`);
        } catch (err: any) {
            console.error('Register driver failed', err);
            addToast(err?.message || 'Failed to register driver', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <PlaneTakeoff className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Driver Registration</h1>
                        <p className="text-sm text-slate-500">Register a new driver (no OTP required)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Full name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="e.g. Ahmed Ali"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Phone number</label>
                        <input
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="e.g. +9647712345678"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Company ID</label>
                        <input
                            value={form.companyId}
                            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
                        />
                        {!isLoadingCompanies && companies.length > 0 && (
                            <div className="mt-2 text-[12px] text-slate-500">
                                Tip: available companies (id : name):
                                <ul className="list-disc ml-5 mt-1">
                                    {companies.slice(0, 5).map((c) => (
                                        <li key={c.id} className="truncate">{c.id} : {c.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Car model</label>
                        <input
                            value={form.carModel}
                            onChange={(e) => setForm({ ...form, carModel: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="e.g. Corolla 2020"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Car brand</label>
                        <input
                            value={form.carBrand}
                            onChange={(e) => setForm({ ...form, carBrand: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="e.g. Toyota"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">License plate</label>
                        <input
                            value={form.carLicensePlate}
                            onChange={(e) => setForm({ ...form, carLicensePlate: e.target.value })}
                            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50"
                            placeholder="ABC-123"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button variant="secondary" size="md" onClick={handleRegister} disabled={loading}>
                        {loading ? 'Processing...' : 'Register Driver'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DriverRegisterPage;
