'use client';

import Link from 'next/link';

export default function Home() {
  const games = [
    {
      id: 'capybara',
      name: '🦫 카피바라 방치형 RPG',
      description: '도트 아트 스타일의 방치형 RPG. 카피바라를 키워 최강이 되세요!',
      color: 'from-amber-600 to-orange-600',
      released: true,
    },
    {
      id: 'game2',
      name: '🌊 다음 게임',
      description: '준비 중...',
      color: 'from-blue-600 to-cyan-600',
      released: false,
    },
    {
      id: 'game3',
      name: '⚡ 곧 출시',
      description: '준비 중...',
      color: 'from-purple-600 to-pink-600',
      released: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
          🎮 Indie Games
        </h1>
        <p className="text-lg text-zinc-300">
          도트 픽셀 아트 방치형 게임 모음
        </p>
      </div>

      {/* Games Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-400 transition-all ${
              game.released ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <Link href={`/${game.id}`} className={game.released ? '' : 'pointer-events-none'}>
              <div
                className={`bg-gradient-to-br ${game.color} h-32 flex items-center justify-center relative ${
                  game.released ? 'hover:bg-black/20' : ''
                }`}
              >
                <span className="text-6xl">{game.name.split(' ')[0]}</span>
              </div>
            </Link>

            <div className="bg-zinc-900/80 p-4 backdrop-blur">
              <h3 className="text-lg font-bold text-white mb-2">{game.name}</h3>
              <p className="text-sm text-zinc-400 mb-4">{game.description}</p>

              {game.released ? (
                <Link
                  href={`/${game.id}`}
                  className="block w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-2 rounded-lg transition-all text-center"
                >
                  플레이 →
                </Link>
              ) : (
                <div className="w-full bg-zinc-700 text-zinc-400 font-bold py-2 rounded-lg cursor-not-allowed text-center">
                  준비 중...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 text-center text-zinc-500 text-sm">
        <p>매주 새로운 게임이 추가됩니다 🚀</p>
      </div>
    </div>
  );
}
