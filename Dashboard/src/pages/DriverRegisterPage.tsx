import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CarFront, FileCheck2, PlaneTakeoff, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ImageUploadField } from '../features/drivers/ImageUploadField';
import { useToastStore } from '../store/useToastStore';
import { getCompanies, registerDriver } from '../services/adminService';
import type { CompanyModel, DriverRegistrationForm } from '../types/admin';
import { logError } from '../lib/logger';

const EMPTY_FORM: DriverRegistrationForm = {
  name: '',
  phoneNumber: '',
  companyId: '',
  carModel: '',
  carBrand: '',
  carLicensePlate: '',
  identityFrontImage: null,
  identityBackImage: null,
  vehicleRegistrationImage: null,
  vehicleImages: [],
};

const inputClassName = 'w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10';

export const DriverRegisterPage = () => {
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<DriverRegistrationForm>(EMPTY_FORM);
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const companyId = new URLSearchParams(location.search).get('companyId');
    if (companyId) setForm((current) => ({ ...current, companyId }));
  }, [location.search]);

  useEffect(() => {
    let isActive = true;

    const loadCompanies = async () => {
      try {
        const response = await getCompanies({ pageNum: 1, pageSize: 100 });
        if (!isActive || !response.success) return;
        setCompanies(response.data);
        setForm((current) => ({
          ...current,
          companyId: current.companyId || response.data[0]?.id || '',
        }));
      } catch (error) {
        logError('Failed to load companies for driver registration', error);
        addToast('Could not load companies', 'error');
      } finally {
        if (isActive) setIsLoadingCompanies(false);
      }
    };

    void loadCompanies();
    return () => { isActive = false; };
  }, [addToast]);

  const updateField = <K extends keyof DriverRegistrationForm>(field: K, value: DriverRegistrationForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name?.trim() || !form.phoneNumber?.trim() || !form.companyId) {
      addToast('Name, phone number and company are required', 'error');
      return;
    }

    if (!form.identityFrontImage || !form.identityBackImage || !form.vehicleRegistrationImage || form.vehicleImages.length !== 3) {
      addToast('Upload both ID sides, the vehicle registration and exactly three vehicle photos', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerDriver(form);
      addToast('Driver registered successfully', 'success');
      const companyQuery = form.companyId ? `?companyId=${form.companyId}` : '';
      setForm(EMPTY_FORM);
      navigate(`/drivers${companyQuery}`);
    } catch (error) {
      logError('Driver registration failed', error);
      const message = error instanceof Error ? error.message : 'Failed to register driver';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <form onSubmit={handleRegister} className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <PlaneTakeoff className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Register New Driver</h1>
              <p className="mt-1 text-sm text-slate-500">Add the driver, vehicle and required verification documents.</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <UserRound className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-800">Driver Information</h2>
              <p className="text-xs text-slate-500">Personal and company details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-xs font-bold uppercase text-slate-500">
              Full name
              <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className={inputClassName} placeholder="e.g. Ahmed Ali" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500">
              Phone number
              <input required type="tel" value={form.phoneNumber} onChange={(event) => updateField('phoneNumber', event.target.value)} className={inputClassName} placeholder="e.g. +964 771 234 5678" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500 md:col-span-2">
              Company
              <select required value={form.companyId} onChange={(event) => updateField('companyId', event.target.value)} className={inputClassName} disabled={isLoadingCompanies}>
                <option value="">{isLoadingCompanies ? 'Loading companies...' : 'Select a company'}</option>
                {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <CarFront className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-800">Vehicle Information</h2>
              <p className="text-xs text-slate-500">Vehicle details shown to passengers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="text-xs font-bold uppercase text-slate-500">
              Car brand
              <input required value={form.carBrand} onChange={(event) => updateField('carBrand', event.target.value)} className={inputClassName} placeholder="e.g. Toyota" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500">
              Car model
              <input required value={form.carModel} onChange={(event) => updateField('carModel', event.target.value)} className={inputClassName} placeholder="e.g. Camry 2024" />
            </label>
            <label className="text-xs font-bold uppercase text-slate-500">
              License plate
              <input required value={form.carLicensePlate} onChange={(event) => updateField('carLicensePlate', event.target.value)} className={inputClassName} placeholder="e.g. 12 A 34567" />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-800">Verification Documents</h2>
              <p className="text-xs text-slate-500">All images are required before the driver can be registered.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ImageUploadField label="Driver ID — Front" description="Upload a clear image of the front side." files={form.identityFrontImage ? [form.identityFrontImage] : []} onChange={(files) => updateField('identityFrontImage', files[0] ?? null)} />
            <ImageUploadField label="Driver ID — Back" description="Upload a clear image of the back side." files={form.identityBackImage ? [form.identityBackImage] : []} onChange={(files) => updateField('identityBackImage', files[0] ?? null)} />
            <div className="md:col-span-2">
              <ImageUploadField label="Vehicle Registration" description="Upload the current annual vehicle registration document." files={form.vehicleRegistrationImage ? [form.vehicleRegistrationImage] : []} onChange={(files) => updateField('vehicleRegistrationImage', files[0] ?? null)} />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField label="Vehicle Photos" description="Upload exactly three clear photos showing the vehicle from different angles." files={form.vehicleImages} maxFiles={3} onChange={(files) => updateField('vehicleImages', files)} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pb-8">
          <Button type="submit" size="lg" disabled={isSubmitting || isLoadingCompanies}>
            {isSubmitting ? 'Registering...' : 'Register Driver'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DriverRegisterPage;
