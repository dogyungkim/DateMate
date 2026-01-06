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
        <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                가장 많이 선택된 날짜 TOP 5
            </h2>
            <div className="space-y-3">
                {topDates.map((item, index) => (
                    <div
                        key={item.date}
                        className="bg-white/70 rounded-xl p-4 flex items-center justify-between hover:bg-white transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <span
                                className={`rank-badge ${
                                    index === 0
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
                                <p className="font-semibold text-gray-800">
                                    {format(parseISO(item.date), 'PPP', { locale: ko })}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.voters.join(', ')}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{item.count}명</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

