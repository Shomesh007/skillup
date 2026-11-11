import React from 'react';
import { AppView } from '../types';
import RoleWorkbench from './workspace/RoleWorkbench';
export default function GraduateRoleTargeterView({onSelectRole,onNavigate}:{onOpenCoaching:()=>void;onSelectRole?:(role:string)=>void;onNavigate?:(view:AppView)=>void}){return <RoleWorkbench mode="graduate" onBrowseCompanies={onSelectRole} onNavigate={onNavigate}/>;}
