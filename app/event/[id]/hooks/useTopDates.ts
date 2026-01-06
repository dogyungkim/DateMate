import { useState, useEffect } from 'react';
import { type Event, type Vote, type DateVoteCount } from '@/lib/supabase';

export function useTopDates(event: Event | null, votes: Vote[]) {
    const [topDates, setTopDates] = useState<DateVoteCount[]>([]);

    useEffect(() => {
        if (!event || votes.length === 0) {
            setTopDates([]);
            return;
        }

        const dateMap = new Map<string, { count: number; voters: string[] }>();

        votes.forEach((vote) => {
            const dateKey = vote.available_date;
            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, { count: 0, voters: [] });
            }
            const entry = dateMap.get(dateKey)!;
            if (!entry.voters.includes(vote.user_name)) {
                entry.count += 1;
                entry.voters.push(vote.user_name);
            }
        });

        const sortedDates: DateVoteCount[] = Array.from(dateMap.entries())
            .map(([date, { count, voters }]) => ({ date, count, voters }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        setTopDates(sortedDates);
    }, [votes, event]);

    return topDates;
}

