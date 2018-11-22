import { Directive, HostListener, EventEmitter, Output } from "@angular/core";

@Directive({
    selector: "[scroll-directive]"
})
export class ScrollDirective {

    // <summary>
    // Event ouptut the current scroll percentage
    // </summary>
    @Output() onScroll = new EventEmitter<number>();

    // <summary>
    // Holds the current percent value
    // </summary>
    percentValue: number = 0;
    
    // <summary>
    // Event listener for scroll event on the specific ui element
    // </summary>
    @HostListener("scroll", ["$event"])
    onListenerTriggered(event: UIEvent): void {

        // Calculate the scroll percentage
        const percent = Math.round((event.srcElement.scrollTop / (event.srcElement.scrollHeight - event.srcElement.clientHeight)) * 100);

        // Compare the new with old and only raise the event if values change
        if(this.percentValue !== percent){
          
          // Update the percent value
          this.percentValue = percent;

          // Emit the event
          this.onScroll.emit(percent);
        }
    }
}