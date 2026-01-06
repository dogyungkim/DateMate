interface VoteCompletedProps {
    onEdit: () => void;
}

export default function VoteCompleted({ onEdit }: VoteCompletedProps) {
    return (
        <div className="glass-card p-6 text-center">
            <p className="text-gray-700 mb-4">투표가 완료되었습니다!</p>
            <button
                onClick={onEdit}
                className="text-purple-600 hover:text-purple-700 font-semibold"
            >
                투표 수정하기
            </button>
        </div>
    );
}

