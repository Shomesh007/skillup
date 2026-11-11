import React from 'react';
import { AppView } from '../types';
import { Icon } from './Brand';
export default function CareerMap({ onExplore }: { onExplore: (view: AppView) => void }) {
  return <div className="career-map"><img className="career-map-image" src="/images/career-map.png" alt="A blue path connects a graduation cap, a location marker, and a briefcase on three rising platforms." width="1536" height="1024" fetchPriority="high"/><svg className="map-dotted-route" viewBox="0 0 700 500" aria-hidden="true"><path d="M90 285 C140 100 220 75 300 110 S410 -10 515 67" fill="none" stroke="#2549eb" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round"/></svg><button className="map-chip discover-chip" onClick={()=>onExplore(AppView.ROLE_HUB)}><Icon name="search"/>Discover</button><button className="map-chip build-chip" onClick={()=>onExplore(AppView.RESUME_TEMPLATES)}><Icon name="layers"/>Build</button><button className="map-chip go-chip" onClick={()=>onExplore(AppView.JOB_LIST)}><Icon name="rocket_launch"/>Go</button></div>;
}

