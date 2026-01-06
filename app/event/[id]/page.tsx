'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { eachDayOfInterval, parseISO } from 'date-fns';

// Hooks
import { useEventData } from './hooks/useEventData';
import { useTopDates } from './hooks/useTopDates';

// Components
import LoadingState from './components/LoadingState';
import EventNotFound from './components/EventNotFound';
import EventHeader from './components/EventHeader';
import TopDatesRanking from './components/TopDatesRanking';
import VoteForm from './components/VoteForm';
import VoteCompleted from './components/VoteCompleted';

export default function EventPage() {
    const params = useParams();
    const eventId = params.id as string;

    const { event, votes, isLoading, fetchEventAndVotes } = useEventData(eventId);
    const topDates = useTopDates(event, votes);

    const [copied, setCopied] = useState(false);
    const [showVoteForm, setShowVoteForm] = useState(true);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleVoteSubmit = async (userName: string, selectedDates: Set<string>) => {
        try {
            // Delete existing votes for this user
            await supabase
                .from('votes')
                .delete()
                .eq('event_id', eventId)
                .eq('user_name', userName);

            // Insert new votes
            const votesToInsert = Array.from(selectedDates).map((date) => ({
                event_id: eventId,
                user_name: userName,
                available_date: date,
            }));

            const { error } = await supabase.from('votes').insert(votesToInsert);

            if (error) throw error;

            // Immediate refresh
            await fetchEventAndVotes();

            alert('투표가 반영되었습니다! 🎉');
            setShowVoteForm(false);
        } catch (error) {
            console.error('Error submitting vote:', error);
            alert('투표 제출에 실패했습니다.');
            throw error;
        }
    };

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

    return (
        <div className="min-h-screen py-6 px-3 sm:p-8">
            <div className="max-w-md mx-auto space-y-4">
                <EventHeader
                    event={event}
                    votes={votes}
                    allDatesCount={allDates.length}
                    copied={copied}
                    onCopyLink={handleCopyLink}
                />

                <TopDatesRanking topDates={topDates} />

                {showVoteForm ? (
                    <VoteForm
                        event={event}
                        votes={votes}
                        eventId={eventId}
                        onVoteSubmit={handleVoteSubmit}
                    />
                ) : (
                    <VoteCompleted onEdit={() => setShowVoteForm(true)} />
                )}
            </div>
        </div>
    );
}
