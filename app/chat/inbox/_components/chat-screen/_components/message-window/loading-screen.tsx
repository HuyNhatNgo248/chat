import Spinner from "@/components/shared/spinner";

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center select-none pointer-events-none">
      <Spinner />
    </div>
  );
};

export default LoadingScreen;
