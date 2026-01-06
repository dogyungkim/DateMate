import { useState, useEffect } from 'react';
import { type Event, type Vote } from '@/lib/supabase';
import DateSelector from './DateSelector';
import { eachDayOfInterval, parseISO } from 'date-fns';

interface VoteFormProps {
    event: Event;
    votes: Vote[];
    eventId: string;
    onVoteSubmit: (userName: string, selectedDates: Set<string>) => Promise<void>;
    initialUserName?: string;
}

export default function VoteForm({
    event,
    votes,
    eventId,
    onVoteSubmit,
    initialUserName = ''
}: VoteFormProps) {
    const [userName, setUserName] = useState(initialUserName);
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-load schedule if initialUserName is provided (e.g., when clicking 'Edit' after voting)
    useEffect(() => {
        if (initialUserName) {
            const existingVotes = votes
                .filter((v) => v.user_name === initialUserName)
                .map((v) => v.available_date);

            if (existingVotes.length > 0) {
                setSelectedDates(new Set(existingVotes));
            }
        }
    }, [initialUserName, votes]);


    const allDates = eachDayOfInterval({
        start: parseISO(event.date_range_start),
        end: parseISO(event.date_range_end),
    });

    const handleLoadSchedule = () => {
        const trimmedName = userName.trim();
        if (!trimmedName) {
            alert('참여자 성함을 입력해주세요.');
            return;
        }

        const existingVotes = votes
            .filter((v) => v.user_name === trimmedName)
            .map((v) => v.available_date);

        if (existingVotes.length > 0) {
            setSelectedDates(new Set(existingVotes));
            alert(`${trimmedName}님의 투표 내역을 불러왔습니다. 🎉\n날짜를 수정한 뒤 하단 버튼을 눌러주세요.`);
        } else {
            alert('해당 이름으로 투표한 내역이 없습니다. 신규 투표를 진행해 주세요!');
        }
    };

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
        <div className="glass-card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">🗓️ 투표하기</h2>

            <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    참여자 성함
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="예: 홍길동"
                        className="flex-1 px-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-lg shadow-sm placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={handleLoadSchedule}
                        className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-2xl hover:bg-purple-200 active:scale-95 transition-all text-sm shadow-sm whitespace-nowrap"
                    >
                        불러오기
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 ml-1">
                    * 이전에 투표하셨다면 이름을 입력하고 '불러오기'를 눌러주세요.
                </p>
            </div>

            <DateSelector
                allDates={allDates}
                selectedDates={selectedDates}
                votes={votes}
                onDateToggle={handleDateToggle}
            />

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !userName.trim()}
                className="btn-gradient w-full mt-10 py-4 text-lg font-bold disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed active:scale-95 transition-all"
            >
                {isSubmitting ? '제출 중...' : '투표 반영하기 ✨'}
            </button>
        </div>


    );
}

