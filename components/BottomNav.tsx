import React from 'react';
import { AppView } from '../types';
import { Icon } from './Brand';
export default function BottomNav({currentView,dashboardView=AppView.PROFILE_HUB,onViewChange}:{currentView:AppView;dashboardView?:AppView;onViewChange:(view:AppView)=>void}){
 return <nav className="mobile-bottom-nav" aria-label="Main workspace navigation">{[{view:dashboardView,icon:'space_dashboard',label:'Home'},{view:AppView.ROLE_HUB,icon:'explore',label:'Explore'},{view:AppView.AI_CHAT,icon:'chat_bubble_outline',label:'Guidance'},{view:AppView.RESUME_TEMPLATES,icon:'description',label:'Resume'},{view:AppView.JOB_LIST,icon:'work_outline',label:'Jobs'}].map(item=><button key={item.view} aria-current={currentView===item.view?'page':undefined} className={currentView===item.view?'active':''} onClick={()=>onViewChange(item.view)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>;
}
