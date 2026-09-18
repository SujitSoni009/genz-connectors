import React from 'react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 text-center">
      <h1 className="text-3xl font-bold font-serif text-stone-900 mb-4">{title}</h1>
      <p className="text-stone-600">This page is under construction for the hackathon demo.</p>
    </div>
  );
}
