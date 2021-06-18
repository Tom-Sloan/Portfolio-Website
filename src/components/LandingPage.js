import { useRef, useEffect } from "react";

export function LandingPage() {
  const landingPageRef = useRef(null);

  useEffect(()=>{
    if (document.cookie.includes("landingPage")) {
        console.log("here");
        document
          .querySelector(".App")
          .scrollTo(0, landingPageRef.current.clientHeight);
      } else {
        console.log("not here");
        document.cookie =
          "landingPage=visited; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      }
  })
  return (
    <div
      ref={landingPageRef}
      style={{ height: "100vh" }}
      onClick={(e) => {
        document
          .querySelector(".App")
          .scrollTo(0, landingPageRef.current.clientHeight);
      }}
    >
      Here
    </div>
  );
}
