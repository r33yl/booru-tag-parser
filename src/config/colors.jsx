// colors.jsx
export const colors = {
    // ===== Layout =====
    bg: "bg-neutral-900",
    pageMotion: "!transition-colors !duration-300 will-change-transform",

    // ===== Text =====
    text: "text-neutral-100 will-change-transform",
    secondaryText: "text-neutral-300",
    secondaryTextHover: "hover:text-white",
    textMotion: "!transition-colors !duration-200",
    textHoverBright: "hover:brightness-125",
    hintText: "text-neutral-500 text-sm",

    // ===== Inputs =====
    inputBg: "bg-neutral-800 will-change-transform",
    inputPlaceholder: "placeholder-neutral-400",
    inputFocusRing: "focus:ring-2",
    inputFocus: "focus:ring-blue-500",
    inputFocusBorder: "focus:border-blue-500",
    inputFocusError: "ring-1 ring-red-500 focus:border-red-500",
    inputMotion: "!transition-all !duration-200",
    inputInteractive: "hover:brightness-105 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",

    // #boom:hover {	
    //     -webkit-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
    //        -moz-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
    //          -o-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
    //         -ms-transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
    //             transform: scale(1.1) translate3d( 0, 0, 0) perspective(1px);
    //   }

    // ===== Divider =====
    divider: "bg-neutral-600",

    // ===== Buttons (primary) =====
    button: "bg-blue-700 will-change-transform",
    buttonHover: "hover:bg-blue-600",
    buttonText: "text-white",
    buttonTextDisable: "text-neutral-200",
    buttonBorder: "border-blue-700",
    buttonBorderDisable: "border-neutral-600",
    buttonMotion: "!transition-all !duration-200",
    buttonShadowHover: "hover:shadow-md",
    buttonScale: "hover:scale-[1.02] active:scale-[0.98]",

    // ===== Buttons (confirm/positive) =====
    buttonConfirm: "bg-green-600 will-change-transform",
    buttonConfirmHover: "hover:bg-green-500",

    // ===== Headings =====
    headingMotion: "!transition-transform !duration-300 will-change-transform",
    headingScaleHover: "hover:scale-[1.02] will-change-transform",

    // Footer
    footerLink: "!transition-all !duration-200 hover:text-white hover:-translate-y-0.5 hover:scale-[1.02] inline-block will-change-transform",

};
