'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format, addDays } from 'date-fns';

export default function CreateEvent() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !startDate || !endDate) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('종료일은 시작일보다 이후여야 합니다.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from('events')
                .insert([
                    {
                        title,
                        date_range_start: startDate,
                        date_range_end: endDate,
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            // Navigate to the event page
            router.push(`/event/${data.id}`);
        } catch (error) {
            console.error('Error creating event:', error);
            alert('이벤트 생성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    // Set default dates (today + 7 days)
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekLater = format(addDays(new Date(), 7), 'yyyy-MM-dd');

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="mr-3 p-2 rounded-xl hover:bg-white/50 transition-colors bg-white/30"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-7 h-7 text-purple-600" />
                            새 이벤트 만들기
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Title */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            이벤트 제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 팀 회식 날짜 정하기"
                            className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-lg shadow-sm"
                            required
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                시작 날짜
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={today}
                                className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-lg shadow-sm appearance-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                종료 날짜
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || today}
                                className="w-full px-4 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all text-lg shadow-sm appearance-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4">
                        <p className="text-sm text-purple-900 leading-relaxed">
                            💡 <strong>투표 방식:</strong> 기간을 설정하면 달력이 생성됩니다. 친구들은 로그인 없이 이름만 입력하고 투표할 수 있어요!
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-gradient w-full py-4 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '생성 중...' : '이벤트 생성하기 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}
