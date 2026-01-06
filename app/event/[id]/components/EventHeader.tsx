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
        <div className="glass-card">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-1">{event.title}</h1>
                        <p className="text-sm text-gray-500 font-medium">
                            {format(parseISO(event.date_range_start), 'MMM d일', { locale: ko })} ~{' '}
                            {format(parseISO(event.date_range_end), 'MMM d일', { locale: ko })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-gray-600">
                                <strong>{participants.size}명</strong> 참여
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs text-gray-600">
                                <strong>{allDatesCount}일</strong> 후보
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onCopyLink}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-sm shadow-sm ${copied
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-white text-purple-600 border border-purple-100'
                            }`}
                    >
                        {copied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Share2 className="w-4 h-4" />
                        )}
                        {copied ? '복사됨' : '공유'}
                    </button>
                </div>
            </div>
        </div>

    );
}

