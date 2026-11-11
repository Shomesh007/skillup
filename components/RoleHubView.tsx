import React from 'react';
import RoleWorkbench from './workspace/RoleWorkbench';
export default function RoleHubView({onSelectRole}:{onSelectRole:(role:string)=>void}){return <RoleWorkbench onBrowseCompanies={onSelectRole}/>;}
