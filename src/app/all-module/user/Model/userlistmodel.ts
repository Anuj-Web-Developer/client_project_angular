import { ProjectListModel } from "../../project/Model/project-list-model";
import { ProjectViewModel } from "../../project/Model/project-view-model";
import { Role } from "./role";
import { UserProjectModel } from "./user-project-model";

export interface UserListModel {
    id: number;
    name: string;
    designation: string;
    contactNo: string;
    email: string;
    createdTime?: string;
    status: number | null;
    password?: string;
    employeeId?: string;
    project?: UserProjectModel[];
    roles?: Role[];
    isAllowedCreateProject:boolean;
    username:string;
}
