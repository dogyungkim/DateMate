'use client';

import { useRouter } from 'next/navigation';
import { Calendar, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-12 max-w-2xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            DateMate
          </h1>
          <p className="text-gray-600 text-lg">
            그룹의 일정을 가장 쉽게 조율하는 방법
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/50 rounded-xl p-4 text-center transition-all hover:bg-white/70 hover:scale-105">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-gray-800 mb-1">간편함</h3>
            <p className="text-sm text-gray-600">로그인 없이 바로 시작</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center transition-all hover:bg-white/70 hover:scale-105">
            <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <h3 className="font-semibold text-gray-800 mb-1">실시간</h3>
            <p className="text-sm text-gray-600">투표 현황 즉시 반영</p>
          </div>
          <div className="bg-white/50 rounded-xl p-4 text-center transition-all hover:bg-white/70 hover:scale-105">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-gray-800 mb-1">직관적</h3>
            <p className="text-sm text-gray-600">한눈에 보는 결과</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/create')}
          className="btn-gradient w-full text-lg"
        >
          새 이벤트 만들기 🎉
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          링크만 공유하면 모두가 참여할 수 있어요
        </p>
      </div>
    </div>
  );
}
