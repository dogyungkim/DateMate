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

    const handleMouseDown = (dateStr: string, isSelected: boolean) => {
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

    return (
        <div className="space-y-6 select-none">
            <label className="block text-sm font-bold text-gray-700 mb-1">
                가능한 날짜 선택 (드래그 가능)
            </label>

            {Object.entries(groupedDates).map(([month, dates]) => (
                <div key={month} className="space-y-3">
                    <h3 className="text-lg font-bold text-purple-700 border-b border-purple-100 pb-1 mt-4">
                        {month}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                        {dates.map((date) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const isSelected = selectedDates.has(dateStr);
                            const voteCount = votes.filter((v) => v.available_date === dateStr).length;

                            return (
                                <div
                                    key={dateStr}
                                    onMouseDown={() => handleMouseDown(dateStr, isSelected)}
                                    onMouseEnter={() => handleMouseEnter(dateStr, isSelected)}
                                    className={`date-cell ${isSelected ? 'selected' : 'unselected'} touch-none`}
                                >
                                    <div className="text-center pointer-events-none">
                                        <p className="text-[10px] opacity-70 leading-none mb-1">
                                            {format(date, 'EEE', { locale: ko })}
                                        </p>
                                        <p className="text-base font-bold leading-none">{format(date, 'd')}</p>
                                        {voteCount > 0 && (
                                            <p className="text-[10px] mt-1 opacity-80 font-medium">{voteCount}명</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
