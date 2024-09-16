export const hideContainerPairs = (containerPairs: Map<HTMLElement, HTMLElement>, showSidebar: Boolean) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const original = entry.target as HTMLElement;
        if (containerPairs.has(original)) {
          const copy = containerPairs.get(original);

          if (copy) {
            if (entry.isIntersecting) {
              copy.style.transition = "all 0.3s ease-out";
              copy.style.opacity = "1";
              copy.style.position = "static";
              copy.style.width = "";
              copy.style.height = "";
              copy.style.padding = "5px";
              copy.style.border = "2px solid grey";
              copy.style.borderRadius = "5px";
              copy.style.marginTop = "0.2em";
              copy.style.marginBottom = "0.2em";
              copy.style.transform = "scaleY(1)";
            } else {
              copy.style.transition = "all 0s ease-in";
              copy.style.opacity = "0";
              copy.style.position = "absolute";
              copy.style.width = "0";
              copy.style.height = "0";
              copy.style.transform = "scaleY(0)";
            }
          }

          if(showSidebar) {
            original.style.visibility = "hidden";
            original.style.marginBottom = `-${original.offsetHeight}px`;
          }
          else{
            console.log("Unhide: ", original);
            original.style.visibility = "visible";
            original.style.marginBottom = "0px";
            console.log("Now: ", original);
          }
        }
      });
    },
    { threshold: 0.1 }
  );

  containerPairs.forEach((_, originalElement) => {
    observer.observe(originalElement);
  });

  return () => {
    observer.disconnect();
  };
};



export default hideContainerPairs;