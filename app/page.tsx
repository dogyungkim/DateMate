'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            DateMate
          </h1>
          <p className="text-gray-600 text-base sm:text-lg px-2">
            그룹의 일정을 가장 쉽게 조율하는 방법
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-4 bg-white/50 rounded-2xl p-4 transition-all active:scale-95 shadow-sm border border-white/40">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">간편함</h3>
              <p className="text-sm text-gray-600">로그인 없이 바로 시작하세요</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/50 rounded-2xl p-4 transition-all active:scale-95 shadow-sm border border-white/40">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">실시간</h3>
              <p className="text-sm text-gray-600">투표 현황이 즉시 업데이트됩니다</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/50 rounded-2xl p-4 transition-all active:scale-95 shadow-sm border border-white/40">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">직관적</h3>
              <p className="text-sm text-gray-600">최적의 날짜를 한눈에 확인하세요</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/create')}
          className="btn-gradient w-full text-lg py-4"
        >
          새 이벤트 만들기 🎉
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          링크만 공유하면 누구나 참여할 수 있어요
        </p>
      </div>
    </div>

  );
}
