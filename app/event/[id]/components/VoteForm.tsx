import { useState, useEffect } from 'react';
import { type Event, type Vote } from '@/lib/supabase';
import DateSelector from './DateSelector';
import { eachDayOfInterval, parseISO } from 'date-fns';

interface VoteFormProps {
    event: Event;
    votes: Vote[];
    eventId: string;
    onVoteSubmit: (userName: string, selectedDates: Set<string>) => Promise<void>;
}

export default function VoteForm({ event, votes, eventId, onVoteSubmit }: VoteFormProps) {
    const [userName, setUserName] = useState('');
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const allDates = eachDayOfInterval({
        start: parseISO(event.date_range_start),
        end: parseISO(event.date_range_end),
    });

    // Pre-fill selected dates if the user has already voted
    useEffect(() => {
        const trimmedName = userName.trim();
        if (trimmedName && votes.length > 0) {
            const existingVotes = votes
                .filter((v) => v.user_name === trimmedName)
                .map((v) => v.available_date);

            if (existingVotes.length > 0) {
                const currentSelection = Array.from(selectedDates).sort().join(',');
                const savedSelection = existingVotes.sort().join(',');
                if (currentSelection !== savedSelection) {
                    setSelectedDates(new Set(existingVotes));
                }
            }
        }
    }, [userName, votes]);

    const handleDateToggle = (date: string) => {
        const newSelected = new Set(selectedDates);
        if (newSelected.has(date)) {
            newSelected.delete(date);
        } else {
            newSelected.add(date);
        }
        setSelectedDates(newSelected);
    };

    const handleSubmit = async () => {
        const trimmedName = userName.trim();
        if (!trimmedName) {
            alert('이름을 입력해주세요.');
            return;
        }

        if (selectedDates.size === 0) {
            alert('최소 1개 이상의 날짜를 선택해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onVoteSubmit(trimmedName, selectedDates);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">투표하기</h2>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    당신의 이름
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                />
            </div>

            <DateSelector
                allDates={allDates}
                selectedDates={selectedDates}
                votes={votes}
                onDateToggle={handleDateToggle}
            />

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-gradient w-full mt-6 disabled:opacity-50"
            >
                {isSubmitting ? '제출 중...' : '투표하기 ✨'}
            </button>
        </div>
    );
}

