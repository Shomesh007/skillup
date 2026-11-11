import React from 'react';
import { AppView } from '../types';
import ApplicationReview from './workspace/ApplicationReview';
export default function GraduateShortlistFixerView({onNavigate}:{onOpenCoaching:()=>void;onNavigate?:(view:AppView)=>void}){return <ApplicationReview onNavigate={onNavigate}/>;}
