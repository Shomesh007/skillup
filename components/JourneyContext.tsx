import React from 'react';
import {AppView} from '../types';
import {Journey} from '../src/domain/journey';
import {useStoredState} from './workspace/UI';
export default function JourneyContext({view,onEdit}:{view:AppView;onEdit:()=>void}){const [journey]=useStoredState<Journey|null>('skillup.journey',null);if(!journey||journey.destination!==view)return null;return <section className="journey-context" aria-label="Your onboarding goal"><div><strong>{journey.label}</strong><span>{journey.reason}</span></div><button onClick={onEdit}>Change goal</button></section>;}
