import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type Vote } from '@/lib/supabase';

interface DateSelectorProps {
    allDates: Date[];
    selectedDates: Set<string>;
    votes: Vote[];
    onDateToggle: (date: string) => void;
}

export default function DateSelector({
    allDates,
    selectedDates,
    votes,
    onDateToggle
}: DateSelectorProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

    // Group dates by month
    const groupedDates = allDates.reduce((acc, date) => {
        const monthKey = format(date, 'yyyy년 M월', { locale: ko });
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(date);
        return acc;
    }, {} as Record<string, Date[]>);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setDragMode(null);
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    const handleMouseDown = (e: React.MouseEvent, dateStr: string, isSelected: boolean) => {
        // Only enable drag on desktop (not touch devices)
        if (e.type !== 'mousedown') return;
        
        setIsDragging(true);
        const mode = isSelected ? 'deselect' : 'select';
        setDragMode(mode);
        onDateToggle(dateStr);
    };

    const handleMouseEnter = (dateStr: string, isSelected: boolean) => {
        if (!isDragging || !dragMode) return;

        if (dragMode === 'select' && !isSelected) {
            onDateToggle(dateStr);
        } else if (dragMode === 'deselect' && isSelected) {
            onDateToggle(dateStr);
        }
    };

    const handleClick = (dateStr: string) => {
        // Simple click toggle for touch devices
        if (!isDragging) {
            onDateToggle(dateStr);
        }
    };

    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="space-y-6 select-none">
            <label className="block text-sm font-bold text-gray-700 mb-1">
                가능한 날짜 선택 (드래그 가능)
            </label>

            {Object.entries(groupedDates).map(([month, dates]) => {
                // Get the day of the week for the first date in this group (0-6)
                const startDay = dates[0].getDay();

                return (
                    <div key={month} className="space-y-3">
                        <h3 className="text-lg font-bold text-purple-700 border-b border-purple-100 pb-1 mt-4">
                            {month}
                        </h3>

                        {/* Weekday Header */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {weekdays.map((day, i) => (
                                <div key={day} className={`text-center text-[10px] font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells for padding */}
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {dates.map((date) => {
                                const dateStr = format(date, 'yyyy-MM-dd');
                                const isSelected = selectedDates.has(dateStr);
                                const voteCount = votes.filter((v) => v.available_date === dateStr).length;
                                const dayOfWeek = date.getDay();

                                return (
                                    <div
                                        key={dateStr}
                                        onMouseDown={(e) => handleMouseDown(e, dateStr, isSelected)}
                                        onMouseEnter={() => handleMouseEnter(dateStr, isSelected)}
                                        onClick={() => handleClick(dateStr)}
                                        className={`date-cell aspect-square flex items-center justify-center ${isSelected ? 'selected' : 'unselected'} cursor-pointer`}
                                    >
                                        <div className="text-center pointer-events-none">
                                            <p className={`text-sm font-bold leading-none ${isSelected ? 'text-white' :
                                                    dayOfWeek === 0 ? 'text-red-500' :
                                                        dayOfWeek === 6 ? 'text-blue-500' :
                                                            'text-gray-800'
                                                }`}>
                                                {format(date, 'd')}
                                            </p>
                                            {voteCount > 0 && (
                                                <p className={`text-[8px] mt-0.5 leading-none font-medium ${isSelected ? 'text-white/90' : 'text-purple-600'}`}>
                                                    {voteCount}명
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );

}
