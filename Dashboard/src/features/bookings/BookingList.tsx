import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Eye,
  Filter,
  Home,
  Loader2,
  MapPin,
  Plane,
  RotateCcw,
  Trash2,
  Users,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { PaginationControls } from '../../components/ui/PaginationControls';
import { cancelAirportTransferBooking, getAirportTransferBookings } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import type { BookingResponse, BookingStatus } from '../../types/admin';
import { logError } from '../../lib/logger';

type StatusFilter = BookingStatus | '';

interface BookingFilters {
  companyId: string;
  customerId: string;
  status: StatusFilter;
}

interface BookingQuery extends BookingFilters {
  page: number;
  pageSize: number;
}

const initialFilters: BookingFilters = {
  companyId: '',
  customerId: '',
  status: '',
};

const bookingStatuses: BookingStatus[] = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

const statusVariant: Record<BookingStatus, 'warning' | 'default' | 'success' | 'danger'> = {
  Pending: 'warning',
  Confirmed: 'default',
  Cancelled: 'danger',
  Completed: 'success',
};

const statusLabel: Record<BookingStatus, string> = {
  Pending: 'بانتظار التأكيد',
  Confirmed: 'تم التأكيد',
  Cancelled: 'تم الإلغاء',
  Completed: 'مكتمل',
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatShortId = (value: string) => `${value.slice(0, 8)}...`;

const getErrorMessage = (error: unknown, fallback: string) => (
  error instanceof Error && error.message ? error.message : fallback
);

const canCancelBooking = (booking: BookingResponse) => (
  booking.status === 'Pending' || booking.status === 'Confirmed'
);

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    <div className="mt-1 break-words text-sm font-medium text-slate-800">{value}</div>
  </div>
);

