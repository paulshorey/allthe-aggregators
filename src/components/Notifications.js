import React from "react";
import { connect } from 'react-redux';
import { Toaster } from "@blueprintjs/core";
import "./Notifications.scss";

class ThisComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toaster = Toaster;
  }
  addToast = (toast) => {
      toast.className = "umWhat";
      toast.timeout = 5000;
      this.toaster.show(toast);
  }
  render() {
    if (this.props.ui.toast) {

      /*
        first, close all old toasts
      */
      // if previous toast was success, and new one is warning, close all previous
      if (this.toaster.state.toasts.length) {
        if (this.toaster.state.toasts[this.toaster.state.toasts.length-1].intent === "success") {
          if (this.props.ui.toast.intent != "success") {
            this.toaster.state.toasts.forEach((toast)=>{
              this.toaster.dismiss(toast.key);
            });
          }
        }
      }
      // if new one is success, close all previous
      if (this.props.ui.toast.intent === "success") {
        this.toaster.state.toasts.forEach((toast)=>{
          this.toaster.dismiss(toast.key);
        });
      }
      // then add new one
      this.addToast({
        /*action: {
          href: "https://www.google.com/search?q=toast&source=lnms&tbm=isch",
          target: "_blank",
          text: <strong>Yum.</strong>,
        },
        button: "Procure toast",*/
        intent: this.props.ui.toast.intent,
        message: this.props.ui.toast.message
      });
    }
    return (
      <Toaster ref={(ref: Toaster) => (this.toaster = ref)} />
    )
  }
}

const mapStateToProps = function(state) {
  return {
    ui: state.ui
  }
}
export default connect(mapStateToProps)(ThisComponent);