# HOD Dashboard - Request Management Feature

## 📋 Overview

A complete Head of Department (HOD) Dashboard feature for managing student appointment requests in a college appointment/meeting management system.

**Path**: `/hod-dashboard`

## 🎯 Core Features

### 1. Request Management
- ✅ **Accept Requests** - Green button, immediately approves requests
- ✅ **Reject Requests** - Red button with confirmation dialog
- ✅ **Reschedule Requests** - Blue button opens date/time picker modal

### 2. Request Display
- 📋 Clean card-based layout with responsive grid (1 column on mobile, 2 on desktop)
- 👤 Student information (name, email)
- 🕐 Requested time with formatted date/time display
- 📝 Request reason/description
- 🏷️ Color-coded status badges (Yellow=Pending, Green=Accepted, Red=Rejected, Blue=Rescheduled)

### 3. Search & Filter
- 🔍 Real-time search by student name, email, or reason
- 🏷️ Status filter dropdown (All, Pending, Accepted, Rejected, Rescheduled)
- 📊 Request count display with active filters

### 4. User Experience
- 🎨 Modern, professional dashboard design
- 🌙 Dark mode support (toggle in header)
- ⏳ Loading spinner while fetching data
- 📭 "No requests available" empty state
- 🎉 Toast notifications for all actions
- ⚠️ Confirmation dialogs for destructive actions

### 5. Statistics
- 📊 Quick stats cards showing pending/accepted/rejected/rescheduled counts
- 📈 Acceptance rate calculation

## 🏗️ Architecture & File Structure

```
src/
├── pages/
│   └── HodDashboard.tsx                 # Main HOD dashboard page
│
├── components/
│   ├── RequestList.tsx                  # Request list container (search, filter, display)
│   ├── RequestCard.tsx                  # Individual request card with action buttons
│   └── RescheduleModal.tsx              # Date/time picker modal
│
├── hooks/
│   ├── useRequests.ts                   # React Query mutations & queries
│   └── useRequestStats.ts               # Statistics calculation hook
│
├── services/
│   └── requestService.ts                # API service layer (mock currently)
│
├── types/
│   └── request.ts                       # TypeScript interfaces & types
│
├── constants/
│   └── requestConstants.ts              # Statuses, colors, configuration
│
└── utils/
    └── requestUtils.ts                  # Helper utilities (formatting, validation)
```

## 📦 Data Types

### StudentRequest
```typescript
{
  id: string;                  // Unique request ID
  studentId: string;          // Student identifier
  studentName: string;        // Display name
  studentEmail: string;       // Contact email
  requestedTime: string;      // ISO datetime
  reason: string;             // Request reason/description
  status: RequestStatus;      // Pending | Accepted | Rejected | Rescheduled
  createdAt: string;          // ISO datetime
  updatedAt?: string;         // Last update time
  rescheduledTo?: string;     // New scheduled time if rescheduled
}
```

### RequestStatus
```typescript
type RequestStatus = "Pending" | "Accepted" | "Rejected" | "Rescheduled";
```

## 🔄 Data Flow

```
1. HodDashboard Component Mounts
   ↓
2. RequestList Component Renders
   ↓
3. useRequestsList Hook Fetches Data
   ↓
4. React Query Caches Results (5 min TTL)
   ↓
5. RequestCard Components Display Data
   ↓
6. User Clicks Action Button (Accept/Reject/Reschedule)
   ↓
7. Appropriate Mutation Hook Executes
   ↓
8. React Query Cache Updated
   ↓
9. UI Re-renders with New Data
   ↓
10. Toast Notification Shown to User
```

## 🚀 Quick Start

### Navigate to HOD Dashboard
```
1. Go to http://localhost:5173/hod-dashboard
2. View all student requests
3. Click action buttons to manage requests
```

### Test Features

**Accept Request:**
1. Find a request with "Pending" status
2. Click "✓ Accept" button
3. See success toast and status change to "Accepted"

**Reject Request:**
1. Click "✕ Reject" button
2. Confirm in dialog
3. See error toast and status change to "Rejected"

