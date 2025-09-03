export const NeuroDashLogo = ({
  className = ""
}: {
  className?: string;
}) => {
  return <div className={`flex items-center gap-3 ${className}`}>
      <img src="/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png" alt="NeuroDash Logo" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg" />
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold text-gradient">
          NeuroDash
        </h1>
        
      </div>
    </div>;
};