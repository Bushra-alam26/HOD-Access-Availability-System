/**
 * Reschedule Modal Component
 * Provides date and time picker for rescheduling student requests
 */

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RescheduleModalProps {
  isOpen: boolean;
  studentName: string;
  currentDateTime: string;
  onClose: () => void;
  onConfirm: (newDateTime: string) => void;
  isLoading?: boolean;
}

export const RescheduleModal = ({
  isOpen,
  studentName,
  currentDateTime,
  onClose,
  onConfirm,
  isLoading = false,
}: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(currentDateTime), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    format(new Date(currentDateTime), "HH:mm")
  );

  const handleConfirm = () => {
    // Combine date and time into ISO format datetime
    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    const isoDateTime = new Date(dateTimeString).toISOString();
    onConfirm(isoDateTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Meeting</DialogTitle>
          <DialogDescription>
            Reschedule meeting with {studentName}. Select new date and time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current Schedule Info */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Current Schedule:</span>{" "}
              {format(new Date(currentDateTime), "PPP 'at' p")}
            </p>
          </div>

          {/* Date Picker */}
          <div className="grid gap-2">
            <Label htmlFor="reschedule-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="reschedule-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Time Picker */}
          <div className="grid gap-2">
            <Label htmlFor="reschedule-time">Time</Label>
            <Input
              id="reschedule-time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* New Schedule Preview */}
          <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">New Schedule:</span>{" "}
              {format(new Date(`${selectedDate}T${selectedTime}`), "PPP 'at' p")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
