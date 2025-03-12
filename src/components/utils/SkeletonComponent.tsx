import { Skeleton } from '@/components/ui/skeleton';

const SkeletonComponent = () => {
  return (
    <div className="flex flex-col ">
      <Skeleton className="w-full h-[50px] sm:w-[450px]" />
      <div className="flex flex-col gap-4 mt-10">
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-2 sm:mr-5" />
          <Skeleton className="h-8 sm:h-4 w-full sm:w-[500px]" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-2 sm:mr-5" />
          <Skeleton className="h-8 sm:h-4 w-full  sm:w-[520px]" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-2 sm:mr-5" />
          <Skeleton className="h-8 sm:h-4 w-full sm:w-[545px]" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-2 sm:mr-5" />
          <Skeleton className="h-8 sm:h-4 w-full sm:w-[500px]" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-4 w-4 rounded-full mr-2 sm:mr-5" />
          <Skeleton className="h-8 sm:h-4 w-full sm:w-[480px]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonComponent;
