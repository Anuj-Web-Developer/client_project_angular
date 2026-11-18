import { CustomerListModel } from "../../customer/Model/customer-list-model";

export interface ProjectViewModel {

    id: number | null;
    projectName: string;
    projectWebsite: string;

    loginUrl:string;
    username: string;
    password: string;

    serverUrl:string;
    serverUsername:string;
    serverPassword:string;

    socialMedia: string;
    projectStartDate: string;
    projectEndDate: string;
    status: string | null;
    description: string;
    customer: CustomerListModel;
    isSendEmail?:boolean;
    createdAt?: string;

    loginAttachment?: string;
	serverAttachment1?: string;
	serverAttachment2?: string;

}
  