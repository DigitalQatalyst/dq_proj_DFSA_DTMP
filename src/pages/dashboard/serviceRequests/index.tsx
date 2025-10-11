import { useEffect, useState } from 'react';
import { EmptyState } from '../../../components/serviceRequests/EmptyState';
import { mockServiceRequests } from '../../../components/serviceRequests/mockData';
import { ServiceRequestsFilters } from '../../../components/serviceRequests/ServiceRequestsFilters';
import { ServiceRequestsHeader } from '../../../components/serviceRequests/ServiceRequestsHeader';
import { ServiceRequest, ServiceRequestStatus, DateRangeFilter } from '../../../types';
import { ServiceRequestsTable } from '../../../components/serviceRequests/ServiceRequestsTable';

export function ServiceRequestsPage({ isLoggedIn, setIsOpen }: { isLoggedIn: boolean; setIsOpen: (value: boolean) => void; }) {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<
        ServiceRequestStatus | 'all'
    >('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<DateRangeFilter>({
        startDate: null,
        endDate: null,
    });
    const [sortConfig, setSortConfig] = useState<{
        key: keyof ServiceRequest;
        direction: 'asc' | 'desc';
    }>({
        key: 'submittedDate',
        direction: 'desc',
    });
    // Fetch service requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoading(true);
                // Simulate API call with timeout
                setTimeout(() => {
                    setRequests(mockServiceRequests);
                    setFilteredRequests(mockServiceRequests);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                setError('Failed to load service requests');
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);
    // Filter requests based on status, search query, and date range
    useEffect(() => {
        let filtered = [...requests];
        // Filter by status
        if (currentStatus !== 'all') {
            filtered = filtered.filter((request) => request.status === currentStatus);
        }
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (request) =>
                    request.serviceName.toLowerCase().includes(query) ||
                    request.category.toLowerCase().includes(query) ||
                    request.serviceProvider?.toLowerCase().includes(query),
            );
        }
        // Filter by date range
        if (dateRange.startDate || dateRange.endDate) {
            filtered = filtered.filter((request) => {
                const requestDate = new Date(request.submittedDate);
                if (dateRange.startDate && dateRange.endDate) {
                    const start = new Date(dateRange.startDate);
                    const end = new Date(dateRange.endDate);
                    return requestDate >= start && requestDate <= end;
                }
                if (dateRange.startDate) {
                    const start = new Date(dateRange.startDate);
                    return requestDate >= start;
                }
                if (dateRange.endDate) {
                    const end = new Date(dateRange.endDate);
                    return requestDate <= end;
                }
                return true;
            });
        }
        // Sort filtered requests
        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue && bValue) {
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
            }

            return 0;
        });
        setFilteredRequests(filtered);
    }, [requests, currentStatus, searchQuery, dateRange, sortConfig]);
    // Handle sort
    const handleSort = (key: keyof ServiceRequest) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };
    // Handle new service request
    const handleRequestNewService = () => {
        console.log('Request new service clicked');
        // In a real app, this would navigate to a form or open a modal
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading service requests...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 text-lg mb-2">Error</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }
    return (
        <>
            <ServiceRequestsHeader
                onRequestNewService={handleRequestNewService}
                setIsOpen={setIsOpen}
                isLoggedIn={isLoggedIn}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mx-4 lg:mx-6 mb-6">
                <ServiceRequestsFilters
                    currentStatus={currentStatus}
                    onStatusChange={setCurrentStatus}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
                {filteredRequests.length > 0 ? (
                    <ServiceRequestsTable
                        requests={filteredRequests}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                    />
                ) : (
                    <EmptyState
                        onRequestNewService={handleRequestNewService}
                        hasFilters={
                            currentStatus !== 'all' ||
                            !!searchQuery ||
                            !!(dateRange.startDate || dateRange.endDate)
                        }
                        onClearFilters={() => {
                            setCurrentStatus('all');
                            setSearchQuery('');
                            setDateRange({
                                startDate: null,
                                endDate: null,
                            });
                        }}
                    />
                )}
            </div>
        </>
    );
}
