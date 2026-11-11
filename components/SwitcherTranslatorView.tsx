import React from 'react';
import { AppView } from '../types';
import ExperienceDraft from './workspace/ExperienceDraft';
export default function SwitcherTranslatorView({onNavigate}:{onOpenCoaching:()=>void;onNavigate?:(view:AppView)=>void}){return <ExperienceDraft onNavigate={onNavigate}/>;}
