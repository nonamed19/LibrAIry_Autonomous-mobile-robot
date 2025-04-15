interface Step {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative mb-8 w-full max-w-4xl mx-auto">
      <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 transform -translate-y-1/2" />
      <div
        className="absolute top-1/2 left-0 h-2 bg-orange transition-all duration-500 ease-in-out transform -translate-y-1/2"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                ${
                  index <= currentStep
                    ? "bg-orange text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="text-sm md:text-base lg:text-lg font-medium">
                  {index + 1}
                </span>
              )}
            </div>
            <span
              className={`text-sm md:text-base lg:text-lg ${index <= currentStep ? "text-orange font-extrabold" : "text-gray-400 font-medium"}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
