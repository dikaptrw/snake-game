import { useClientMediaQuery } from "./useClientMediaQuery";

const useDevice = () => {
  const isMobile = useClientMediaQuery(`(max-width: 640px)`);
  const isTablet = useClientMediaQuery(`(max-width: 1024px`);
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useDevice;
