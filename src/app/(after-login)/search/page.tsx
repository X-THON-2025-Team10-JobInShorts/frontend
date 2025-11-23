'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Clock, Search } from 'lucide-react';
import Image from 'next/image';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';

import type { Shorts } from '@/apis/shorts/dto.types';
import { mockFeed } from '@/apis/shorts/mock.data';

const searchResult = mockFeed.data;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Shorts[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* 🔄 검색 실행 */
  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    setIsFocused(false);

    const updated = [value, ...history.filter(h => h !== value)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));

    const filtered = searchResult.filter(item => item.title.includes(value));
    setResults(filtered);
  };

  /* 🗑 검색 기록 삭제 */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SEARCH_HISTORY);
  };

  const showHistory = isFocused && !query && results.length === 0;

  return (
    <main className="p-4">
      {/* 🔍 검색창 */}
      <div className="sticky top-0 bg-white pb-4 z-10">
        <div className="flex items-center gap-3">
          <Search
            onClick={() => handleSearch(query)}
            className="w-10 h-10 text-gray-500 rounded-lg p-2 hover:bg-gray-100"
          />
          <Input
            placeholder="검색"
            value={query}
            onFocus={() => setIsFocused(true)}
            onChange={e => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setResults([]);
                setIsFocused(true);
              }
            }}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            className="bg-gray-100"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsFocused(true);
              }}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 📌 최근 검색 */}
      {showHistory && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">최근 검색</p>
            {!!history.length && (
              <button onClick={clearHistory} className="text-sm text-gray-500">
                모두 지우기
              </button>
            )}
          </div>

          <ScrollArea className="h-[60vh] mt-3">
            {history.length === 0 && (
              <p className="text-gray-400 text-sm text-center pt-6">최근 검색 없음</p>
            )}

            <div className="flex flex-col gap-3">
              {history.map(item => (
                <button
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{item}</span>
                  </div>
                  <X
                    className="w-4 h-4 text-gray-400"
                    onClick={e => {
                      e.stopPropagation();
                      const filtered = history.filter(h => h !== item);
                      setHistory(filtered);
                      localStorage.setItem(
                        LOCAL_STORAGE_KEYS.SEARCH_HISTORY,
                        JSON.stringify(filtered),
                      );
                    }}
                  />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* 🔍 검색 결과 */}
      {!showHistory && query && results.length === 0 && (
        <p className="text-center text-gray-400 mt-10">검색 결과가 없습니다.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {results.map(item => (
            <div key={item.id} className="relative">
              <Image
                src={item.videoUrl} // [TODO] 썸네일 URL로 변경 필요
                alt={item.title}
                width={400}
                height={600}
                className="rounded-lg object-cover w-full h-40"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
