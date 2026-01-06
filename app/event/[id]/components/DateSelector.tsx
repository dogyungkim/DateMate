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
    // Group dates by month
    const groupedDates = allDates.reduce((acc, date) => {
        const monthKey = format(date, 'yyyy년 M월', { locale: ko });
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(date);
        return acc;
    }, {} as Record<string, Date[]>);

    return (
        <div className="space-y-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                가능한 날짜 선택 (여러 개 선택 가능)
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
                                <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() => onDateToggle(dateStr)}
                                    className={`date-cell ${isSelected ? 'selected' : 'unselected'}`}
                                >
                                    <div className="text-center">
                                        <p className="text-[10px] opacity-70 leading-none mb-1">
                                            {format(date, 'EEE', { locale: ko })}
                                        </p>
                                        <p className="text-base font-bold leading-none">{format(date, 'd')}</p>
                                        {voteCount > 0 && (
                                            <p className="text-[10px] mt-1 opacity-80 font-medium">{voteCount}명</p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
