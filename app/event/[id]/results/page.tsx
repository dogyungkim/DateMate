'use client';

import { useParams, useRouter } from 'next/navigation';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Calendar, Users, CheckCircle2, XCircle } from 'lucide-react';
import { useEventData } from '../hooks/useEventData';
import LoadingState from '../components/LoadingState';
import EventNotFound from '../components/EventNotFound';

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const { event, votes, isLoading } = useEventData(eventId);

    if (isLoading) {
        return <LoadingState />;
    }

    if (!event) {
        return <EventNotFound />;
    }

    const allDates = eachDayOfInterval({
        start: parseISO(event.date_range_start),
        end: parseISO(event.date_range_end),
    });

    // 날짜별 투표 현황
    const dateVoteMap = new Map<string, { count: number; voters: string[] }>();
    allDates.forEach((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        dateVoteMap.set(dateStr, { count: 0, voters: [] });
    });

    votes.forEach((vote) => {
        const entry = dateVoteMap.get(vote.available_date);
        if (entry && !entry.voters.includes(vote.user_name)) {
            entry.count += 1;
            entry.voters.push(vote.user_name);
        }
    });

    // 참여자 목록
    const participants = Array.from(new Set(votes.map((v) => v.user_name)));
    const totalParticipants = participants.length;

    // 참여자별 투표 현황
    const participantVotesMap = new Map<string, string[]>();
    participants.forEach((name) => {
        participantVotesMap.set(name, []);
    });
    votes.forEach((vote) => {
        const dates = participantVotesMap.get(vote.user_name);
        if (dates && !dates.includes(vote.available_date)) {
            dates.push(vote.available_date);
        }
    });

    // 날짜별 투표율 계산
    const dateVoteList = Array.from(dateVoteMap.entries())
        .map(([date, { count, voters }]) => ({
            date,
            count,
            voters,
            percentage: totalParticipants > 0 ? (count / totalParticipants) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

    const maxVotes = Math.max(...dateVoteList.map((d) => d.count), 1);

    return (
        <div className="min-h-screen py-6 px-3 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* 헤더 */}
                <div className="glass-card">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        돌아가기
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        📊 투표 결과
                    </h1>
                    <p className="text-lg text-gray-700 font-semibold mb-4">{event.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {format(parseISO(event.date_range_start), 'M월 d일', { locale: ko })} ~{' '}
                                {format(parseISO(event.date_range_end), 'M월 d일', { locale: ko })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>참여자: {totalParticipants}명</span>
                        </div>
                    </div>
                </div>

                {/* 날짜별 투표 현황 */}
                <div className="glass-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📅 날짜별 투표 현황
                    </h2>
                    <div className="space-y-3">
                        {dateVoteList.map((item) => (
                            <div
                                key={item.date}
                                className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold text-gray-800">
                                            {format(parseISO(item.date), 'M월 d일 (EEE)', {
                                                locale: ko,
                                            })}
                                        </div>
                                        <div className="text-lg font-black text-purple-600">
                                            {item.count}명
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.percentage.toFixed(0)}%
                                    </div>
                                </div>
                                {/* 프로그레스 바 */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(item.count / maxVotes) * 100}%` }}
                                    />
                                </div>
                                {/* 투표자 목록 */}
                                {item.voters.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.voters.map((voter) => (
                                            <span
                                                key={voter}
                                                className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                                            >
                                                {voter}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400 italic">투표 없음</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 참여자별 투표 현황 */}
                <div className="glass-card">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        👥 참여자별 투표 현황
                    </h2>
                    {participants.length > 0 ? (
                        <div className="space-y-4">
                            {participants.map((participant) => {
                                const votedDates = participantVotesMap.get(participant) || [];
                                return (
                                    <div
                                        key={participant}
                                        className="bg-white/60 rounded-2xl p-4 border border-white/40 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="font-bold text-gray-800">
                                                {participant}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {votedDates.length}일 선택
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {allDates.map((date) => {
                                                const dateStr = format(date, 'yyyy-MM-dd');
                                                const isVoted = votedDates.includes(dateStr);
                                                return (
                                                    <div
                                                        key={dateStr}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                                            isVoted
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                    >
                                                        {isVoted ? (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4" />
                                                        )}
                                                        <span>
                                                            {format(date, 'M월 d일 (EEE)', {
                                                                locale: ko,
                                                            })}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            아직 투표한 참여자가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

