'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  PullToRefresh,
  RollingNumber,
  ReorderList,
  ExpandableCard,
  SuccessCheckmark,
} from '@manga/ui';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface MangaItem {
  id: string;
  title: string;
  volume: string;
  badge: string;
  rating: string;
}

export default function MicroInteractionsPage() {
  // 1. Button Press
  const [pressCount, setPressCount] = React.useState(0);

  // 2. Pull to Refresh
  const [refreshCount, setRefreshCount] = React.useState(0);
  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setRefreshCount((c) => c + 1);
  };

  // 3. Rolling Numbers
  const [balance, setBalance] = React.useState(1485.50);

  // 4. Drag to Reorder
  const [mangaList, setMangaList] = React.useState<MangaItem[]>([
    { id: '1', title: 'Chainsaw Man', volume: 'Vol. 14', badge: 'Trending', rating: '4.9' },
    { id: '2', title: 'Jujutsu Kaisen', volume: 'Vol. 25', badge: 'Hot', rating: '4.8' },
    { id: '3', title: 'One Piece', volume: 'Vol. 108', badge: 'Classic', rating: '5.0' },
    { id: '4', title: 'Berserk Deluxe', volume: 'Vol. 1', badge: 'Masterpiece', rating: '4.95' },
  ]);

  // 6. Success Checkmark
  const [checkmarkKey, setCheckmarkKey] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1D1917] flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 w-full">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#B5532E]/10 text-[#B5532E]">
            Haptic & Kinetic Mechanics
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight apple-display text-[#1D1917]">
            Fluid Interactions & Physics
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#78716C]">
            Tactile micro-interactions engineered with physical springs, resistance damping, and direct manipulation.
          </p>
        </div>

        {/* Grid of Micro-Interactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Button Press: 95% Squish & Spring */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E1815]">1. Button Press: 95% Squish</h2>
                <p className="text-xs text-[#8C8279]">Sinks to 95% on press, springs back on release</p>
              </div>
              <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
                scale(0.95)
              </span>
            </div>

            <p className="text-xs text-[#5A504B] leading-relaxed">
              Immediate 80ms compression gives instantaneous tap confirmation to the thumb, while a cubic spring curve creates physical momentum upon release.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setPressCount((c) => c + 1)}
              >
                Primary Tap ({pressCount})
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPressCount((c) => c + 1)}
              >
                Dark Tap
              </Button>
              <Button
                variant="outline"
                onClick={() => setPressCount((c) => c + 1)}
              >
                Outline
              </Button>
            </div>
          </section>

          {/* 2. Pull to Refresh: 35% Resistance */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E1815]">2. Pull to Refresh: 35% Damping</h2>
                <p className="text-xs text-[#8C8279]">Finger moves 100%, content moves 35%</p>
              </div>
              <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
                dy * 0.35
              </span>
            </div>

            <p className="text-xs text-[#5A504B] leading-relaxed">
              Drag down inside the box below with your mouse or touch. Asymptotic damping gives real-world weight and tension before snapping.
            </p>

            <div className="border border-dashed border-[#D8C3A5] rounded-xl overflow-hidden bg-[#FAF6F0]/50 h-44">
              <PullToRefresh onRefresh={handleRefresh} style={{ height: '100%' }}>
                <div className="p-4 flex flex-col items-center justify-center text-center h-44">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-[#B5532E]">
                    <i className="fa-solid fa-arrow-down text-sm"></i>
                  </div>
                  <p className="text-xs font-semibold text-[#2A2320]">
                    Pull down inside this card
                  </p>
                  <p className="text-[11px] text-[#8C8279] mt-1">
                    Refreshed: {refreshCount} times
                  </p>
                </div>
              </PullToRefresh>
            </div>
          </section>

          {/* 3. Rolling Numbers (Ticker) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E1815]">3. Rolling Numbers (Ticker)</h2>
                <p className="text-xs text-[#8C8279]">Digits roll into place with staggered cascade</p>
              </div>
              <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
                stagger 40ms
              </span>
            </div>

            <p className="text-xs text-[#5A504B] leading-relaxed">
              When numbers update, each place value spins in sequence so the brain visualizes the direction and scale of change without missing it.
            </p>

            <div className="p-5 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-[#8C8279] uppercase tracking-wider">
                  Live Balance
                </div>
                <div className="text-3xl font-extrabold text-[#1E1815] mt-1">
                  <RollingNumber
                    value={balance.toFixed(2)}
                    prefix="$"
                    staggerMs={45}
                    durationMs={650}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBalance((b) => Math.max(0, b - 50.25))}
                >
                  -$50.25
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setBalance((b) => b + 124.50)}
                >
                  +$124.50
                </Button>
              </div>
            </div>
          </section>

          {/* 4. Success Checkmark */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1E1815]">4. Success Stroke & Tick</h2>
                <p className="text-xs text-[#8C8279]">First the circle draws, then the tick</p>
              </div>
              <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
                circle -&gt; tick
              </span>
            </div>

            <p className="text-xs text-[#5A504B] leading-relaxed">
              Sequential completion narrative: the enclosing circle validates the perimeter, the tick marks across with slight overlap, followed by a settling pop.
            </p>

            <div className="p-5 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SuccessCheckmark
                  key={checkmarkKey}
                  size={48}
                  color="#4F6B3A"
                  strokeWidth={3.8}
                />
                <div>
                  <div className="text-sm font-bold text-[#1E1815]">Payment Verified</div>
                  <div className="text-xs text-[#4F6B3A] font-medium">Click icon or replay to re-trigger</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCheckmarkKey((k) => k + 1)}
              >
                Replay
              </Button>
            </div>
          </section>
        </div>

        {/* 5. Drag to Reorder */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1E1815]">5. Drag to Reorder: Lift, Grow 5% & Slide Siblings</h2>
              <p className="text-xs text-[#8C8279]">Row lifts and grows 5% while adjacent rows glide out of the way</p>
            </div>
            <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
              scale(1.05) + FLIP
            </span>
          </div>

          <p className="text-xs text-[#5A504B] leading-relaxed">
            Click and drag any row vertically. Picking up a row elevates it above the plane and scales it by 5%, casting an ambient shadow like a physical card.
          </p>

          <ReorderList
            items={mangaList}
            onReorder={setMangaList}
            keyExtractor={(item) => item.id}
            renderItem={(item, isDragging) => (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  isDragging
                    ? 'bg-white border-[#B5532E]'
                    : 'bg-[#FAF6F0]/80 border-[#E7D5BC] hover:border-[#D8C3A5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#8C8279] cursor-grab">
                    <i className="fa-solid fa-grip-vertical text-sm"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1E1815]">{item.title}</div>
                    <div className="text-xs text-[#8C8279]">{item.volume}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#B5532E]/10 text-[#B5532E]">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold text-[#2A2320]">
                    ★ {item.rating}
                  </span>
                </div>
              </div>
            )}
          />
        </section>

        {/* 6. Card Expand: Ease Out in 350ms */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7D5BC] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7D5BC]/60 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1E1815]">6. Card Expand: Ease Out in 350ms</h2>
              <p className="text-xs text-[#8C8279]">Fast at first, decelerating gracefully into full view</p>
            </div>
            <span className="text-xs font-mono bg-[#FAF6F0] px-2 py-1 rounded text-[#8C8279]">
              350ms ease-out
            </span>
          </div>

          <p className="text-xs text-[#5A504B] leading-relaxed">
            Click the card below to see the 350ms quartic ease-out transition. Fast initial acceleration honours user intent, while gradual deceleration creates an effortless landing.
          </p>

          <ExpandableCard
            trigger={({ open }) => (
              <div className="p-5 rounded-2xl border border-[#E7D5BC] bg-gradient-to-br from-[#FAF6F0] to-[#F1E4D3] hover:shadow-md transition-shadow group flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-block text-[11px] font-bold text-[#B5532E] uppercase tracking-wider">
                    Featured Edition
                  </div>
                  <h3 className="text-base font-bold text-[#1E1815] group-hover:text-[#B5532E] transition-colors">
                    Berserk: The Complete Deluxe Hardcover
                  </h3>
                  <p className="text-xs text-[#8C8279]">
                    Click to trigger 350ms decelerated modal expansion
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#B5532E] group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-expand text-xs"></i>
                </div>
              </div>
            )}
          >
            {({ close }) => (
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#B5532E] uppercase tracking-wider">
                      Collector Series
                    </span>
                    <h2 className="text-2xl font-black text-[#1E1815] mt-1">
                      Berserk: The Complete Deluxe Hardcover
                    </h2>
                    <p className="text-sm text-[#8C8279] mt-0.5">Kentaro Miura • Dark Horse Manga</p>
                  </div>
                  <button
                    onClick={close}
                    className="w-9 h-9 rounded-full bg-[#FAF6F0] hover:bg-[#E7D5BC] text-[#2A2320] flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E7D5BC] text-xs text-[#5A504B] space-y-2">
                  <p className="font-semibold text-[#1E1815]">Expansion Transition Specification:</p>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#8C8279]">
                    <li>duration: 350ms</li>
                    <li>timing-function: cubic-bezier(0.16, 1, 0.3, 1)</li>
                    <li>backdrop: rgba(26, 21, 18, 0.65) blur(4px)</li>
                    <li>properties: transform, opacity</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={close}>
                    Close Card
                  </Button>
                  <Button variant="primary" onClick={close}>
                    Confirm & Proceed
                  </Button>
                </div>
              </div>
            )}
          </ExpandableCard>
        </section>
      </main>
      <Footer />
    </div>
  );
}
