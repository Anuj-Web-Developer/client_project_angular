export interface UserProjectModel {

    id: number;
    projectName: string;
    projectWebsite: string;
    username: string;
    password: string;
    serverUrl: string;
    serverUsername: string;
    serverPassword: string;
    projectStartDate: string;
    projectEndDate: string;
    status?:string;

}