export const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState<BookingQuery>({
    ...initialFilters,
    page: 1,
    pageSize: 10,
  });
  const [draftFilters, setDraftFilters] = useState<BookingFilters>(initialFilters);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getAirportTransferBookings({
        companyId: query.companyId || undefined,
        customerId: query.customerId || undefined,
        status: query.status || undefined,
        page: query.page,
        pageSize: query.pageSize,
      });

      if (response && response.success !== false) {
        const list = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        const count = typeof response.totalCount === 'number'
          ? response.totalCount
          : list.length;

        setBookings(list);
        setTotalCount(count);
      } else {
        setBookings([]);
        setTotalCount(0);
        setErrorMessage(response?.message || 'فشل تحميل الحجوزات.');
      }
    } catch (error) {
      logError('Failed to fetch airport bookings', error);
      setBookings([]);
      setTotalCount(0);
      setErrorMessage(getErrorMessage(error, 'فشل تحميل الحجوزات من الخادم.'));
    } finally {
      setIsLoading(false);
    }
  }, [query.companyId, query.customerId, query.page, query.pageSize, query.status]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const currentPageCancellableCount = useMemo(
    () => bookings.filter(canCancelBooking).length,
    [bookings],
  );

  const applyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery((current) => ({
      ...current,
      companyId: draftFilters.companyId.trim(),
      customerId: draftFilters.customerId.trim(),
      status: draftFilters.status,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setQuery((current) => ({
      ...current,
      ...initialFilters,
      page: 1,
    }));
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      const response = await cancelAirportTransferBooking(bookingToCancel.id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel booking.');
      }
      addToast(response.message || 'Booking cancelled successfully.', 'success');
      setBookingToCancel(null);
      await fetchBookings();
    } catch (error) {
      logError('Failed to cancel airport booking', error);
      addToast(getErrorMessage(error, 'Failed to cancel booking.'), 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">حجوزات المطار</h1>
          <p className="mt-1 text-sm text-slate-500">Manage airport transfer bookings from the admin Booking API.</p>
        </div>
        <Badge variant="success" className="self-start">Admin API live</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Matching bookings</span>
            <CalendarDays className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">{totalCount}</p>
          <p className="mt-1 text-xs text-slate-400">Total records for the active filters</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Current page</span>
            <Filter className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">{bookings.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Cancellable here</span>
            <Trash2 className="h-5 w-5 text-rose-500" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-800">{currentPageCancellableCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={applyFilters} className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_130px_auto] xl:items-end">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Company ID</span>
              <input
                value={draftFilters.companyId}
                onChange={(event) => setDraftFilters((current) => ({ ...current, companyId: event.target.value }))}
                placeholder="Filter by company UUID"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Customer ID</span>
              <input
                value={draftFilters.customerId}
                onChange={(event) => setDraftFilters((current) => ({ ...current, customerId: event.target.value }))}
                placeholder="Filter by customer UUID"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Status</span>
              <select
                value={draftFilters.status}
                onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value as StatusFilter }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              >
                <option value="">All statuses</option>
                {bookingStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Page size</span>
              <select
                value={query.pageSize}
                onChange={(event) => setQuery((current) => ({
                  ...current,
                  page: 1,
                  pageSize: Number(event.target.value),
                }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 xl:flex-none">
                <Filter className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={clearFilters} aria-label="Clear filters">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['Booking', 'Customer', 'Company', 'Direction & route', 'Passengers', 'Status', 'Created', 'Actions'].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-500">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-indigo-500" />
                    Loading bookings...
                  </td>
                </tr>
              ) : errorMessage ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center">
                    <AlertCircle className="mx-auto mb-3 h-7 w-7 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-800">Unable to load bookings</p>
                    <p className="mt-1 text-sm text-slate-500">{errorMessage}</p>
                    <Button variant="outline" className="mt-4" onClick={() => void fetchBookings()}>
                      Retry
                    </Button>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-500">
                    No airport bookings match the current filters.
                  </td>
                </tr>
              ) : bookings.map((booking) => {
                const isOutbound = booking.homeToAirport;
                const isCancellable = canCancelBooking(booking);

                return (
                  <tr key={booking.id} className="group transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold text-indigo-600">{formatShortId(booking.id)}</p>
                      <p className="mt-1 text-xs text-slate-400">{booking.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">{booking.customerName || 'Unnamed customer'}</p>
                      <p className="mt-1 font-mono text-xs text-slate-500">{formatShortId(booking.customerId)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{booking.companyName || 'Unknown company'}</p>
                          <p className="mt-1 font-mono text-xs text-slate-500">{formatShortId(booking.companyId)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                        {isOutbound ? <Plane className="h-4 w-4 text-amber-500" /> : <Home className="h-4 w-4 text-emerald-500" />}
                        {isOutbound ? 'Home to airport' : 'Airport to home'}
                      </div>
                      <div className="flex max-w-[310px] items-start gap-1 text-xs text-slate-500">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                        <span className="truncate">{booking.pickup} - {booking.dropoff}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                        <Users className="h-4 w-4 text-slate-400" />
                        {booking.maxPassengers}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[booking.status]}>{statusLabel[booking.status]}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{formatDateTime(booking.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={() => setSelectedBooking(booking)} aria-label="View booking details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                          disabled={!isCancellable}
                          onClick={() => setBookingToCancel(booking)}
                          aria-label="Cancel booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isLoading && !errorMessage && totalCount > 0 && (
          <PaginationControls
            pageNum={query.page}
            pageSize={query.pageSize}
            totalCount={totalCount}
            onPageChange={(updater) => setQuery((current) => ({ ...current, page: updater(current.page) }))}
          />
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title="Booking details"
        className="max-w-3xl"
      >
        {selectedBooking && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-bold text-indigo-600">{selectedBooking.id}</p>
                <h2 className="mt-1 text-lg font-bold text-slate-800">{selectedBooking.customerName || 'Unnamed customer'}</h2>
              </div>
              <Badge variant={statusVariant[selectedBooking.status]}>{statusLabel[selectedBooking.status]}</Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Pickup" value={selectedBooking.pickup} />
              <DetailItem label="Dropoff" value={selectedBooking.dropoff} />
              <DetailItem label="Direction" value={selectedBooking.homeToAirport ? 'Home to airport' : 'Airport to home'} />
              <DetailItem label="Max passengers" value={selectedBooking.maxPassengers} />
              <DetailItem label="Coordinates" value={`${selectedBooking.latitude}, ${selectedBooking.longitude}`} />
              <DetailItem label="Company" value={`${selectedBooking.companyName} (${selectedBooking.companyId})`} />
              <DetailItem label="Customer ID" value={selectedBooking.customerId} />
              <DetailItem label="Created at" value={formatDateTime(selectedBooking.createdAt)} />
              <DetailItem label="Updated at" value={formatDateTime(selectedBooking.updatedAt)} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(bookingToCancel)}
        title="Cancel booking"
        description={`This will cancel booking ${bookingToCancel?.id ?? ''}. Only pending or confirmed bookings can be cancelled.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        isLoading={isCancelling}
        onCancel={() => setBookingToCancel(null)}
        onConfirm={handleCancelBooking}
      />
    </div>
  );
};
