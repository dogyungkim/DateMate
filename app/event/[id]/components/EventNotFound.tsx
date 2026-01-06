import { useRouter } from 'next/navigation';

export default function EventNotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card p-8 text-center">
                <p className="text-gray-600 mb-4">이벤트를 찾을 수 없습니다.</p>
                <button onClick={() => router.push('/')} className="btn-gradient">
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}

