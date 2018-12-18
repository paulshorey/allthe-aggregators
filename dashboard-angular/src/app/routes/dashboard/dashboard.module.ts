import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import DashboardComponent from "./dashboard.component";
// import FormLogin from "src/app/components/form-login/form-login.component";
// import FormRegister from "src/app/components/form-register/form-register.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: "",
                component: DashboardComponent
            }
        ]),
    ],
    exports: [],
    declarations: [DashboardComponent],
    providers: []
})
export default class DashboardModule {}
