import React from 'react';
import { UserLevel } from '../types';
import Brand from './Brand';
import PathCards from './PathCards';
export default function LevelSelectView({ onSelect, onBack }: { onSelect: (level: UserLevel) => void; onBack?: () => void }) {
 return <div className="path-select-page"><header><Brand onClick={onBack}/><span className="small-kicker">LET’S FIND YOUR DIRECTION</span></header><button className="text-button path-select-back" onClick={onBack}>← Back to home</button><section className="path-select-content" aria-labelledby="path-choice-title"><div className="path-select-intro"><span className="hero-kicker">Your story. Your starting point.</span><h1 id="path-choice-title">Where are you at?</h1><p>You don’t need it all figured out. Pick the chapter you’re in.</p></div><PathCards onSelect={onSelect}/><p className="path-footnote">No wrong answers. You can change your path anytime.</p></section></div>;
}
