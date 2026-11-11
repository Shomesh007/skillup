import React from 'react';
import { UserLevel } from '../types';
export const paths = [
  { id: UserLevel.STUDENT, number: '01', title: 'I’m a student', description: 'Explore what’s possible', name: 'Student' },
  { id: UserLevel.GRADUATE, number: '02', title: 'My first job', description: 'Turn potential into proof', name: 'Graduate' },
  { id: UserLevel.PRO, number: '03', title: 'A fresh start', description: 'Make your next career move', name: 'Career switcher' }
];
export default function PathCards({ onSelect }: { onSelect: (level: UserLevel) => void }) {
  return <div className="path-cards">{paths.map((path, index) => <button key={path.id} className={`path-card path-${index}`} onClick={() => onSelect(path.id)}><span className="path-art" aria-hidden="true"/><span className="path-copy"><span className="path-no">{path.number}</span><strong>{path.title}</strong><span>{path.description}</span><span className="round-arrow" aria-hidden="true">→</span></span></button>)}</div>;
}
