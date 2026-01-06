import { useState, useEffect } from 'react';
import { supabase, type Event, type Vote } from '@/lib/supabase';

export function useEventData(eventId: string) {
    const [event, setEvent] = useState<Event | null>(null);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventAndVotes = async () => {
        try {
            // Fetch event
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (eventError) throw eventError;
            setEvent(eventData);

            // Fetch votes
            const { data: votesData, error: votesError } = await supabase
                .from('votes')
                .select('*')
                .eq('event_id', eventId);

            if (votesError) throw votesError;
            setVotes(votesData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('이벤트를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEventAndVotes();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`votes:event_id=eq.${eventId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'votes',
                    filter: `event_id=eq.${eventId}`,
                },
                () => {
                    fetchEventAndVotes();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [eventId]);

    return { event, votes, isLoading, fetchEventAndVotes };
}

