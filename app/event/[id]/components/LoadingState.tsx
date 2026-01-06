import { Calendar } from 'lucide-react';

export default function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card p-8">
                <div className="animate-pulse text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-600">이벤트를 불러오는 중...</p>
                </div>
            </div>
        </div>
    );
}

