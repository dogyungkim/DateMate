import { useRouter } from 'next/navigation';
import { Calendar, Users, Share2, ArrowLeft, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type Event, type Vote } from '@/lib/supabase';

interface EventHeaderProps {
    event: Event;
    votes: Vote[];
    allDatesCount: number;
    copied: boolean;
    onCopyLink: () => void;
}

export default function EventHeader({
    event,
    votes,
    allDatesCount,
    copied,
    onCopyLink
}: EventHeaderProps) {
    const router = useRouter();
    const participants = new Set(votes.map((v) => v.user_name));

    return (
        <div className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                        <p className="text-gray-600">
                            {format(parseISO(event.date_range_start), 'PPP', { locale: ko })} ~{' '}
                            {format(parseISO(event.date_range_end), 'PPP', { locale: ko })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onCopyLink}
                    className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white rounded-lg transition-all"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">복사됨!</span>
                        </>
                    ) : (
                        <>
                            <Share2 className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-semibold text-gray-700">링크 복사</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                        <strong>{participants.size}명</strong> 참여 중
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-700">
                        <strong>{allDatesCount}일</strong> 후보
                    </span>
                </div>
            </div>
        </div>
    );
}

