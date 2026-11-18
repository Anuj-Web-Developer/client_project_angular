import { CustomerModel } from "../../customer-dashboard/Model/customer-model";

export interface ProjectInfo {
  id: number;
  projectName: string;
  projectWebsite: string;
  projectStartDate: Date;
  projectEndDate: Date;
  status: string;
  customer: CustomerModel;  
}