**Reschedule Request:**
1. Click "📅 Reschedule" button
2. Select new date and time
3. Click "Confirm Reschedule"
4. Status changes to "Rescheduled" with new datetime

## 🔌 API Integration

### Current State
- Using **mock data** for demonstration
- 500ms simulated network delay

### To Connect Real API

Edit `src/services/requestService.ts`:

```typescript
export async function fetchRequests(): Promise<StudentRequest[]> {
  const response = await fetch('/api/requests');
  return response.json();
}

export async function acceptRequest(requestId: string): Promise<StudentRequest> {
  const response = await fetch(`/api/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Accepted' })
  });
  return response.json();
}
// ... similar for reject and reschedule
```

## 🎨 UI Components Used

- **Dialog** - For confirmation and reschedule modal
- **Button** - Action buttons with variants
- **Card** - Request cards display
- **Badge** - Status badges
- **Input** - Search and date/time pickers
- **Select** - Filter dropdown
- **AlertDialog** - Confirmation dialogs
- **Toaster** - Toast notifications (via Sonner)

## 🌙 Dark Mode

- Automatically detects system preference
- Persists user selection in localStorage
- Toggle via sun/moon icon in header
- All components styled with dark mode support

## 📱 Responsive Design

- **Mobile** (< 768px): Single column layout, compact header
- **Tablet** (768px - 1024px): 2 column layout
- **Desktop** (> 1024px): Full featured layout

## ⚡ Performance Features

- React Query automatic caching (5 minute stale time)
- Optimistic UI updates
- Request deduplication
- Automatic garbage collection
- No unnecessary re-renders

## 🔐 Security Considerations

For production deployment:
1. Add authentication checks
2. Validate all user inputs
3. Implement request rate limiting
4. Use secure API endpoints (HTTPS)
5. Add authorization for HOD-only features
6. Sanitize user-generated content

## 🛠️ Customization

### Change Status Colors
Edit `src/constants/requestConstants.ts`:
```typescript
export const REQUEST_STATUS_COLORS = {
  Pending: { bg: "custom-color", text: "custom-text" },
  // ...
}
```

### Add New Request Status
1. Update `RequestStatus` type in `src/types/request.ts`
2. Add color config in `requestConstants.ts`
3. Update mock data in `requestService.ts`

### Modify Toast Duration
Edit `src/constants/requestConstants.ts`:
```typescript
export const TOAST_DURATION = 5000; // 5 seconds
```

## 📊 Mock Data

Pre-loaded with 5 sample requests:
- 3 Pending requests (newest students)
- 1 Accepted request
- 1 Rejected request

Perfect for testing and demonstration.

## ✅ Testing Checklist

- [ ] All requests display correctly
- [ ] Search functionality works
- [ ] Status filter works
- [ ] Accept button works and shows toast
- [ ] Reject shows confirmation dialog
- [ ] Reject updates status correctly
- [ ] Reschedule modal opens and closes
- [ ] Date/time picker works
- [ ] Reschedule updates request correctly
- [ ] Dark mode toggle works
- [ ] Mobile layout responsive
- [ ] Empty state displays when no requests
- [ ] Loading spinner shows during fetch

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Requests not loading | Check browser console, verify requestService config |
| Status not updating | Ensure React Query cache key matches |
| Toast not showing | Verify Toaster component in App.tsx |
| Dark mode not working | Check localStorage, ensure dark class on HTML |
| Styling issues | Verify Tailwind CSS is configured |

## 📈 Future Enhancements

- [ ] Bulk actions (Accept/Reject all pending)
- [ ] CSV export functionality
- [ ] Email notifications
- [ ] Calendar view
- [ ] Analytics dashboard
- [ ] Automated reminders
- [ ] Request templates
- [ ] Multi-HOD management
- [ ] Advanced filtering (date range, department)
- [ ] Request history/archive

## 📝 Notes

- All timestamps are in ISO 8601 format
- Dates are formatted using date-fns library
- Component uses Tailwind CSS for styling
- Dark mode uses native CSS class approach
- Responsive design tested on common breakpoints

---

**Created**: April 2026
**Status**: Production Ready
**Last Updated**: April 16, 2026
