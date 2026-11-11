import type {Company} from '../../types';
export const INDIA_PRIORITY=['Tata Consultancy Services','Accenture in India','Infosys','Wipro','HCLTech','Cognizant','Capgemini','LTM','Tech Mahindra','Zoho','Freshworks','Hexaware','Mphasis','UST','TVS Next','Aspire Systems','L&T Technology Services','GlobalLogic','Virtusa','Bahwan CyberTek','Kumaran Systems','Appian','ValGenesis','Capco'];
const added:[string,'PRODUCT'|'SERVICE',string][]=[
 ['Tech Mahindra','SERVICE','https://careers.techmahindra.com/'],['Zoho','PRODUCT','https://www.zoho.com/careers/'],['Freshworks','PRODUCT','https://www.freshworks.com/company/careers/'],['Hexaware','SERVICE','https://hexaware.com/careers/'],['Mphasis','SERVICE','https://careers.mphasis.com/home.html'],['Aspire Systems','SERVICE','https://www.aspiresys.com/careers'],['L&T Technology Services','SERVICE','https://www.ltts.com/careers'],
];
export const INDIA_COMPANIES:Company[]=added.map(([name,category,careersPage])=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,category,careersPage,tagline:'India careers',logo:'',location:'India — confirm the city on the vacancy',salary:'Not provided',experience:'Check the specific opening',stack:{frontend:[],backend:[],database:[],cloud:[]},about:'',timeline:[]}));
export const companyAliases:Record<string,string[]>={
 'Tata Consultancy Services':['TCS'],'Accenture in India':['Accenture'],'HCLTech':['HCL','HCL Technologies'],'LTM':['LTIMindtree','LTI','Larsen and Toubro Infotech'],'Tech Mahindra':['TechM'],'L&T Technology Services':['LTTS'],
};
export function indiaPriority(name:string){const index=INDIA_PRIORITY.indexOf(name);return index<0?999:index;}
