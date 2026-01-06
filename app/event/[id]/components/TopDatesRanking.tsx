import { Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type DateVoteCount } from '@/lib/supabase';

interface TopDatesRankingProps {
    topDates: DateVoteCount[];
}

export default function TopDatesRanking({ topDates }: TopDatesRankingProps) {
    if (topDates.length === 0) return null;

    return (
        <div className="glass-card">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                가장 많이 선택된 날짜
            </h2>
            <div className="space-y-3">
                {topDates.map((item, index) => (
                    <div
                        key={item.date}
                        className="bg-white/60 rounded-2xl p-4 flex items-center justify-between border border-white/40 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`rank-badge shrink-0 ${index === 0
                                        ? 'rank-1'
                                        : index === 1
                                            ? 'rank-2'
                                            : index === 2
                                                ? 'rank-3'
                                                : 'rank-default'
                                    }`}
                            >
                                {index + 1}
                            </span>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">
                                    {format(parseISO(item.date), 'M월 d일 (EEE)', { locale: ko })}
                                </p>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                    {item.voters.join(', ')}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-lg font-black text-purple-600 leading-none">{item.count}명</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
