"use client";

import { useEffect, useState } from "react";

const COVER_IDS = [
  8231823, 7222246, 8225261, 12547191, 10521270, 8091016,
  7984916, 10110415, 12818044, 8755297, 12003519, 10413396,
  8406786, 8314142, 7327624, 10476019, 6979938, 12645170,
  8579576, 10109434, 7890961, 8490894, 12349851, 6624877,
  10179684, 8741857, 7877366, 10667240, 13521220, 8458270,
  6300729, 7730373, 7944082, 8756770, 8761508, 10141683,
  10434737, 10427017, 10284209, 4917603, 980448, 6809781,
];

type FloatingBook = {
  id: number;
  coverId: number;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  delay: number;
  opacity: number;
};

function generateBooks(): FloatingBook[] {
  const cols = 8;
  const rows = 5;
  const total = cols * rows;
  const shuffled = [...COVER_IDS].sort(() => Math.random() - 0.5);

  const cellW = 100 / cols;
  const cellH = 100 / rows;

  return Array.from({ length: total }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const bookH = 80 + Math.random() * 30;
    const bookW = bookH * 0.66;

    return {
      id: i,
      coverId: shuffled[i % shuffled.length],
      x: col * cellW + cellW * 0.5 + (Math.random() - 0.5) * cellW * 0.3,
      y: row * cellH + cellH * 0.5 + (Math.random() - 0.5) * cellH * 0.25,
      w: bookW,
      h: bookH,
      speed: 20 + Math.random() * 18,
      delay: Math.random() * -20,
      opacity: 0.09 + Math.random() * 0.07,
    };
  });
}

export default function FloatingCovers() {
  const [books, setBooks] = useState<FloatingBook[]>([]);

  useEffect(() => {
    setBooks(generateBooks());
  }, []);

  if (books.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {books.map((book) => (
        <div
          key={book.id}
          className="absolute rounded-sm overflow-hidden"
          style={{
            left: `${book.x}%`,
            top: `${book.y}%`,
            width: `${book.w}px`,
            height: `${book.h}px`,
            opacity: book.opacity,
            animation: `float-drift ${book.speed}s ease-in-out ${book.delay}s infinite`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
