
export class brown {
    a:number;

    constructor() {
        this.a = 10;
        let ui = <HTMLDivElement>document.getElementById("ui");
        let p = <HTMLParagraphElement>document.createElement("p");
        p.innerText = "Hello!!!!";
        ui.appendChild(p);
    }

}