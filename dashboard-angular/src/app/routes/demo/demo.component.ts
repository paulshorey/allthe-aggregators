import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CorrosionService } from "src/app/services/corrosion.service";

@Component({
    selector: "demo-component",
    templateUrl: "./demo.component.html",
    styleUrls: ["./demo.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export default class DemoComponent implements OnInit {
    /*
    data (model)
  */
    status: any = {
        classList: ""
    };
    statusClass: any = "";
    statusClassMake = function(status) {
        if (status.classList.indexOf("-na") === -1 && status.classList.indexOf("-ok") === -1) {
            return status.classList;
        } else {
            return status.classList;
        }
    };
    constructor(private corrosionService: CorrosionService) {
        this.status = corrosionService.get("status");
        this.statusClass = this.statusClassMake(this.status);
    }
    /*
    component ready (DOM is not ready)
  */
    ngOnInit() {
        this.corrosionService.statusUpdated.subscribe(status => {
            (<any>window).bodyOnResize();
            this.status = status;
            this.statusClass = this.statusClassMake(status);
            if (this.statusClass.indexOf("-bad") !== -1 && this.status.correction_corrosionInhibitor.add) {
                setTimeout(function() {
                    window.scroll({
                        left: (<any>window).document.querySelector("div[box-lifetime-calculated]").offsetLeft,
                        behavior: "smooth"
                    });
                }, 1000);
            }
            // console.log("statusUpdated", this.status);
        });
    }
}
