export interface ProjectModel {

    id: number;
    projectName: string;
    projectWebsite?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
    linkedIn?: string;
    x_com?: string;
    others?: string;

    loginUrl:string;
    username: string;
    password:string; 

    projectStardDate: Date;
    projectEndDate: Date;
    status: string;
    description: string;

    fileData?:string;
    fileName?:string;
    fileSize?:string;
    fileType?:string;
}



